import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    )
}

export function VideoCardSkeleton() {
    return (
        <div className="group flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="flex gap-3 items-start">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        </div>
    )
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <VideoCardSkeleton key={i} />
            ))}
        </div>
    )
}
