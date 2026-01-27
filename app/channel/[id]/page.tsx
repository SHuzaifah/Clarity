"use client";

import { use } from "react"; // Unwrapping params
import { AppShell } from "@/components/layout/app-shell";
import { type YouTubeVideo } from "@/lib/youtube-client";
import { Play, Clock, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ChannelPageProps {
    params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
    const { id: rawId } = use(params);
    const decodedId = decodeURIComponent(rawId);

    // Determine if it's a handle or ID
    const isHandle = decodedId.startsWith("@");
    const channelId = isHandle ? undefined : decodedId;
    const handle = isHandle ? decodedId : undefined;

    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [channelInfo, setChannelInfo] = useState<{ title: string; url: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadVideos() {
            setLoading(true);
            try {
                // We use our client helper which calls the backend API
                // Currently getChannelVideos returns just videos array, but we need channel info too?
                // The API actually returns { channel, videos }.
                // Let's update client helper or call API directly?
                // The requirements said: "Frontend video grid example".
                // I'll call the API route directly to get full data for better UX (Channel Title)

                const searchParams = new URLSearchParams();
                if (channelId) searchParams.append("channelId", channelId);
                if (handle) searchParams.append("handle", handle);

                const res = await fetch(`/api/youtube/videos?${searchParams.toString()}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch channel videos");
                }
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setVideos(data.videos);
                setChannelInfo(data.channel);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, [channelId, handle]);

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Channel Header */}
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                        {channelInfo?.title ? channelInfo.title.charAt(0) : (decodedId.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {loading ? "Loading..." : (channelInfo?.title || decodedId)}
                        </h1>
                        <p className="text-muted-foreground">
                            {loading ? "Fetching videos..." : (error ? "Error loading channel" : "Uploads")}
                        </p>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12">
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        No videos found.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {videos.map((video) => (
                            <div key={video.videoId} className="group flex flex-col gap-2">
                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.videoTitle}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <Link href={`/watch/${video.videoId}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-background/90 p-3 rounded-full shadow-lg">
                                            <Play className="h-5 w-5 fill-foreground text-foreground" />
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="flex flex-col gap-1 flex-1">
                                        <h3 className="font-semibold leading-tight text-foreground line-clamp-2 text-sm sm:text-base">
                                            <Link href={`/watch/${video.videoId}`} className="hover:text-primary transition-colors">
                                                {video.videoTitle}
                                            </Link>
                                        </h3>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-muted-foreground hover:text-primary p-1" title="Watch Later">
                                            <Clock className="h-4 w-4" />
                                        </button>
                                        <button className="text-muted-foreground hover:text-red-500 p-1" title="Like">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
