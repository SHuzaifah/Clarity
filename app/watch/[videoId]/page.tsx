
import { FocusPlayer } from "@/components/focus-player";
import { getVideoDetails } from "@/lib/youtube";

export default async function WatchPage({ params }: { params: Promise<{ videoId: string }> }) {
    const { videoId } = await params;

    const video = await getVideoDetails(videoId);
    const title = video?.title || "Focus Session"; // Fallback if API fails
    const thumbnailUrl = video?.thumbnailUrl || "";

    return (
        <FocusPlayer
            videoId={videoId}
            title={title}
            thumbnailUrl={thumbnailUrl}
            description={video?.description || ""}
            channelId={video?.channelId || ""}
            channelTitle={video?.channelTitle || ""}
            nextStepUrl="/dashboard"
        />
    );
}
