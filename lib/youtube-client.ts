export interface YouTubeVideo {
    channelId: string;
    channelTitle: string;
    channelUrl: string;
    videoId: string;
    videoTitle: string;
    thumbnailUrl: string;
    publishedAt: string;
}

export interface YouTubeApiResponse {
    channel: {
        id: string;
        title: string;
        url: string;
    };
    videos: YouTubeVideo[];
    error?: string;
}

/**
 * Fetches videos for a given channel ID or Handle from our internal API.
 * This is safe to call from the client side.
 */
export async function getChannelVideos(identifier: { channelId?: string; handle?: string }): Promise<YouTubeVideo[]> {
    try {
        const params = new URLSearchParams();
        // Since this is called from client or server, we need absolute URL if server-side, 
        // or relative if client-side.
        // For server components (which DashboardPage is), we usually call the logic directly 
        // OR fetch the full URL. 
        // Given the requirement to show "how frontend should consume", this is the client helper.

        if (identifier.channelId) params.append("channelId", identifier.channelId);
        if (identifier.handle) params.append("handle", identifier.handle);

        const response = await fetch(`/api/youtube/videos?${params.toString()}`, {
            next: { revalidate: 3600 } // Cache for 1 hour if using Next.js fetch
        });

        if (!response.ok) {
            console.error("Failed to fetch videos");
            return [];
        }

        const data: YouTubeApiResponse = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return [];
        }

        return data.videos;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}
