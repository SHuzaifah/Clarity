import { NextRequest, NextResponse } from "next/server";
import { fetchChannelVideos } from "@/lib/youtube-utils";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const channelId = searchParams.get("channelId");
    const handle = searchParams.get("handle");

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "YouTube API key is not configured" },
            { status: 500 }
        );
    }

    if (!channelId && !handle) {
        return NextResponse.json(
            { error: "Missing channelId or handle parameter" },
            { status: 400 }
        );
    }

    try {
        // Use our robust Sync Engine (DB-backed)
        const videos = await fetchChannelVideos((channelId || handle) as string);

        if (!videos || videos.length === 0) {
            return NextResponse.json({
                videos: [],
                channel: { title: handle || channelId || "Unknown" }
            });
        }

        // Map to expected frontend format
        const responseVideos = videos.map(v => ({
            channelId: v.channelId,
            channelTitle: v.channelTitle,
            videoId: v.id,
            videoTitle: v.title,
            thumbnailUrl: v.thumbnail,
            publishedAt: v.publishedAt,
        }));

        // Derive channel info from the first video
        // Note: fetchChannelVideos ensures videos belong to the requested channel
        const firstVideo = videos[0];
        const channelInfo = {
            id: firstVideo.channelId,
            title: firstVideo.channelTitle,
            url: `https://www.youtube.com/channel/${firstVideo.channelId}`
        };

        return NextResponse.json({
            channel: channelInfo,
            videos: responseVideos,
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
