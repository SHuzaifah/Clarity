"use server";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { fetchChannelVideos, type Video } from "@/lib/youtube-utils";
import { CHANNELS } from "@/lib/channels";

interface UserPreferences {
    watchedChannels: Map<string, number>; // channelId -> watch count
    savedChannels: Map<string, number>; // channelId -> saved count
    recentlyWatchedVideoIds: Set<string>;
}

async function getUserPreferences(userId: string): Promise<UserPreferences> {
    const supabase = await createClient();

    // Get watch history
    const { data: history } = await supabase
        .from('watch_history')
        .select('video_id, channel_id')
        .eq('user_id', userId)
        .order('watched_at', { ascending: false })
        .limit(50);

    // Get saved videos
    const { data: collections } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', userId);

    const collectionIds = collections?.map(c => c.id) || [];

    let savedVideos: any[] = [];
    if (collectionIds.length > 0) {
        const { data } = await supabase
            .from('collection_items')
            .select('video_id')
            .in('collection_id', collectionIds);
        savedVideos = data || [];
    }

    // Get channel info for saved videos
    const savedVideoIds = savedVideos.map(v => v.video_id);
    let savedChannelIds: string[] = [];

    if (savedVideoIds.length > 0) {
        const { data: videos } = await supabase
            .from('videos')
            .select('channel_id')
            .in('id', savedVideoIds);
        savedChannelIds = videos?.map(v => v.channel_id) || [];
    }

    // Build preference maps
    const watchedChannels = new Map<string, number>();
    const savedChannels = new Map<string, number>();
    const recentlyWatchedVideoIds = new Set<string>();

    history?.forEach(item => {
        if (item.channel_id) {
            watchedChannels.set(item.channel_id, (watchedChannels.get(item.channel_id) || 0) + 1);
        }
        recentlyWatchedVideoIds.add(item.video_id);
    });

    savedChannelIds.forEach(channelId => {
        savedChannels.set(channelId, (savedChannels.get(channelId) || 0) + 1);
    });

    return { watchedChannels, savedChannels, recentlyWatchedVideoIds };
}

function scoreChannel(channelId: string, preferences: UserPreferences): number {
    const watchScore = preferences.watchedChannels.get(channelId) || 0;
    const saveScore = (preferences.savedChannels.get(channelId) || 0) * 2; // Saved videos weighted higher
    return watchScore + saveScore;
}

export async function getPersonalizedRecommendations(userId: string): Promise<Video[]> {
    const preferences = await getUserPreferences(userId);

    // Score all channels based on user preferences
    const channelScores = CHANNELS.map(channel => {
        const channelId = channel.id || '';
        const score = scoreChannel(channelId, preferences);
        return { channel, score };
    }).sort((a, b) => b.score - a.score);

    // If user has no history, return from all channels equally
    const hasHistory = preferences.watchedChannels.size > 0 || preferences.savedChannels.size > 0;

    let channelsToFetch: typeof CHANNELS;

    if (hasHistory) {
        // Prioritize top channels but include some variety
        // Reduced from 8 to 5 for faster initial load
        const topChannels = channelScores.slice(0, 5).map(c => c.channel);
        const otherChannels = channelScores.slice(5).map(c => c.channel);

        // 70% from preferred channels, 30% for discovery
        const numPreferred = Math.ceil(topChannels.length * 0.7);
        const numDiscovery = Math.min(2, Math.floor(otherChannels.length * 0.3));

        channelsToFetch = [
            ...topChannels.slice(0, numPreferred),
            ...otherChannels.slice(0, numDiscovery)
        ];
    } else {
        // New user - show diverse content but limit to 6 channels
        channelsToFetch = CHANNELS.slice(0, 6);
    }

    // Fetch videos from selected channels
    const videosPromises = channelsToFetch.map(channel =>
        fetchChannelVideos(channel.id || channel.handle || "")
    );

    const results = await Promise.all(videosPromises);

    // Flatten and filter out already watched videos
    const allVideos = results
        .flat()
        .filter(video => !preferences.recentlyWatchedVideoIds.has(video.id));

    // Score videos based on channel preference
    const scoredVideos = allVideos.map(video => {
        const channelScore = scoreChannel(video.channelId, preferences);
        const recencyScore = new Date(video.publishedAt).getTime() / 1000000000; // Newer = higher
        const totalScore = channelScore * 2 + recencyScore; // Channel preference weighted higher

        return { video, score: totalScore };
    });

    // Sort by score and return top 20 (reduced from 50)
    return scoredVideos
        .sort((a, b) => {
            const scoreDiff = b.score - a.score;
            if (scoreDiff !== 0) return scoreDiff;
            // Use video ID as tiebreaker for deterministic sorting
            return a.video.id.localeCompare(b.video.id);
        })
        .slice(0, 20)
        .map(item => item.video);
}
