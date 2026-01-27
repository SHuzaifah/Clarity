import { AppShell } from "@/components/layout/app-shell";
import { CHANNELS, type ChannelCategory } from "@/lib/channels";
import { LibraryClient } from "@/app/library/library-client";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
    const supabase = await createClient();
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Fetch channel thumbnails from database
    const { data: videos } = await supabase
        .from('videos')
        .select('channel_id, channel_title, channel_thumbnail_url')
        .not('channel_thumbnail_url', 'is', null)
        .limit(1000);

    // Create a map of channel thumbnails
    const channelThumbnails = new Map<string, string>();
    videos?.forEach(v => {
        if (v.channel_thumbnail_url && !channelThumbnails.has(v.channel_id)) {
            channelThumbnails.set(v.channel_id, v.channel_thumbnail_url);
        }
    });

    // Enrich channels with thumbnails
    const enrichedChannels = await Promise.all(CHANNELS.map(async (channel) => {
        // Try to find thumbnail by channel ID or by matching channel title
        let thumbnail = channel.id ? channelThumbnails.get(channel.id) : undefined;

        if (!thumbnail && videos) {
            const matchingVideo = videos.find(v =>
                v.channel_title?.toLowerCase() === channel.name.toLowerCase()
            );
            thumbnail = matchingVideo?.channel_thumbnail_url;
        }

        // If still no thumbnail and we have API key, fetch from YouTube
        if (!thumbnail && apiKey && channel.handle) {
            try {
                const cleanHandle = channel.handle.startsWith('@') ? channel.handle : `@${channel.handle}`;
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${cleanHandle}&key=${apiKey}`,
                    { next: { revalidate: 86400 } } // Cache for 24h
                );
                const data = await res.json();
                if (data.items?.[0]?.snippet?.thumbnails) {
                    thumbnail = data.items[0].snippet.thumbnails.default?.url ||
                        data.items[0].snippet.thumbnails.medium?.url;
                }
            } catch (e) {
                console.error(`Failed to fetch thumbnail for ${channel.name}`, e);
            }
        }

        return {
            ...channel,
            thumbnailUrl: thumbnail
        };
    }));

    return (
        <AppShell>
            <LibraryClient channels={enrichedChannels} />
        </AppShell>
    );
}
