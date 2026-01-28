"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const FocusPlayer = dynamic(
    () => import("@/components/focus-player").then(mod => ({ default: mod.FocusPlayer })),
    {
        loading: () => (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                <div className="text-white text-center space-y-4">
                    <Skeleton className="h-12 w-64 mx-auto bg-white/10" />
                    <p className="text-sm text-white/60">Loading player...</p>
                </div>
            </div>
        ),
        ssr: false
    }
)

interface FocusPlayerWrapperProps {
    videoId: string
    title: string
    thumbnailUrl: string
    description?: string
    channelId?: string
    channelTitle?: string
    nextStepUrl?: string
    onComplete?: () => void
}

export function FocusPlayerWrapper(props: FocusPlayerWrapperProps) {
    return <FocusPlayer {...props} />
}
