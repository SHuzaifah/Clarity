import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { type Video } from "@/lib/youtube-utils";
import { Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get personalized recommendations based on user's watch history and saved videos
    const { getPersonalizedRecommendations } = await import("@/lib/actions/recommendations");
    const latestVideos = await getPersonalizedRecommendations(user.id);

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Recommended Videos */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Recommended for You</h2>
                    </div>
                    {latestVideos.length === 0 ? (
                        <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
                            {process.env.YOUTUBE_API_KEY ? "No videos found." : "Please add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local"}
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {latestVideos.map((video: Video) => (
                                <div key={video.id} className="group flex flex-col gap-2">
                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <Link href={`/watch/${video.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-background/90 p-3 rounded-full shadow-lg">
                                                <Play className="h-5 w-5 fill-foreground text-foreground" />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        {video.channelThumbnail ? (
                                            <img
                                                src={video.channelThumbnail}
                                                alt={video.channelTitle}
                                                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                                                {video.channelTitle ? video.channelTitle.charAt(0) : "Y"}
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <h3 className="font-semibold leading-tight text-foreground line-clamp-2 text-sm sm:text-base">
                                                <Link href={`/watch/${video.id}`} className="hover:text-primary transition-colors">
                                                    {video.title}
                                                </Link>
                                            </h3>
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                <div className="truncate">{video.channelTitle}</div>
                                                <div>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppShell>
    );
}
