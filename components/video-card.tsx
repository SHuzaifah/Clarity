"use client"

import Link from "next/link"
import { Play } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { memo, useMemo } from "react"

interface VideoCardProps {
    id: string
    title: string
    thumbnail: string
    channelTitle: string
    channelThumbnail?: string
    publishedAt: string
    duration?: string
}

export const VideoCard = memo(function VideoCard({
    id,
    title,
    thumbnail,
    channelTitle,
    channelThumbnail,
    publishedAt,
    duration
}: VideoCardProps) {
    // Basic ISO 8601 duration parser (PT#H#M#S) to H:MM:SS or MM:SS
    const formattedDuration = useMemo(() => {
        if (!duration) return null;
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return null;

        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');

        const h = hours ? parseInt(hours) : 0;
        const m = minutes ? parseInt(minutes) : 0;
        const s = seconds ? parseInt(seconds) : 0;

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, [duration]);

    return (
        <div className="group flex flex-col gap-2">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                <img
                    src={thumbnail}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <Link href={`/watch/${id}`} className="absolute inset-0 z-10" />

                {/* Duration Badge */}
                {formattedDuration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm opacity-100 z-20 pointer-events-none">
                        {formattedDuration}
                    </div>
                )}
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
