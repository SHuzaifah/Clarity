"use client"

import { useEffect, useState } from "react"
import { type Video } from "@/lib/youtube-utils"
import { VideoGridSkeleton } from "@/components/ui/skeleton"
import { VideoCard } from "@/components/video-card"

export function DashboardContent({ userId }: { userId: string }) {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        async function fetchRecommendations() {
            try {
                const res = await fetch(`/api/recommendations?userId=${userId}`)
                if (!res.ok) throw new Error("Failed to fetch recommendations")

                const data = await res.json()
                if (mounted) {
                    setVideos(data.videos || [])
                    setLoading(false)
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "An error occurred")
                    setLoading(false)
                }
            }
        }

        fetchRecommendations()

        return () => {
            mounted = false
        }
    }, [userId])

    if (loading) {
        return (
            <div className="space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Recommended for You</h2>
                    </div>
                    <VideoGridSkeleton count={8} />
                </section>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Recommended for You</h2>
                </div>
                {videos.length === 0 ? (
                    <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
                        No videos found. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                id={video.id}
                                title={video.title}
                                thumbnail={video.thumbnail}
                                channelTitle={video.channelTitle}
                                channelThumbnail={video.channelThumbnail}
                                publishedAt={video.publishedAt}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
