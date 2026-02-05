"use client";

import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
    videoId: string;
}

export function YouTubePlayerDirect({ videoId }: YouTubePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("🎬 Direct YouTube Player mounting with videoId:", videoId);

        if (!videoId) {
            setError("No video ID provided");
            return;
        }

        // Load YouTube IFrame API
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Create player when API is ready
        (window as any).onYouTubeIframeAPIReady = () => {
            console.log("✅ YouTube IFrame API ready");

            if (containerRef.current) {
                new (window as any).YT.Player(containerRef.current, {
                    height: "100%",
                    width: "100%",
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                    },
                    events: {
                        onReady: (event: any) => {
                            console.log("✅ YouTube player ready");
                        },
                        onError: (event: any) => {
                            console.error("❌ YouTube player error:", event.data);
                            setError(`YouTube Error Code: ${event.data}`);
                        },
                    },
                });
            }
        };

        return () => {
            // Cleanup
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, [videoId]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-red-900/20 text-red-400 p-4">
                <div className="text-center">
                    <p className="font-semibold">Error loading video</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[400px] bg-black">
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}
