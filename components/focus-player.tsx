"use client";

import React, { useState, useRef } from "react";
import _ReactPlayer from "react-player";
const ReactPlayer = _ReactPlayer as any;
import {
    Maximize2,
    Minimize2,
    Sparkles,
    PenTool,
    FileText,
    BrainCircuit,
    ArrowLeft,
    Bookmark,
    AlignLeft,
    Send,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Scratchpad from "@/components/scratchpad";
import Link from "next/link";

interface FocusPlayerProps {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    description?: string;
    channelId?: string;
    channelTitle?: string;
    nextStepUrl?: string;
    onComplete?: () => void;
}

type Tab = "notes" | "ai" | "summary" | "visual" | "description" | "bookmarks";

interface BookmarkItem {
    id: string;
    time: number;
    label: string;
}

export function FocusPlayer({
    videoId,
    title,
    thumbnailUrl,
    description,
    channelTitle,
    nextStepUrl,
    onComplete
}: FocusPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>("notes");
    const [isExpanded, setIsExpanded] = useState(false);

    // Notes State
    const [notes, setNotes] = useState("");
    const [summary, setSummary] = useState("");
    const [visualData, setVisualData] = useState<string | undefined>(undefined);

    // AI Tutor State
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Bookmarks State
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

    // Use 'any' for the player ref to avoid type mismatches with the external library
    const playerRef = useRef<any>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    const handleProgress = (state: any) => {
        setProgress(state.playedSeconds);
    };

    const handleDuration = (d: number) => {
        setDuration(d);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const seekTo = (seconds: number) => {
        playerRef.current?.seekTo(seconds);
        setIsPlaying(true);
    };

    const addBookmark = () => {
        const newBookmark: BookmarkItem = {
            id: Date.now().toString(),
            time: progress,
            label: `Bookmark at ${formatTime(progress)}`
        };
        setBookmarks([...bookmarks, newBookmark]);
    };

    const removeBookmark = (id: string) => {
        setBookmarks(bookmarks.filter(b => b.id !== id));
    };

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleAiAsk = async (action: "explain" | "refine" | "socratic") => {
        if (!notes && !aiQuery && action !== 'refine') return;

        setIsAiLoading(true);

        try {
            const res = await fetch("/api/gemini/tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    userQuery: aiQuery,
                    context: {
                        videoTitle: title,
                        nodeTitle: title,
                        currentNotes: notes,
                        timestamp: Math.round(progress)
                    }
                })
            });

            const data = await res.json();

            if (data.response) {
                let cleanResponse = data.response;
                if (typeof cleanResponse === 'object') {
                    cleanResponse = JSON.stringify(cleanResponse, null, 2);
                }
                setAiResponse(cleanResponse);
            } else if (data.error) {
                setAiResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            setAiResponse("Failed to reach the AI tutor. Please try again.");
        } finally {
            setIsAiLoading(false);
            setAiQuery("");
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] bg-background overflow-hidden relative transition-all duration-500",
            isExpanded ? "fixed inset-0 z-50 h-screen" : ""
        )}>
            {/* Video Section */}
            <div className={cn(
                "w-full bg-black relative shrink-0 transition-all duration-300 ease-in-out",
                isExpanded ? "h-full" : "h-[35vh] min-h-[220px] max-h-[60vh]"
            )}>
                {!isExpanded && (
                    <div className="absolute top-2 left-2 z-10">
                        <Link href="/dashboard" className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors block">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </div>
                )}

                {/* @ts-ignore */}
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    controls={true}
                    config={{
                        youtube: {
                            playerVars: { showinfo: 0, modestbranding: 1, rel: 0, playsinline: 1 }
                        }
                    } as any}
                />

                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/50 text-white hover:bg-black/70 rounded-full backdrop-blur-sm h-8 w-8"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Content Section - Hidden in fullscreen */}
            {!isExpanded && (
                <div className="flex flex-col flex-1 min-h-0 bg-card">
                    {/* Tabs Navigation */}
                    <div className="flex items-center border-b px-2 bg-muted/30 shrink-0 overflow-x-auto no-scrollbar scroll-smooth">
                        {[
                            { id: "notes", icon: FileText, label: "Notes" },
                            { id: "ai", icon: Sparkles, label: "AI" },
                            { id: "summary", icon: BrainCircuit, label: "Summary" },
                            { id: "visual", icon: PenTool, label: "Visual" },
                            { id: "description", icon: AlignLeft, label: "Info" },
                            { id: "bookmarks", icon: Bookmark, label: "Marks" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={cn(
                                    "flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors relative",
                                    activeTab === tab.id
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="flex-1 relative overflow-hidden bg-card/50">
                        {/* Notes Tab */}
                        {activeTab === "notes" && (
                            <div className="h-full flex flex-col">
                                <textarea
                                    ref={notesRef}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Type your notes here... (Auto-saves)"
                                    className="flex-1 w-full p-4 resize-none bg-transparent outline-none leading-relaxed placeholder:text-muted-foreground/40 text-sm overflow-y-auto"
                                />
                            </div>
                        )}

                        {/* AI Tab */}
                        {activeTab === "ai" && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {!aiResponse ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 text-center p-4">
                                            <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                                            <p className="text-sm">Ask anything about the video.</p>
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/20 p-3 rounded-lg border">
                                            <p className="whitespace-pre-wrap text-sm">{aiResponse}</p>
                                        </div>
                                    )}
                                    {isAiLoading && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse p-2">
                                            <Sparkles className="h-3 w-3" />
                                            Thinking...
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t bg-background shrink-0 pb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={aiQuery}
                                            onChange={(e) => setAiQuery(e.target.value)}
                                            placeholder="Ask a question..."
                                            className="flex-1 px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAiAsk('explain')}
                                        />
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => handleAiAsk('explain')}
                                            disabled={!aiQuery.trim() || isAiLoading}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button variant="outline" size="sm" onClick={() => handleAiAsk('explain')} className="flex-1 text-[10px] h-7">Explain</Button>
                                        <Button variant="outline" size="sm" onClick={() => handleAiAsk('socratic')} className="flex-1 text-[10px] h-7">Quiz Me</Button>
                                        <Button variant="outline" size="sm" onClick={() => handleAiAsk('refine')} className="flex-1 text-[10px] h-7">Summarize</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Summary Tab */}
                        {activeTab === "summary" && (
                            <div className="h-full flex flex-col p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground">Session Summary</h3>
                                    <Button size="sm" variant="outline" onClick={() => handleAiAsk('refine')} className="h-8 text-xs gap-2">
                                        <Sparkles className="h-3 w-3" /> Generate
                                    </Button>
                                </div>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Click Generate to create a summary with AI..."
                                    className="flex-1 w-full resize-none bg-muted/10 p-3 rounded-lg border-none outline-none text-sm placeholder:text-muted-foreground/40"
                                />
                            </div>
                        )}

                        {/* Visual Tab */}
                        {activeTab === "visual" && (
                            <div className="h-full w-full bg-white dark:bg-zinc-950">
                                <Scratchpad
                                    initialData={visualData}
                                    onSave={setVisualData}
                                    isDark={true}
                                />
                            </div>
                        )}

                        {/* Description Tab */}
                        {activeTab === "description" && (
                            <div className="h-full overflow-y-auto p-4">
                                <h2 className="font-semibold text-lg mb-2">{title}</h2>
                                {channelTitle && (
                                    <div className="text-sm text-primary mb-4 font-medium">{channelTitle}</div>
                                )}
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                    {description || "No description available."}
                                </div>
                            </div>
                        )}

                        {/* Bookmarks Tab */}
                        {activeTab === "bookmarks" && (
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b">
                                    <Button
                                        className="w-full gap-2"
                                        onClick={addBookmark}
                                    >
                                        <Bookmark className="h-4 w-4" />
                                        Bookmark Current Time ({formatTime(progress)})
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {bookmarks.length === 0 ? (
                                        <div className="text-center text-muted-foreground/50 py-8 text-sm">
                                            No bookmarks yet. Tap the button above to mark key moments.
                                        </div>
                                    ) : (
                                        bookmarks.map((b) => (
                                            <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10 hover:bg-muted/20 transition-colors">
                                                <button
                                                    onClick={() => seekTo(b.time)}
                                                    className="flex items-center gap-3 flex-1 text-left"
                                                >
                                                    <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                        {formatTime(b.time)}
                                                    </span>
                                                    <span className="text-sm truncate font-medium">{b.label}</span>
                                                </button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeBookmark(b.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FocusPlayer;
