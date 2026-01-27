import { google } from "googleapis";

const youtube = google.youtube("v3");

export interface Channel {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    subscriberCount: string;
    videoCount: string;
}

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
}

export async function getChannelDetails(channelId: string): Promise<Channel | null> {
    try {
        const response = await youtube.channels.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ["snippet", "statistics"],
            id: [channelId],
        });

        const item = response.data.items?.[0];
        if (!item) return null;

        return {
            id: item.id!,
            title: item.snippet?.title || "",
            description: item.snippet?.description || "",
            thumbnailUrl: item.snippet?.thumbnails?.high?.url || "",
            subscriberCount: item.statistics?.subscriberCount || "0",
            videoCount: item.statistics?.videoCount || "0",
        };
    } catch (error) {
        console.error("Error fetching channel details:", error);
        return null;
    }
}

export async function getLatestVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
    try {
        const response = await youtube.search.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ["snippet"],
            channelId: channelId,
            order: "date",
            maxResults: maxResults,
            type: ["video"],
        });

        return (response.data.items || []).map((item) => ({
            id: item.id?.videoId || "",
            title: item.snippet?.title || "",
            description: item.snippet?.description || "",
            thumbnailUrl: item.snippet?.thumbnails?.medium?.url || "",
            publishedAt: item.snippet?.publishedAt || "",
            channelId: item.snippet?.channelId || "",
            channelTitle: item.snippet?.channelTitle || "",
        }));
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
        const response = await youtube.videos.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ["snippet"],
            id: [videoId],
        });

        const item = response.data.items?.[0];
        if (!item) return null;

        return {
            id: item.id || videoId,
            title: item.snippet?.title || "",
            description: item.snippet?.description || "",
            thumbnailUrl: item.snippet?.thumbnails?.high?.url || "",
            publishedAt: item.snippet?.publishedAt || "",
            channelId: item.snippet?.channelId || "",
            channelTitle: item.snippet?.channelTitle || "",
        };
    } catch (error) {
        console.error("Error fetching video details:", error);
        return null;
    }
}
