
import { FocusPlayerWrapper } from "@/components/focus-player-wrapper";
import { getVideoDetails } from "@/lib/youtube";

export default async function WatchPage({ params }: { params: Promise<{ videoId: string }> }) {
    const { videoId } = await params;

    const video = await getVideoDetails(videoId);
    const title = video?.title || "Focus Session";
    const thumbnailUrl = video?.thumbnailUrl || "";

    return (
        <FocusPlayerWrapper
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
