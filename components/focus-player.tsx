"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, FileText, Play, Pause, Sparkles, ChevronRight, Volume2, VolumeX, Maximize, SkipForward, Rewind, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

import { addToHistory, getWatchHistory } from "@/lib/actions/history";
import { addToCollection, removeFromCollection, checkVideoSavedStatus } from "@/lib/actions/collections";
import Scratchpad from "@/components/scratchpad";

import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";

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

type NoteType = 'jot' | 'summary' | 'visual';

export function FocusPlayer({ videoId, title, thumbnailUrl, description = "", channelId = "", channelTitle = "", nextStepUrl, onComplete }: FocusPlayerProps) {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);

    // Player State
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 1
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(80);
    const [muted, setMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [showControls, setShowControls] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout>(null);

    // Notebook State
    const [showSidebar, setShowSidebar] = useState(false);
    const [noteType, setNoteType] = useState<NoteType>('jot');
    const [notes, setNotes] = useState<{ jot: string, summary: string, canvas: string | null }>({
        jot: "", summary: "", canvas: null
    });
    const notesRef = useRef(notes);

    const [tutorInput, setTutorInput] = useState("");
    const [tutorResponse, setTutorResponse] = useState<string | null>(null);
    const [isTutorLoading, setIsTutorLoading] = useState(false);

    const currentTimeRef = useRef(0);
    const lastLogTimeRef = useRef(Date.now());

    const [saved, setSaved] = useState(false);
    const [descOpen, setDescOpen] = useState(false);

    // Sync saved status
    useEffect(() => {
        checkVideoSavedStatus(videoId).then(setSaved);
    }, [videoId]);

    const toggleSave = async () => {
        if (saved) {
            await removeFromCollection("Watch Later", videoId);
            setSaved(false);
        } else {
            await addToCollection("Watch Later", videoId, {
                title,
                channelId,
                channelTitle,
                thumbnailUrl,
                publishedAt: new Date().toISOString()
            });
            setSaved(true);
        }
    };

    // Sync notes state to ref
    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    useEffect(() => {
        setHasMounted(true);
        // Fetch existing history/notes
        if (videoId) {
            getWatchHistory(videoId).then(data => {
                if (data?.notes) {
                    // Handle migration: if canvas was object, reset to null
                    const loadedNotes = data.notes;
                    if (loadedNotes.canvas && typeof loadedNotes.canvas !== 'string') {
                        loadedNotes.canvas = null;
                    }
                    setNotes(prev => ({ ...prev, ...loadedNotes }));
                }
            });
        }
        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [videoId]);

    useEffect(() => {
        // Log view start
        if (videoId) {
            addToHistory({ videoId, title, thumbnailUrl });
        }
    }, [videoId, title, thumbnailUrl]);

    const getLatestNotes = () => {
        return notesRef.current;
    };

    const handleComplete = async () => {
        await addToHistory({
            videoId, title, thumbnailUrl, completed: true,
            position: duration, duration: duration,
            notes: getLatestNotes()
        });

        if (onComplete) {
            onComplete();
        } else if (nextStepUrl) {
            router.push(nextStepUrl);
        } else {
            router.back();
        }
    };

    // Progress Loop
    useEffect(() => {
        if (playing && player) {
            progressIntervalRef.current = setInterval(() => {
                const time = player.getCurrentTime();
                const dur = player.getDuration();
                setCurrentTime(time);
                currentTimeRef.current = time;
                setDuration(dur);
                if (dur > 0) setProgress(time / dur);

                // Log history every 30s
                if (Date.now() - lastLogTimeRef.current > 30000) {
                    addToHistory({
                        videoId, title, thumbnailUrl,
                        position: time, duration: dur,
                        notes: getLatestNotes()
                    });
                    lastLogTimeRef.current = Date.now();
                }
            }, 500);
        } else {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        }
        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [playing, player, videoId, title, thumbnailUrl]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const togglePlay = () => {
        if (playing) {
            player?.pauseVideo();
        } else {
            player?.playVideo();
        }
    };

    const handlePlayerReady = (event: { target: YouTubePlayer }) => {
        setPlayer(event.target);
        setDuration(event.target.getDuration());
        setVolume(event.target.getVolume());
        setMuted(event.target.isMuted());
    };

    const handlePlayerStateChange = (event: { data: number, target: YouTubePlayer }) => {
        if (event.data === 1) {
            setPlaying(true);
        } else if (event.data === 2) {
            setPlaying(false);
        } else if (event.data === 0) {
            setPlaying(false);
            handleComplete();
        }
    };

    const [seeking, setSeeking] = useState(false);
    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeeking(true);
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        const newTime = newProgress * duration;
        setCurrentTime(newTime);
    };

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        setSeeking(false);
        const newProgress = parseFloat((e.target as HTMLInputElement).value);
        const newTime = newProgress * duration;
        player?.seekTo(newTime, true);
    };

    const handleRateChange = () => {
        const rates = [0.5, 1.0, 1.25, 1.5, 2.0];
        const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
        const newRate = rates[nextIdx];
        setPlaybackRate(newRate);
        player?.setPlaybackRate(newRate);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        player?.setVolume(newVol);
        if (newVol > 0 && muted) {
            setMuted(false);
            player?.unMute();
        }
    };

    const toggleMute = () => {
        if (muted) {
            player?.unMute();
            setMuted(false);
            setVolume(player?.getVolume() || 80);
        } else {
            player?.mute();
            setMuted(true);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    // --- Notebook Logic ---
    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (noteType !== 'visual') {
            setNotes(prev => ({ ...prev, [noteType]: val }));
        }
    };

    const handleScratchpadSave = (data: string) => {
        setNotes(prev => ({ ...prev, canvas: data }));
    };

    const askTutor = async (action: 'explain' | 'refine' | 'socratic') => {
        setIsTutorLoading(true);
        setTutorResponse(null);
        try {
            const res = await fetch('/api/gemini/tutor', {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    context: {
                        videoTitle: title,
                        nodeTitle: title,
                        currentNotes: noteType === 'visual' ? "User is using whiteboard" : notes[noteType],
                        timestamp: currentTimeRef.current
                    },
                    userQuery: tutorInput
                })
            });
            const data = await res.json();

            if (!res.ok || data.error) {
                setTutorResponse(`Error: ${data.error || "Failed to contact tutor."}`);
            } else {
                setTutorResponse(data.response || "Tutor is thinking...");
            }
        } catch (e) {
            console.error(e);
            setTutorResponse("Tutor is unavailable right now. Please check your connection or API key.");
        } finally {
            setIsTutorLoading(false);
        }
    };

    const opts: YouTubeProps['opts'] = useMemo(() => ({
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            disablekb: 1,
            fs: 0
        },
    }), []);

    const addToNotes = useCallback((targetType: 'jot' | 'summary') => {
        if (!tutorResponse) return;
        const textToAdd = tutorResponse;

        setNotes(prev => ({
            ...prev,
            [targetType]: prev[targetType]
                ? prev[targetType].trim() + "\n\n" + textToAdd
                : textToAdd
        }));

        setNoteType(targetType);
        setTutorResponse(null);
    }, [tutorResponse]);

    const sidebarWidth = 400;

    if (!hasMounted) return <div className="fixed inset-0 bg-black" />;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Custom Header Overlay */}
            <div className={cn(
                "absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start transition-opacity duration-300 pointer-events-none",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                <div className="flex flex-col pointer-events-auto">
                    <h1 className="text-lg font-medium tracking-tight drop-shadow-md">{title}</h1>
                    <span className="text-xs text-white/60">Focus Mode</span>
                </div>
                <div className="flex gap-4 pointer-events-auto">
                    <Button
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm gap-2"
                        onClick={toggleSidebar}
                    >
                        <FileText className="h-4 w-4" />
                        Notebook
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-full"
                        onClick={() => router.back()}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex relative overflow-hidden bg-black">
                {/* Responsive Layout Container */}
                <div
                    className={cn("flex-1 relative transition-all duration-300 ease-in-out")}
                    style={{ marginRight: showSidebar ? `${sidebarWidth}px` : 0 }}
                >
                    {/* Player Wrapper */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            onReady={handlePlayerReady}
                            onStateChange={handlePlayerStateChange}
                            onEnd={onComplete}
                            className="absolute inset-0 w-full h-full"
                            iframeClassName="w-full h-full"
                        />
                    </div>

                    {/* Controls & Overlays (Same as before) */}
                    {!playing && (
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
                            onClick={() => player?.playVideo()}
                        >
                            <div className="h-20 w-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 border border-white/10 shadow-xl">
                                <Play className="h-10 w-10 fill-white text-white ml-1" />
                            </div>
                        </div>
                    )}

                    {/* Custom Bottom Controls */}
                    <div className={cn(
                        "absolute bottom-0 left-0 right-0 z-20 px-6 py-6 pb-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 flex flex-col gap-2 pointer-events-auto",
                        showControls ? "opacity-100" : "opacity-0"
                    )}>
                        {/* Progress Bar (Same as before) */}
                        <div className="flex items-center gap-4 group">
                            <span className="text-xs font-mono w-10 text-right">{formatTime(currentTime)}</span>
                            <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer group-hover:h-2 transition-all">
                                <input
                                    type="range"
                                    min={0}
                                    max={0.999999}
                                    step="any"
                                    value={progress}
                                    onChange={handleSeekChange}
                                    onMouseUp={handleSeekMouseUp}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="h-full bg-primary rounded-full relative"
                                    style={{ width: `${progress * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow scale-0 group-hover:scale-100 transition-transform" />
                                </div>
                            </div>
                            <span className="text-xs font-mono w-10">{formatTime(duration)}</span>
                        </div>

                        {/* Control Buttons (Same as before) */}
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="hover:text-primary transition-colors">
                                    {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                                </button>
                                <button onClick={() => {
                                    const newTime = Math.max(0, currentTime - 10);
                                    player?.seekTo(newTime, true);
                                }} className="hover:text-primary transition-colors">
                                    <Rewind className="h-5 w-5" />
                                </button>
                                <button onClick={() => {
                                    const newTime = Math.min(duration, currentTime + 10);
                                    player?.seekTo(newTime, true);
                                }} className="hover:text-primary transition-colors">
                                    <SkipForward className="h-5 w-5" />
                                </button>

                                <div className="flex items-center gap-2 group relative ml-4">
                                    <button onClick={toggleMute} className="hover:text-primary transition-colors">
                                        {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={muted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-20 h-1 accent-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    className="text-sm font-bold bg-white/10 px-2 py-1 rounded hover:bg-white/20 min-w-[3rem]"
                                    onClick={handleRateChange}
                                >
                                    {playbackRate}x
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <Maximize className="h-5 w-5" onClick={() => {
                                        if (document.fullscreenElement) document.exitFullscreen();
                                        else document.documentElement.requestFullscreen();
                                    }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligent Notebook Sidebar */}
                <div
                    className={cn(
                        "fixed right-0 top-0 bottom-0 bg-zinc-950 border-l border-zinc-900 shadow-2xl transform transition-transform duration-300 flex flex-col z-30",
                        showSidebar ? "translate-x-0" : "translate-x-full"
                    )}
                    style={{ width: `${sidebarWidth}px` }}
                >
                    {/* Video Header & Actions */}
                    <div className="p-4 border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-10">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h2 className="text-sm font-semibold leading-snug line-clamp-2 text-zinc-100 flex-1">{title}</h2>
                            <div className="flex items-center gap-1">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-zinc-800 rounded-full"
                                    onClick={toggleSave}
                                    title={saved ? "Remove from Watch Later" : "Save to Watch Later"}
                                >
                                    <Bookmark className={cn("h-4 w-4", saved && "fill-white text-white")} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)} className="h-8 w-8 text-zinc-500 hover:text-white">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Description Collapsible */}
                        {description && (
                            <div className="text-xs text-zinc-500">
                                <button
                                    onClick={() => setDescOpen(!descOpen)}
                                    className="flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    {descOpen ? "Hide Description" : "Show Description"}
                                    {descOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </button>
                                {descOpen && (
                                    <div className="mt-2 text-zinc-400 whitespace-pre-wrap max-h-40 overflow-y-auto pr-1 leading-relaxed">
                                        {description}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notebook Header */}
                    <div className="px-4 py-2 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/50">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-300 text-xs uppercase tracking-wider">Notebook</span>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex p-2 gap-1 border-b border-zinc-900 bg-zinc-900/50">
                        {(['jot', 'summary', 'visual'] as NoteType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setNoteType(type)}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1",
                                    noteType === type
                                        ? "bg-primary/20 text-primary"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                                )}
                            >
                                {type === 'visual' && <PenTool className="h-3 w-3" />}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col relative bg-zinc-950 overflow-hidden">
                        {noteType === 'visual' ? (
                            <div className="flex-1 w-full h-full bg-zinc-950 relative">
                                <Scratchpad
                                    initialData={typeof notes.canvas === 'string' ? notes.canvas : undefined}
                                    onSave={handleScratchpadSave}
                                    isDark={true}
                                />
                            </div>
                        ) : (
                            <textarea
                                className="flex-1 w-full bg-zinc-950 p-6 resize-none focus:outline-none text-zinc-300 text-sm leading-relaxed font-mono"
                                placeholder={
                                    noteType === 'jot' ? "Jot down raw thoughts..." :
                                        "Summarize the key takeaways..."
                                }
                                value={notes[noteType as 'jot' | 'summary']}
                                onChange={handleNoteChange}
                            />
                        )}

                        {/* Gemini Assistant Zone */}
                        <div className="bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800 p-4 space-y-3">
                            {tutorResponse ? (
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-zinc-200 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> Gemini Tutor
                                        </span>
                                        <button onClick={() => setTutorResponse(null)} className="text-zinc-500 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                    <p className="leading-relaxed whitespace-pre-wrap mb-3">{tutorResponse}</p>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 text-[10px] bg-primary/20 hover:bg-primary/30 text-white border border-primary/20 px-2"
                                            onClick={() => addToNotes('jot')}
                                        >
                                            + Add to Jot
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 text-[10px] bg-primary/20 hover:bg-primary/30 text-white border border-primary/20 px-2"
                                            onClick={() => addToNotes('summary')}
                                        >
                                            + Add to Summary
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-primary/50 focus:outline-none"
                                            placeholder="Ask a question..."
                                            value={tutorInput}
                                            onChange={(e) => setTutorInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && askTutor('explain')}
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-primary hover:bg-primary/20"
                                            disabled={isTutorLoading}
                                            onClick={() => askTutor('explain')}
                                        >
                                            <Sparkles className={cn("h-4 w-4", isTutorLoading && "animate-spin")} />
                                        </Button>
                                    </div>
                                    {noteType !== 'visual' && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-7 text-[10px] border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                                                onClick={() => askTutor('refine')}
                                                disabled={!notes[noteType as 'jot' | 'summary'].trim() || isTutorLoading}
                                            >
                                                Refine Notes
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-7 text-[10px] border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                                                onClick={() => askTutor('socratic')}
                                                disabled={isTutorLoading}
                                            >
                                                Test Me
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex justify-between items-center">
                        <span className="text-xs text-zinc-600">Autosaved</span>
                        <Button size="sm" onClick={handleComplete} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <CheckCircle className="h-4 w-4" />
                            Finish Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
