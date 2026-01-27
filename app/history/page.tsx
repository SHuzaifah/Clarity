import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AppShell } from "@/components/layout/app-shell";

// Force dynamic rendering to ensure history is fresh
export const dynamic = 'force-dynamic';

interface HistoryItem {
    id: string;
    video_id: string;
    title: string | null;
    thumbnail_url: string | null;
    watched_at: string;
    completed: boolean;
}

export default async function HistoryPage() {
    const supabase = await createClient();

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/sign-in");
    }

    // Fetch History
    const { data: historyData, error } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false });

    if (error) {
        console.error("Error fetching history:", error);
    }

    const history = historyData as HistoryItem[] | null;

    return (
        <AppShell>
            <div className="p-8 max-w-5xl mx-auto space-y-6">
                <header className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Watch History</h1>
                    <p className="text-muted-foreground">Resume your learning journey.</p>
                </header>

                <div className="space-y-4">
                    {!history || history.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                            <p className="text-muted-foreground">No watch history yet.</p>
                            <Link href="/dashboard" className="text-primary hover:underline text-sm font-medium mt-2 inline-block">
                                Explore Videos
                            </Link>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Link
                                key={item.id}
                                href={`/watch/${item.video_id}`}
                                className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group relative overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video w-48 bg-muted rounded-lg overflow-hidden shrink-0">
                                    {item.thumbnail_url ? (
                                        <img
                                            src={item.thumbnail_url}
                                            alt={item.title || "Video thumbnail"}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-zinc-800">
                                            <PlayCircle className="h-8 w-8 text-zinc-600" />
                                        </div>
                                    )}
                                    {item.completed && (
                                        <div className="absolute top-2 right-2 bg-green-500/90 text-white p-1 rounded-full shadow-sm">
                                            <CheckCircle className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                                    <h3 className="font-semibold truncate pr-4 text-base group-hover:text-primary transition-colors">
                                        {item.title || "Untitled Video"}
                                    </h3>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span>Watched {item.watched_at ? formatDistanceToNow(new Date(item.watched_at), { addSuffix: true }) : 'Recently'}</span>
                                        {item.completed && (
                                            <>
                                                <span>•</span>
                                                <span className="text-green-500 font-medium text-[10px] uppercase tracking-wider">Completed</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {/* Description could go here if saved */}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </AppShell>
    );
}
