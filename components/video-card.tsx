"use client"

import Link from "next/link"
import { Play } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { memo } from "react"

interface VideoCardProps {
    id: string
    title: string
    thumbnail: string
    channelTitle: string
    channelThumbnail?: string
    publishedAt: string
}

export const VideoCard = memo(function VideoCard({
    id,
    title,
    thumbnail,
    channelTitle,
    channelThumbnail,
    publishedAt
}: VideoCardProps) {
    return (
        <div className="group flex flex-col gap-2">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* Duration Badge - using mock duration if not provided since it's not in props yet */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm opacity-100">
                    12:34
                </div>

                <Link
                    href={`/watch/${id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="bg-background/90 p-3 rounded-full shadow-lg">
                        <Play className="h-5 w-5 fill-foreground text-foreground" />
                    </div>
                </Link>
            </div>
            <div className="flex gap-3 items-start">
                {channelThumbnail ? (
                    <img
                        src={channelThumbnail}
                        alt={channelTitle}
                        loading="lazy"
                        className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                        {channelTitle ? channelTitle.charAt(0) : "Y"}
                    </div>
                )}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3 className="font-semibold leading-tight text-foreground line-clamp-2 text-sm sm:text-base group-hover:text-primary transition-colors">
                        <Link href={`/watch/${id}`} className="hover:text-primary transition-colors">
                            {title}
                        </Link>
                    </h3>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="truncate">{channelTitle}</div>
                        <div>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</div>
                    </div>
                </div>
            </div>
        </div>
    )
})
