import { FocusPlayer } from "@/components/focus-player";
import { use } from "react";

export default function PlayNodePage({ params }: { params: Promise<{ nodeId: string }> }) {
    const { nodeId } = use(params);
    // In a real app, fetch node details from DB using params.nodeId
    const nodeData = {
        id: nodeId,
        title: "Understanding Limits (Concept)",
        videoId: "riXcZT2ICjA", // Example calculus video ID
    };

    return (
        <FocusPlayer
            videoId={nodeData.videoId}
            title={nodeData.title}
            thumbnailUrl={`https://i.ytimg.com/vi/${nodeData.videoId}/maxresdefault.jpg`}
        />
    );
}
