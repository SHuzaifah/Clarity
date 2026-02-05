"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player").then(mod => mod.default), {
    ssr: false
}) as any;

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

    const [playerReady, setPlayerReady] = useState(false);

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

    const handleReady = () => {
        setPlayerReady(true);
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
                className={cn(
                    "relative bg-black shrink-0 flex flex-col min-h-0 transition-[flex-basis,height] duration-100 ease-out z-10",
                    !playerReady && "justify-center items-center"
                )}
            >
                <div className="absolute top-4 left-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Link href="/dashboard" className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 backdrop-blur-md">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </div>

                <div className="w-full h-full relative">
                    <ReactPlayer
                        ref={playerRef}
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        controls={true}
                        config={{
                            youtube: {
                                playerVars: {
                                    modestbranding: 1,
                                    rel: 0,
                                    showinfo: 0
                                }
                            }
                        }}
                        onReady={handleReady}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                    />
                </div>
            </div>

            {!isFullscreen && (
                <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className={cn(
                        "z-20 flex items-center justify-center hover:bg-primary/20 transition-colors touch-none bg-background/50 backdrop-blur-sm border-border/40",
                        isMobile
                            ? "h-2 w-full cursor-row-resize border-y"
                            : "w-2 h-full cursor-col-resize border-x"
                    )}
                >
                    <div className={cn(
                        "rounded-full bg-border",
                        isMobile ? "h-1 w-8" : "w-1 h-8"
                    )} />
                </div>
            )}

            {!isFullscreen && (
                <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-background overflow-hidden relative">

                    <div className="flex items-center justify-between p-4 border-b shrink-0 bg-background">
                        <div className="min-w-0 flex-1 mr-4">
                            <h1 className="font-semibold text-sm line-clamp-1" title={title}>{title}</h1>
                            {channelTitle && <p className="text-xs text-muted-foreground line-clamp-1">{channelTitle}</p>}
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setActiveTab(activeTab === 'info' ? 'notes' : 'info')}
                                className={cn(
                                    "h-8 w-8 rounded-full transition-colors",
                                    activeTab === 'info'
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                                title="Info"
                            >
                                <Info className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={cn(
                                    "h-8 w-8 rounded-full transition-colors",
                                    isBookmarked
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                                title="Bookmark Video"
                            >
                                {isBookmarked ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
                                title="Maximize"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {activeTab !== 'info' && (
                        <div className="flex items-center gap-4 px-4 border-b bg-muted/5 shrink-0">
                            {[
                                { id: "notes", icon: FileText, label: "Notes" },
                                { id: "summary", icon: BrainCircuit, label: "Summary" },
                                { id: "visual", icon: PenTool, label: "Visual" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={cn(
                                        "flex items-center gap-2 py-3 text-xs font-medium transition-all outline-none border-b-2",
                                        activeTab === tab.id
                                            ? "text-primary border-primary"
                                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/30"
                                    )}
                                >
                                    <tab.icon className="h-3.5 w-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 relative overflow-hidden bg-background">
                        {activeTab === "notes" && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Start typing references, ideas, or questions..."
                                        className="w-full h-full resize-none bg-transparent border-none outline-none leading-relaxed text-sm placeholder:text-muted-foreground/40 font-mono sm:font-sans p-6 focus:ring-0"
                                    />
                                </div>

                                <div className="p-4 border-t bg-muted/5 shrink-0">
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
                                                placeholder="Ask AI..."
                                                className="w-full pl-3 pr-8 py-2 rounded-md border bg-background text-sm outline-none focus:ring-1 focus:ring-primary shadow-sm h-9"
                                            />
                                            <Sparkles className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                                        </div>
                                        <Button size="icon" className="h-9 w-9" onClick={() => handleAiAsk('explain')} disabled={!aiQuery.trim() || isAiLoading}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "summary" && (
                            <div className="h-full flex flex-col p-6 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <h3 className="text-sm font-semibold text-muted-foreground">AI Study Notes</h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAiAsk('refine')}
                                        disabled={isAiLoading}
                                        className="h-8 text-xs gap-2 px-3"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        Generate
                                    </Button>
                                </div>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Click Generate to create a structured summary of the video content..."
                                    className="flex-1 w-full resize-none bg-muted/10 p-4 rounded-xl border-none outline-none text-sm placeholder:text-muted-foreground/40 leading-relaxed active:border-none focus:border-none"
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
                            <div className="h-full overflow-y-auto p-6 bg-background">
                                <h2 className="text-lg font-bold mb-2">Description</h2>
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
