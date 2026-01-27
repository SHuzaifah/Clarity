"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchVideos(query: string) {
    if (!query || query.trim().length < 2) return [];

    const supabase = await createClient();

    // Search in video titles and descriptions
    // Using ilike for case-insensitive search
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,channel_title.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(50);

    if (!videos) return [];

    return videos.map(v => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url,
        channelTitle: v.channel_title,
        channelThumbnail: v.channel_thumbnail_url,
        publishedAt: v.published_at,
        channelId: v.channel_id
    }));
}

export async function getSearchSuggestions(query: string) {
    if (!query || query.trim().length < 2) return [];

    const supabase = await createClient();

    // Get unique channel titles and common keywords
    const { data: channels } = await supabase
        .from('videos')
        .select('channel_title')
        .ilike('channel_title', `%${query}%`)
        .limit(5);

    const channelSuggestions = channels
        ? [...new Set(channels.map(c => c.channel_title))].filter(Boolean)
        : [];

    // Get common words from video titles
    const { data: videos } = await supabase
        .from('videos')
        .select('title')
        .ilike('title', `%${query}%`)
        .limit(20);

    const keywords = new Set<string>();
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'how', 'what', 'why', 'when', 'where'];

    videos?.forEach(v => {
        const words = v.title.toLowerCase().split(/\s+/);
        words.forEach((word: string) => {
            const cleaned = word.replace(/[^a-z0-9]/g, '');
            if (cleaned.length > 3 && !commonWords.includes(cleaned) && cleaned.includes(query.toLowerCase())) {
                keywords.add(cleaned);
            }
        });
    });

    return {
        channels: channelSuggestions.slice(0, 3),
        keywords: Array.from(keywords).slice(0, 5)
    };
}
