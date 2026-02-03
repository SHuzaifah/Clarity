"use client";

import React, { useState, useRef, useEffect } from "react";
import _ReactPlayer from "react-player";
const ReactPlayer = _ReactPlayer as any;
import {
    Maximize2,
    Minimize2,
    Play,
    Pause,
    RotateCcw,
    ChevronRight,
    CheckCircle2,
    Sparkles,
    PenTool,
    FileText,
    BrainCircuit,
    Layout,
    PanelRightClose,
    PanelRightOpen,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Scratchpad from "@/components/scratchpad";
import { Skeleton } from "@/components/ui/skeleton";
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

type Tab = "notes" | "summary" | "visual";

export function FocusPlayer({
    videoId,
    title,
    thumbnailUrl,
    description,
    nextStepUrl,
    onComplete
}: FocusPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>("notes");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    // Notes State
    const [notes, setNotes] = useState("");
    const [summary, setSummary] = useState("");
    const [visualData, setVisualData] = useState<string | undefined>(undefined);

    // AI Tutor State
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Use 'any' for the player ref to avoid type mismatches with the external library
    const playerRef = useRef<any>(null);

    const handleProgress = (state: any) => {
        setProgress(state.playedSeconds);
    };

    const handleDuration = (d: number) => {
        setDuration(d);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleAiAsk = async (action: "explain" | "refine" | "socratic") => {
        if (!notes && !aiQuery && action !== 'refine') return;

        setIsAiLoading(true);
        setAiResponse(null);

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
            "flex flex-col h-[calc(100vh-2rem)] gap-4 p-2 transition-all duration-500",
            isExpanded ? "fixed inset-0 z-50 bg-background p-4 h-screen" : ""
        )}>
            {/* Header / Controls */}
            <div className="flex items-center justify-between shrink-0 px-2">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold line-clamp-1">{title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        title={isSidebarOpen ? "Hide Notes" : "Show Notes"}
                        className={cn(isSidebarOpen && "bg-accent text-accent-foreground")}
                    >
                        {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
                {/* Video Area */}
                <motion.div
                    layout
                    className="flex-1 relative rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10"
                >
                    {/* @ts-ignore */}
                    <ReactPlayer
                        ref={playerRef}
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        controls={true}
                        config={{
                            youtube: {
                                playerVars: { showinfo: 0, modestbranding: 1, rel: 0 }
                            }
                        } as any}
                    />
                </motion.div>

                {/* Sidebar Tools Area */}
                <AnimatePresence mode="popLayout">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 420, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden h-full"
                        >
                            {/* Tabs */}
                            <div className="flex items-center border-b px-2 pt-2 gap-1 bg-muted/30 shrink-0">
                                <button
                                    onClick={() => setActiveTab("notes")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors relative",
                                        activeTab === "notes"
                                            ? "bg-card text-foreground"
                                            : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                                    )}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    Notes
                                    {activeTab === "notes" && (
                                        <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("summary")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors relative",
                                        activeTab === "summary"
                                            ? "bg-card text-foreground"
                                            : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                                    )}
                                >
                                    <BrainCircuit className="h-3.5 w-3.5" />
                                    Summary
                                    {activeTab === "summary" && (
                                        <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("visual")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors relative",
                                        activeTab === "visual"
                                            ? "bg-card text-foreground"
                                            : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                                    )}
                                >
                                    <PenTool className="h-3.5 w-3.5" />
                                    Visual
                                    {activeTab === "visual" && (
                                        <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                                    )}
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 relative overflow-hidden bg-card text-sm">
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col">

                                    {activeTab === "notes" && (
                                        <>
                                            <div className="flex-1 p-4">
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Start typing your notes..."
                                                    className="w-full h-[500px] resize-none bg-transparent outline-none leading-relaxed placeholder:text-muted-foreground/40"
                                                />
                                            </div>

                                            {/* AI Assistant Section */}
                                            <div className="border-t bg-muted/20 p-3 space-y-3 shrink-0">
                                                {aiResponse && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-foreground/90 shadow-sm max-h-40 overflow-y-auto"
                                                    >
                                                        <div className="flex items-center gap-2 text-primary font-semibold mb-1 xs uppercase tracking-wider">
                                                            <Sparkles className="h-3 w-3" />
                                                            AI Analysis
                                                        </div>
                                                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                                            {aiResponse}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <div className="flex gap-2">
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={aiQuery}
                                                            onChange={(e) => setAiQuery(e.target.value)}
                                                            placeholder="Ask about this video..."
                                                            className="w-full pl-3 pr-8 py-2 rounded-md border bg-background text-xs outline-none focus:ring-1 focus:ring-primary h-9"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAiAsk('explain')}
                                                        />
                                                        <Sparkles className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAiAsk('explain')}
                                                        disabled={isAiLoading}
                                                        className="flex-1 h-8 text-xs"
                                                    >
                                                        Explain Concept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAiAsk('refine')}
                                                        disabled={isAiLoading}
                                                        className="flex-1 h-8 text-xs"
                                                    >
                                                        Refine Notes
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "summary" && (
                                        <div className="p-4 h-full flex flex-col">
                                            <textarea
                                                value={summary}
                                                onChange={(e) => setSummary(e.target.value)}
                                                placeholder="Draft your session summary..."
                                                className="flex-1 w-full resize-none bg-transparent outline-none leading-relaxed placeholder:text-muted-foreground/40"
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
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default FocusPlayer;
