"use client";

import { YouTubePlayerDirect } from "@/components/youtube-player-direct";

export default function TestDirectPlayer() {
    return (
        <div className="min-h-screen bg-black p-8">
            <h1 className="text-white text-2xl mb-4">Direct YouTube IFrame API Test</h1>
            <p className="text-white/60 text-sm mb-6">
                This uses the native YouTube IFrame API instead of react-player
            </p>
            <div className="w-full" style={{ height: "500px" }}>
                <YouTubePlayerDirect videoId="fFL7la73RO4" />
            </div>
        </div>
    );
}
