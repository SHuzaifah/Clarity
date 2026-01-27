
import { AppShell } from "@/components/layout/app-shell";
import { getCollections, getCollectionItems } from "@/lib/actions/collections";
import Link from "next/link";
import { Play, Clock, MoreVertical, Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFromCollection } from "@/lib/actions/collections";

export default async function CollectionsPage() {
    const collections = await getCollections();

    // Fetch items for all collections
    const collectionsWithItems = await Promise.all(collections.map(async (c) => {
        const items = await getCollectionItems(c.id);
        return { ...c, items };
    }));

    return (
        <AppShell>
            <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-muted-foreground">Your saved videos and playlists.</p>
                </header>

                <div className="space-y-12">
                    {collectionsWithItems.length === 0 ? (
                        <div className="text-center py-12 border border-dashed rounded-xl">
                            <p className="text-muted-foreground">No collections found. Save a video to get started!</p>
                        </div>
                    ) : (
                        collectionsWithItems.map((collection) => (
                            <section key={collection.id} className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h2 className="text-2xl font-semibold tracking-tight">{collection.name}</h2>
                                    <span className="text-sm text-muted-foreground">{collection.items.length} videos</span>
                                </div>

                                {collection.items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No videos in this collection.</p>
                                ) : (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {collection.items.map((item: any) => {
                                            const video = item.video;
                                            if (!video) return null; // Skip if video details missing

                                            return (
                                                <div key={item.id} className="group flex flex-col gap-2 relative">
                                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted relative">
                                                        <img
                                                            src={video.thumbnail_url || ""}
                                                            alt={video.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                        <Link href={`/watch/${video.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="bg-background/90 p-3 rounded-full shadow-lg">
                                                                <Play className="h-5 w-5 fill-foreground text-foreground" />
                                                            </div>
                                                        </Link>

                                                        {/* Remove Action */}
                                                        {/* This requires Client Component for interactivity or Server Action form */}
                                                        {/* For simplicity in Server Component, we omit remove button here or require 'use client' wrapper */}
                                                        {/* Keeping it read-only mostly, user removes from player page? */}
                                                        {/* Or just link to watch page */}
                                                    </div>
                                                    <div className="flex gap-3 items-start">
                                                        <div className="flex flex-col gap-1 flex-1">
                                                            <h3 className="font-semibold leading-tight text-foreground line-clamp-2 text-sm sm:text-base">
                                                                <Link href={`/watch/${video.id}`} className="hover:text-primary transition-colors">
                                                                    {video.title}
                                                                </Link>
                                                            </h3>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <span>{video.channel_title}</span>
                                                                <span>•</span>
                                                                <span>{video.published_at ? new Date(video.published_at).toLocaleDateString() : ""}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        ))
                    )}
                </div>
            </div>
        </AppShell>
    );
}
