"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player").then(mod => mod.default), {
    ssr: false
}) as any;

export default function TestPlayer() {
    return (
        <div className="min-h-screen bg-black p-8">
            <h1 className="text-white text-2xl mb-4">ReactPlayer Test</h1>
            <div style={{ width: "100%", minHeight: "500px", backgroundColor: "#333" }}>
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    controls
                    width="100%"
                    height="500px"
                    playsinline
                    onReady={() => console.log("✅ Test player ready")}
                    onError={(error: any) => console.error("❌ Test player error:", error)}
                />
            </div>
        </div>
    );
}
