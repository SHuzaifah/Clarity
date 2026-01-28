
import { createClient } from "@/lib/supabase/server";

export interface Video {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    channelThumbnail?: string;
    publishedAt: string;
    channelId: string;
}

const INITIAL_SYNC_PAGES = 10;
const UPDATE_SYNC_PAGES = 1;

async function getChannelIdFromHandle(handle: string, apiKey: string): Promise<string | null> {
    try {
        // Handle format: @Handle
        const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`,
            { next: { revalidate: 86400 } } // Cache ID lookup for 24h
        );
        const data = await res.json();
        return data.items?.[0]?.id || null;
    } catch (e) {
        console.error(`Failed to resolve handle ${handle}`, e);
        return null;
    }
}

export const fetchChannelVideos = async (channelIdentifier: string): Promise<Video[]> => {
    const supabase = await createClient();
    const apiKey = process.env.YOUTUBE_API_KEY;

    // 0. Resolve Channel ID
    let channelId = channelIdentifier;
    // Basic heuristic: IDs start with UC... and are 24 chars usually. Handles usually don't. 
    // But strict check: passed indentifier is 'handle' if not 'UC...'? 
    // Or just try?
    // User CHANNELS list has 'AliAbdaal'.
    if (!channelId.startsWith("UC")) {
        if (!apiKey) return [];
        const resolved = await getChannelIdFromHandle(channelId, apiKey);
        if (resolved) channelId = resolved;
        else {
            console.warn(`Could not resolve channel ID for: ${channelIdentifier}`);
            return [];
        }
    }

    // 1. Determine Sync Strategy
    const { count } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', channelId);

    // If we have 0 videos, do full sync. If we have videos, just check latest page.
    const isInitialSync = count === 0;
    const maxPages = isInitialSync ? INITIAL_SYNC_PAGES : UPDATE_SYNC_PAGES;

    // 2. Perform Sync
    if (apiKey) {
        try {
            // Get Uploads ID
            const channelsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`,
                { next: { revalidate: 3600 } }
            );
            const channelsData = await channelsRes.json();

            if (channelsData.items?.length > 0) {
                const uploadsPlaylistId = channelsData.items[0].contentDetails.relatedPlaylists.uploads;
                const channelTitle = channelsData.items[0].snippet.title;
                const channelThumbnailUrl = channelsData.items[0].snippet.thumbnails?.default?.url ||
                    channelsData.items[0].snippet.thumbnails?.medium?.url;

                let pageToken = "";
                let pagesFetched = 0;
                let newVideos: any[] = [];

                do {
                    const plRes = await fetch(
                        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`,
                        { next: { revalidate: 3600 } }
                    );
                    const plData = await plRes.json();

                    if (!plData.items) break;

                    const items = plData.items.map((item: any) => ({
                        id: item.snippet.resourceId.videoId,
                        channel_id: item.snippet.channelId || channelId,
                        channel_title: item.snippet.channelTitle || channelTitle,
                        channel_thumbnail_url: channelThumbnailUrl,
                        title: item.snippet.title,
                        thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
                        published_at: item.snippet.publishedAt
                    }));

                    newVideos = [...newVideos, ...items];
                    pageToken = plData.nextPageToken;
                    pagesFetched++;

                } while (pageToken && pagesFetched < maxPages);

                if (newVideos.length > 0) {
                    // 2.1 Fetch contentDetails for duration
                    const videoIds = newVideos.map(v => v.id).join(',');
                    // YouTube API 'videos' endpoint allows up to 50 IDs. 
                    // Our pages are 50 items max, so this works perfectly.

                    try {
                        const vRes = await fetch(
                            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`,
                            { next: { revalidate: 3600 } }
                        );
                        const vData = await vRes.json();

                        if (vData.items) {
                            // Create a map of ID -> Duration
                            const durationMap: Record<string, string> = {};
                            vData.items.forEach((item: any) => {
                                durationMap[item.id] = item.contentDetails.duration;
                            });

                            // Merge duration into newVideos
                            newVideos = newVideos.map(v => ({
                                ...v,
                                duration: durationMap[v.id] || null
                            }));
                        }
                    } catch (detailsErr) {
                        console.error("Failed to fetch video details", detailsErr);
                    }

                    await supabase.from('videos').upsert(newVideos, { onConflict: 'id' });
                }
            }
        } catch (e) {
            console.error(`Sync failed for ${channelId}`, e);
        }
    }

    // 3. Return from DB
    const { data: allVideos } = await supabase
        .from('videos')
        .select('*')
        .eq('channel_id', channelId)
        .order('published_at', { ascending: false });

    if (!allVideos) return [];

    return allVideos.map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url,
        channelTitle: v.channel_title,
        channelThumbnail: v.channel_thumbnail_url,
        publishedAt: v.published_at,
        channelId: v.channel_id
    }));
};
