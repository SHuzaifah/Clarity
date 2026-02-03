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
    Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Scratchpad from "@/components/scratchpad";
import { Skeleton } from "@/components/ui/skeleton";

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

type Tab = "jot" | "summary" | "visual";

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
    const [activeTab, setActiveTab] = useState<Tab>("jot");
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
        if (!notes && !aiQuery) return;

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
                        nodeTitle: title, // Using video title as node title for now
                        currentNotes: notes,
                        timestamp: Math.round(progress)
                    }
                })
            });

            const data = await res.json();

            if (data.response) {
                // Formatting the response to remove any potential wrapping quotes if they exist
                // and handling the "curly braces" issue the user reported
                let cleanResponse = data.response;
                if (typeof cleanResponse === 'object') {
                    // Fallback if backend sends object
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
            setAiQuery(""); // Clear query after asking
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-[calc(100vh-4rem)] gap-4 p-4 transition-all duration-500",
            isExpanded ? "fixed inset-0 z-50 bg-background p-6" : ""
        )}>
            {/* Header / Controls */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-xl font-bold line-clamp-1">{title}</h1>
                    <p className="text-sm text-muted-foreground">Focus Session</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Video Area */}
                <div className="flex-[2] relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                    {/* @ts-ignore - ReactPlayer types are tricky, using ignore to ensure build succeeds */}
                    <ReactPlayer
                        ref={playerRef}
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        controls
                        config={{
                            youtube: {
                                playerVars: { showinfo: 0, modestbranding: 1 }
                            }
                        } as any}
                    />
                </div>

                {/* Tools Area */}
                <div className="flex-1 flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex items-center border-b px-2 pt-2 gap-1 bg-muted/30">
                        <button
                            onClick={() => setActiveTab("jot")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative",
                                activeTab === "jot"
                                    ? "bg-card text-foreground"
                                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                            )}
                        >
                            <BrainCircuit className="h-4 w-4" />
                            Jot & Ask
                            {activeTab === "jot" && (
                                <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("summary")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative",
                                activeTab === "summary"
                                    ? "bg-card text-foreground"
                                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                            )}
                        >
                            <FileText className="h-4 w-4" />
                            Summary
                            {activeTab === "summary" && (
                                <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("visual")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative",
                                activeTab === "visual"
                                    ? "bg-card text-foreground"
                                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                            )}
                        >
                            <PenTool className="h-4 w-4" />
                            Visual
                            {activeTab === "visual" && (
                                <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 relative overflow-hidden bg-card">
                        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">

                            {activeTab === "jot" && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 p-4 relative">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Capture your thoughts here..."
                                            className="w-full h-full resize-none bg-transparent outline-none text-base leading-relaxed placeholder:text-muted-foreground/50"
                                        />
                                    </div>

                                    {/* AI Assistant Section */}
                                    <div className="border-t bg-muted/10 p-4 space-y-3">
                                        {aiResponse && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm text-foreground/90 shadow-sm"
                                            >
                                                <div className="flex items-center gap-2 text-primary font-semibold mb-1 text-xs uppercase tracking-wider">
                                                    <Sparkles className="h-3 w-3" />
                                                    AI Tutor
                                                </div>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
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
                                                    placeholder="Ask a question..."
                                                    className="w-full pl-3 pr-10 py-2 rounded-md border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAiAsk('explain')}
                                                />
                                            </div>
                                            <Button
                                                size="sm"
                                                disabled={isAiLoading}
                                                onClick={() => handleAiAsk('explain')}
                                            >
                                                {isAiLoading ? <span className="animate-spin">⏳</span> : <Sparkles className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <Button variant="outline" size="sm" onClick={() => handleAiAsk('refine')} disabled={isAiLoading} className="text-xs h-7">
                                                Refine Notes
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleAiAsk('socratic')} disabled={isAiLoading} className="text-xs h-7">
                                                Test Me
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "summary" && (
                                <div className="p-4 h-full flex flex-col">
                                    <textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        placeholder="Write a summary of what you've learned..."
                                        className="flex-1 w-full resize-none bg-transparent outline-none text-base leading-relaxed"
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
                </div>
            </div>
        </div>
    );
}

export default FocusPlayer;
