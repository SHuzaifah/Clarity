import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { FileText, Edit, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default async function NotesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: history } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false });

    // Filter for items with actual notes content
    const notesItems = history?.filter(item => {
        const n = item.notes;
        if (!n) return false;
        // Check if any note field has content or canvas exists
        return (n.jot && n.jot.trim().length > 0) ||
            (n.summary && n.summary.trim().length > 0) ||
            (n.canvas && typeof n.canvas === 'string' && n.canvas.startsWith('data:image'));
    }) || [];

    return (
        <AppShell>
            <div className="space-y-6 max-w-7xl mx-auto p-6 sm:p-8">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Your Notebook</h1>
                    <p className="text-muted-foreground text-base">Access all your saved notes and sketches.</p>
                </header>

                {notesItems.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Start watching a video and open the Notebook sidebar to take notes or draw concepts.
                        </p>
                        <Link
                            href="/library"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Browse Library
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {notesItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/watch/${item.video_id}`}
                                className="group block h-full"
                            >
                                <div className="h-full border rounded-xl bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-full">
                                            <Calendar className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(item.watched_at), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug">
                                        {item.title || "Untitled Video"}
                                    </h3>

                                    <div className="flex-1 space-y-3">
                                        {/* Canvas Preview */}
                                        {item.notes.canvas && typeof item.notes.canvas === 'string' && (
                                            <div className="w-full h-32 bg-white dark:bg-zinc-900 rounded-lg border-2 flex items-center justify-center overflow-hidden relative shadow-sm">
                                                <img
                                                    src={item.notes.canvas}
                                                    alt="Sketch"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* Preview of note content */}
                                        {(item.notes.jot || item.notes.summary) && (
                                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                {item.notes.jot || item.notes.summary}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-3 border-t flex flex-wrap gap-1.5">
                                        {item.notes.canvas && typeof item.notes.canvas === 'string' && (
                                            <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md">
                                                Sketch
                                            </span>
                                        )}
                                        {item.notes.summary && (
                                            <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                                                Summary
                                            </span>
                                        )}
                                        {item.notes.jot && (
                                            <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
                                                Notes
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
