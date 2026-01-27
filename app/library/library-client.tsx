"use client";

import { type ChannelCategory, type Channel } from "@/lib/channels";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, BookOpen, Code, Briefcase, Brain, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to generate consistent gradients based on string
function getGradient(name: string) {
    const hash = name.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hues = [
        "from-blue-500 to-cyan-500",
        "from-purple-500 to-pink-500",
        "from-emerald-500 to-teal-500",
        "from-orange-500 to-amber-500",
        "from-indigo-500 to-violet-500",
        "from-rose-500 to-red-500",
    ];
    return hues[Math.abs(hash) % hues.length];
}

function getCategoryIcon(category: ChannelCategory) {
    if (category.includes("TECH")) return Code;
    if (category.includes("EDUCATIONAL")) return BookOpen;
    if (category.includes("FINANCE")) return Briefcase;
    if (category.includes("THINKING")) return Brain;
    return Play; // Productivity / Default
}

interface LibraryClientProps {
    channels: (Channel & { thumbnailUrl?: string })[];
}

export function LibraryClient({ channels }: LibraryClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<ChannelCategory | "ALL">("ALL");

    // Get unique categories
    const categories = Array.from(new Set(channels.map(c => c.category)));

    const filteredChannels = selectedCategory === "ALL"
        ? channels
        : channels.filter(c => c.category === selectedCategory);

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                <p className="text-muted-foreground text-lg">Curated channels and resources for focused learning.</p>
            </header>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-border/50">
                <Button
                    variant={selectedCategory === "ALL" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory("ALL")}
                    className="rounded-full px-4"
                >
                    All
                </Button>
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full px-4 text-xs font-medium uppercase tracking-wide"
                    >
                        {category.split(" · ")[0]}
                    </Button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredChannels.map((channel) => {
                    const Icon = getCategoryIcon(channel.category);

                    return (
                        <Link
                            key={channel.name}
                            href={`/channel/${channel.handle ? `%40${channel.handle}` : channel.id}`}
                            className={cn(
                                "group relative flex flex-row items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/40 hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm"
                            )}
                        >
                            {/* Left: Channel Logo or Icon */}
                            {channel.thumbnailUrl ? (
                                <img
                                    src={channel.thumbnailUrl}
                                    alt={channel.name}
                                    className="h-14 w-14 shrink-0 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className={cn(
                                    "h-14 w-14 shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105",
                                    "bg-gradient-to-br",
                                    getGradient(channel.name)
                                )}>
                                    <Icon className="h-7 w-7 text-white drop-shadow-md" />
                                </div>
                            )}

                            {/* Right: Content */}
                            <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-foreground truncate pr-6 text-base">
                                        {channel.name}
                                    </h3>

                                    {/* Hover Access Hint */}
                                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute right-4 top-5" />
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                                    {channel.description}
                                </p>

                                <div className="mt-1.5 flex items-center">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-primary/5 text-primary border border-primary/10">
                                        {channel.badge}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
