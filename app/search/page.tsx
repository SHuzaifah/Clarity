import { AppShell } from "@/components/layout/app-shell";
import { CHANNELS } from "@/lib/channels";
import { searchVideos } from "@/lib/actions/search";
import Link from "next/link";
import { ExternalLink, BookOpen, Code, Briefcase, Brain, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

function getCategoryIcon(category: string) {
    if (category.includes("TECH")) return Code;
    if (category.includes("EDUCATIONAL")) return BookOpen;
    if (category.includes("FINANCE")) return Briefcase;
    if (category.includes("THINKING")) return Brain;
    return Play;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";

    // Search both channels and videos
    const matchedChannels = CHANNELS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        (c.badge && c.badge.toLowerCase().includes(query.toLowerCase()))
    );

    const matchedVideos = query.trim().length >= 2 ? await searchVideos(query) : [];

    // Fetch channel thumbnails from database
    const supabase = await createClient();
    const { data: videos } = await supabase
        .from('videos')
        .select('channel_id, channel_title, channel_thumbnail_url')
        .not('channel_thumbnail_url', 'is', null)
        .limit(1000);

    // Create a map of channel thumbnails
    const channelThumbnails = new Map<string, string>();
    videos?.forEach(v => {
        if (v.channel_thumbnail_url && !channelThumbnails.has(v.channel_id)) {
            channelThumbnails.set(v.channel_id, v.channel_thumbnail_url);
        }
    });

    // Enrich matched channels with thumbnails
    const enrichedChannels = matchedChannels.map(channel => {
        let thumbnail = channel.id ? channelThumbnails.get(channel.id) : undefined;

        if (!thumbnail && videos) {
            const matchingVideo = videos.find(v =>
                v.channel_title?.toLowerCase() === channel.name.toLowerCase()
            );
            thumbnail = matchingVideo?.channel_thumbnail_url;
        }

        return {
            ...channel,
            thumbnailUrl: thumbnail
        };
    });

    const hasResults = enrichedChannels.length > 0 || matchedVideos.length > 0;

    return (
        <AppShell>
            <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                    <p className="text-muted-foreground">Results for &quot;{query}&quot; in focused universe.</p>
                </div>

                {!hasResults ? (
                    <div className="py-20 text-center bg-muted/30 rounded-xl border border-dashed">
                        <h2 className="text-xl font-semibold">No focused results found</h2>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            Clarity searches approved channels and their videos. Try searching for &quot;productivity&quot;, &quot;coding&quot;, or &quot;math&quot;.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Video Results */}
                        {matchedVideos.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold">Videos ({matchedVideos.length})</h2>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {matchedVideos.map((video) => (
                                        <div key={video.id} className="group flex flex-col gap-2">
                                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                                                <img
                                                    src={video.thumbnail || ""}
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
                                                        loading="lazy"
                                                        className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                                                        {video.channelTitle ? video.channelTitle.charAt(0) : "Y"}
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1 flex-1">
                                                    <h3 className="font-semibold leading-tight text-foreground line-clamp-2 text-sm sm:text-base">
                                                        <Link href={`/watch/${video.id}`} className="hover:text-primary transition-colors">
                                                            {video.title}
                                                        </Link>
                                                    </h3>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <span>{video.channelTitle}</span>
                                                        <span>•</span>
                                                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Channel Results */}
                        {enrichedChannels.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold">Channels ({enrichedChannels.length})</h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {enrichedChannels.map(channel => {
                                        const Icon = getCategoryIcon(channel.category);
                                        return (
                                            <Link
                                                key={channel.name}
                                                href={`/channel/${channel.handle ? `%40${channel.handle}` : channel.id}`}
                                                className="group flex flex-row items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all"
                                            >
                                                {channel.thumbnailUrl ? (
                                                    <img
                                                        src={channel.thumbnailUrl}
                                                        alt={channel.name}
                                                        loading="lazy"
                                                        className="h-12 w-12 shrink-0 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className={cn(
                                                        "h-12 w-12 shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105",
                                                        "bg-gradient-to-br from-zinc-700 to-zinc-900"
                                                    )}>
                                                        <Icon className="h-6 w-6 text-white" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold truncate">{channel.name}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{channel.category.split(" · ")[0]}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
