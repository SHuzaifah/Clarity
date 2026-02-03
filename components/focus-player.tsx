"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
// Using base react-player with type casting to resolve Next.js/TypeScript compatibility issues
import _ReactPlayer from "react-player";
const ReactPlayer = _ReactPlayer as unknown as React.ComponentType<any>;

import {
    Maximize2,
    Minimize2,
    Sparkles,
    PenTool,
    FileText,
    BrainCircuit,
    ArrowLeft,
    Bookmark,
    Info,
    Send,
    Check
} from "lucide-react";
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

type Tab = "notes" | "summary" | "visual" | "info";

export function FocusPlayer({
    videoId,
    title,
    thumbnailUrl,
    description,
    channelTitle,
    nextStepUrl,
    onComplete
}: FocusPlayerProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>("notes");

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [splitRatio, setSplitRatio] = useState(0.6);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [isBookmarked, setIsBookmarked] = useState(false);

    const [notes, setNotes] = useState("");
    const [summary, setSummary] = useState("");
    const [visualData, setVisualData] = useState<string | undefined>(undefined);
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let newRatio = 0.6;

        if (isMobile) {
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const relativeY = clientY - containerRect.top;
            newRatio = Math.max(0.2, Math.min(0.8, relativeY / containerRect.height));
        } else {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const relativeX = clientX - containerRect.left;
            newRatio = Math.max(0.2, Math.min(0.8, relativeX / containerRect.width));
        }

        setSplitRatio(newRatio);
    }, [isDragging, isMobile]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);


    const handleProgress = (state: any) => {
        setProgress(state.playedSeconds);
    };

    const handleDuration = (d: number) => {
        setDuration(d);
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

                if (activeTab === 'summary' && action === 'refine') {
                    setSummary(cleanResponse);
                }
            }
        } catch (error) {
            console.error("AI Error", error);
        } finally {
            setIsAiLoading(false);
            setAiQuery("");
        }
    };

    if (!hasMounted) return null;

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex h-[calc(100vh-1rem)] bg-background overflow-hidden relative transition-all",
                isMobile ? "flex-col" : "flex-row",
                isFullscreen ? "h-screen fixed inset-0 z-50 bg-black" : ""
            )}
        >
            <div
                style={{
                    flexBasis: isFullscreen ? '100%' : `${splitRatio * 100}%`,
                    height: isMobile && !isFullscreen ? `${splitRatio * 100}%` : 'auto'
                }}
                className="relative bg-black shrink-0 flex flex-col min-h-0 transition-[flex-basis,height] duration-100 ease-out group"
            >
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <Link href="/dashboard" className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-md">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        {!isFullscreen && (
                            <div className="text-white drop-shadow-md">
                                <h1 className="font-semibold text-sm line-clamp-1 max-w-[200px]">{title}</h1>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveTab(activeTab === 'info' ? 'notes' : 'info')}
                            className={cn(
                                "rounded-full backdrop-blur-md transition-colors",
                                activeTab === 'info'
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-black/40 text-white hover:bg-black/60"
                            )}
                            title="Video Info"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={cn(
                                "rounded-full backdrop-blur-md transition-colors",
                                isBookmarked ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-black/40 text-white hover:bg-black/60"
                            )}
                        >
                            {isBookmarked ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="w-full h-full relative z-0 bg-black">
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

                        style={{ position: 'absolute', top: 0, left: 0 }}
                        config={{
                            youtube: {
                                playerVars: {
                                    showinfo: 0,
                                    modestbranding: 1,
                                    rel: 0,
                                    playsinline: 1,
                                    origin: typeof window !== 'undefined' ? window.location.origin : undefined
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {!isFullscreen && (
                <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className={cn(
                        "z-10 flex items-center justify-center hover:bg-primary/20 transition-colors touch-none",
                        isMobile
                            ? "h-4 w-full cursor-row-resize py-1 -mt-2 relative"
                            : "w-4 h-full cursor-col-resize px-1 -ml-2 relative"
                    )}
                >
                    <div className={cn(
                        "rounded-full bg-border",
                        isMobile ? "h-1 w-12" : "w-1 h-12"
                    )} />
                </div>
            )}

            {!isFullscreen && (
                <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-background overflow-hidden relative border-l border-t border-border/40">

                    <div className="flex items-center border-b px-2 bg-muted/20 shrink-0">
                        {[
                            { id: "notes", icon: FileText, label: "Notes" },
                            { id: "summary", icon: BrainCircuit, label: "Summary" },
                            { id: "visual", icon: PenTool, label: "Visual" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors relative outline-none focus:bg-muted/50",
                                    activeTab === tab.id
                                        ? "text-primary font-semibold bg-muted/30 rounded-t-lg"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-t-lg"
                                )}
                            >
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        {activeTab === "notes" && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Start typing references, ideas, or questions..."
                                        className="w-full h-full resize-none bg-transparent outline-none leading-relaxed text-sm placeholder:text-muted-foreground/40 font-mono sm:font-sans p-1 focus:ring-0"
                                    />
                                </div>

                                <div className="p-3 border-t bg-muted/10 shrink-0">
                                    {aiResponse && (
                                        <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs text-foreground/90 max-h-32 overflow-y-auto">
                                            <div className="flex items-center gap-2 text-primary font-semibold mb-1 xs uppercase tracking-wider">
                                                <Sparkles className="h-3 w-3" />
                                                AI Insight
                                            </div>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                {aiResponse}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                value={aiQuery}
                                                onChange={(e) => setAiQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAiAsk('explain')}
                                                placeholder="Ask AI to explain or refine..."
                                                className="w-full pl-3 pr-8 py-2 rounded-md border bg-background text-sm outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                            />
                                            <Sparkles className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                                        </div>
                                        <Button size="icon" onClick={() => handleAiAsk('explain')} disabled={!aiQuery.trim() || isAiLoading}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "summary" && (
                            <div className="h-full flex flex-col p-4 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <h3 className="text-sm font-semibold text-muted-foreground">AI Summary</h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAiAsk('refine')}
                                        disabled={isAiLoading}
                                        className="h-8 text-xs gap-2"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        {summary ? "Regenerate" : "Generate"}
                                    </Button>
                                </div>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Click Generate to create a structured summary of the video content..."
                                    className="flex-1 w-full resize-none bg-muted/10 p-4 rounded-xl border-none outline-none text-sm placeholder:text-muted-foreground/40 leading-relaxed"
                                />
                            </div>
                        )}

                        {activeTab === "visual" && (
                            <div className="h-full w-full bg-white dark:bg-zinc-950">
                                <Scratchpad
                                    initialData={visualData}
                                    onSave={setVisualData}
                                    isDark={true}
                                />
                            </div>
                        )}

                        {activeTab === "info" && (
                            <div className="h-full overflow-y-auto p-6">
                                <h1 className="text-xl font-bold mb-2">{title}</h1>
                                {channelTitle && (
                                    <div className="text-sm text-primary font-medium mb-6 flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                            {channelTitle[0]}
                                        </div>
                                        {channelTitle}
                                    </div>
                                )}
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                                    {description || "No description provided."}
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
