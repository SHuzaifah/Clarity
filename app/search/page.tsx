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
                    <div className="space-y-12">
                        {/* Channel Results */}
                        {enrichedChannels.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-lg font-medium tracking-tight text-foreground/90">Channels</h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {enrichedChannels.map(channel => {
                                        const Icon = getCategoryIcon(channel.category);
                                        return (
                                            <Link
                                                key={channel.name}
                                                href={`/channel/${channel.handle ? `%40${channel.handle}` : channel.id}`}
                                                className="group flex flex-row items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-accent/40 hover:border-primary/20 transition-all duration-300"
                                            >
                                                {channel.thumbnailUrl ? (
                                                    <img
                                                        src={channel.thumbnailUrl}
                                                        alt={channel.name}
                                                        loading="lazy"
                                                        className="h-12 w-12 shrink-0 rounded-full object-cover shadow-sm transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className={cn(
                                                        "h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105",
                                                        "bg-gradient-to-br from-zinc-600 to-zinc-800"
                                                    )}>
                                                        <Icon className="h-5 w-5 text-white/90" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium truncate text-base">{channel.name}</h3>
                                                    <p className="text-xs text-muted-foreground/80 line-clamp-1 font-medium">{channel.category.split(" · ")[0]}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Video Results */}
                        {matchedVideos.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-lg font-medium tracking-tight text-foreground/90">Videos</h2>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {matchedVideos.map((video) => {
                                        // Generate Badges
                                        const badges = [];
                                        const isNew = (new Date().getTime() - new Date(video.publishedAt).getTime()) < (30 * 24 * 60 * 60 * 1000);
                                        if (isNew) badges.push({ set: "New", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" });

                                        const titleLower = video.title.toLowerCase();
                                        if (titleLower.match(/part \d+|ep(isode)?\.? \d+|#\d+/)) badges.push({ set: "Series", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" });
                                        if (titleLower.match(/intro|beginner|basics|101/)) badges.push({ set: "Beginner", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" });
                                        if (titleLower.match(/advanced|deep dive|masterclass/)) badges.push({ set: "Advanced", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" });

                                        return (
                                            <div key={video.id} className="group flex flex-col gap-3">
                                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative shadow-sm transition-all duration-300 group-hover:shadow-md">
                                                    <img
                                                        src={video.thumbnail || ""}
                                                        alt={video.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/0 transition-colors" /> {/* Removed dark overlay effectively */}
                                                    <Link href={`/watch/${video.id}`} className="absolute inset-0 z-10" />

                                                    {/* Duration Badge */}
                                                    {video.duration && (
                                                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm z-20 pointer-events-none">
                                                            {video.duration.replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "")}
                                                        </div>
                                                    )}

                                                    {/* Badges Overlay */}
                                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 opacity-90 z-20 pointer-events-none">
                                                        {badges.map(b => (
                                                            <span key={b.set} className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold backdrop-blur-md bg-background/80",
                                                                "text-foreground/80 border border-white/10 shadow-sm"
                                                            )}>
                                                                {b.set}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-start">
                                                    {video.channelThumbnail ? (
                                                        <img
                                                            src={video.channelThumbnail}
                                                            alt={video.channelTitle}
                                                            loading="lazy"
                                                            className="h-9 w-9 rounded-full object-cover flex-shrink-0 border border-border/50"
                                                        />
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-full bg-primary/5 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary border border-border/50">
                                                            {video.channelTitle ? video.channelTitle.charAt(0) : "Y"}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                        <h3 className="font-semibold leading-snug line-clamp-2 text-sm sm:text-base group-hover:text-primary dark:group-hover:text-white transition-colors">
                                                            <Link href={`/watch/${video.id}`}>
                                                                {video.title}
                                                            </Link>
                                                        </h3>
                                                        <div className="text-xs text-muted-foreground/70 flex items-center gap-1.5 font-medium">
                                                            <span className="truncate max-w-[120px]">{video.channelTitle}</span>
                                                            <span className="text-[10px]">•</span>
                                                            <span>{new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
