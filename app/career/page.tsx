"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Shield,
    Flame,
    Star,
    Target,
    Crown,
    Zap,
    Lock,
    ChevronRight,
    Medal,
    Timer,
    Gift,
    ShoppingBag,
    Users,
    Package,
    Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CareerPage() {
    // Mock Data simulating User State
    const [xp] = useState(2450);
    const [maxXp] = useState(3000);
    const [division] = useState(4);
    const [season] = useState(3);
    const [streak] = useState(12);

    // Progress Track Data
    const progressNodes = [
        { id: 1, type: "match", status: "completed", reward: "100 XP" },
        { id: 2, type: "match", status: "completed", reward: "150 XP" },
        { id: 3, type: "match", status: "completed", reward: "Pack" },
        { id: 4, type: "current", status: "active", reward: "Promotion", label: "Promotion Match" },
        { id: 5, type: "match", status: "locked", reward: "200 XP" },
        { id: 6, type: "boss", status: "locked", reward: "Trophy", label: "Example Cup Final" },
    ];

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden pb-24">

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0f1115] to-[#0f1115] opacity-60 blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-full h-[50%] bg-gradient-to-t from-emerald-950/20 to-transparent opacity-40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-md mx-auto md:max-w-4xl px-4 py-6 space-y-8">

                {/* --- HEADER SECTION --- */}
                <header className="space-y-6">
                    {/* Season Indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-emerald-400 backdrop-blur-md">
                                Season {season}
                            </span>
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                                Focus League
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                            <Flame className="h-4 w-4 fill-current animate-pulse" />
                            <span className="text-lg font-bold italic">{streak} Day Streak</span>
                        </div>
                    </div>

                    {/* Rank & XP Card */}
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                                    Div {division}
                                </h1>
                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    Pro Learner
                                </p>
                            </div>
                            <div className="h-14 w-14 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-900 flex items-center justify-center border-2 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <Shield className="h-7 w-7 text-white fill-white/20" />
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-xs font-medium text-white/50">
                                <span>{xp} XP</span>
                                <span>{maxXp} XP</span>
                            </div>
                            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(xp / maxXp) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- MAIN PROGRESS TRACK --- */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                        <Target className="h-4 w-4" /> Season Roadmap
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
                        {progressNodes.map((node, i) => (
                            <motion.div
                                key={node.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "flex-shrink-0 relative w-32 h-40 rounded-xl border flex flex-col items-center justify-center gap-3 snap-center transition-all duration-300 group",
                                    node.status === "active"
                                        ? "bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105 z-10"
                                        : node.status === "completed"
                                            ? "bg-white/5 border-white/10 opacity-60 grayscale-[0.5]"
                                            : "bg-black/40 border-white/5 opacity-40 blur-[1px]"
                                )}
                            >
                                {node.type === "current" && (
                                    <span className="absolute -top-3 px-2 py-0.5 bg-emerald-500 text-black text-[10px] uppercase font-bold rounded shadow-lg animate-bounce">
                                        Next Up
                                    </span>
                                )}

                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center border-2",
                                    node.status === "active"
                                        ? "bg-emerald-500 border-white text-black shadow-lg"
                                        : "bg-white/10 border-white/20 text-white"
                                )}>
                                    {node.type === "boss" ? <Trophy className="h-6 w-6" /> : <Zap className="h-5 w-5" />}
                                </div>

                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wide font-bold text-white/50">{node.label || `Match ${node.id}`}</p>
                                    <p className={cn(
                                        "text-xs font-bold mt-1",
                                        node.status === "active" ? "text-emerald-400" : "text-white"
                                    )}>
                                        {node.reward}
                                    </p>
                                </div>

                                {node.status === "locked" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                                        <Lock className="h-6 w-6 text-white/30" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* --- OBJECTIVES PANEL --- */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 rounded-2xl bg-[#1a1d24] border border-white/5 space-y-4"
                    >
                        <div className="flex justify-between items-center bg-gradient-to-r from-purple-500/20 to-transparent p-3 -mx-5 -mt-5 rounded-t-2xl border-b border-white/5">
                            <h3 className="font-bold text-purple-300 flex items-center gap-2">
                                <Star className="h-4 w-4 fill-current" /> Weekly Objectives
                            </h3>
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded uppercase font-bold">2 Days left</span>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: "Deep Work Session", progress: "2/3", reward: "500 XP" },
                                { title: "Focus Match (50m)", progress: "0/1", reward: "Gold Pack" }
                            ].map((obj, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">{obj.title}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-2/3" />
                                            </div>
                                            <span>{obj.progress}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                                        {obj.reward}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* --- DIVISION STATUS --- */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 rounded-2xl bg-[#1a1d24] border border-white/5 space-y-4 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
                                <Crown className="h-4 w-4" /> Division 4
                            </h3>
                            <span className="text-xs text-white/40">Top 15%</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-3">
                                <p className="text-xs text-white/60">Promotion Requirements:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                            <CheckIcon className="h-3 w-3" />
                                        </div>
                                        <span className="text-white/80 line-through decoration-white/30">5 Focus Matches</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="h-4 w-4 rounded-full bg-white/10 border border-white/20" />
                                        <span className="text-white">Maintain 5-day streak</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="h-20 w-20 flex-shrink-0 flex items-center justify-center">
                                <Crown className="h-12 w-12 text-white/10" />
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* --- LIVE EVENTS --- */}
                <section className="space-y-4 pt-4">
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                        <Timer className="h-4 w-4" /> Live Events
                    </h2>

                    <div className="relative group overflow-hidden rounded-2xl h-32 bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-500/30 flex items-center p-6 shadow-xl hover:scale-[1.01] transition-transform cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="absolute right-[-20px] top-[-20px] h-40 w-40 bg-blue-500/30 blur-3xl rounded-full" />

                        <div className="relative z-10 flex-1">
                            <span className="inline-block px-2 py-0.5 bg-blue-400 text-blue-950 text-[10px] font-bold uppercase rounded mb-2">
                                Limited Time
                            </span>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Exam Sprint Cup</h3>
                            <p className="text-blue-200 text-xs mt-1">Double XP on all sessions &gt; 45 mins</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-blue-300 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </div>
                </section>

                {/* --- TROPHY CABINET (Mini) --- */}
                <section className="grid grid-cols-4 gap-2 pt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-1 group hover:bg-white/10 transition-colors cursor-pointer">
                            <Medal className={cn(
                                "h-6 w-6 transition-all duration-300",
                                i <= 2 ? "text-amber-400 drop-shadow-md group-hover:scale-110" : "text-white/10"
                            )} />
                            <span className="text-[8px] uppercase tracking-wider text-white/30 font-bold">
                                {i <= 2 ? "Earned" : "Locked"}
                            </span>
                        </div>
                    ))}
                </section>

                {/* --- CUSTOM FC BOTTOM NAV (Overlays Global Nav) --- */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0f1115]/90 backdrop-blur-xl border-t border-white/10 z-[60] flex items-center justify-around px-2 pb-4">
                    {[
                        { label: "Home", icon: "home", active: false },
                        { label: "Career", icon: "career", active: true },
                        { label: "Squad", icon: "users", active: false },
                        { label: "Market", icon: "shopping-bag", active: false },
                        { label: "Store", icon: "package", active: false }
                    ].map((item) => (
                        <div key={item.label} className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-16 cursor-pointer",
                            item.active ? "text-emerald-400 -translate-y-2" : "text-white/30 hover:text-white/60"
                        )}>
                            {/* Icon render logic */}
                            {item.icon === "career" ? (
                                <div className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center bg-emerald-500/10",
                                    item.active ? "border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "border-transparent"
                                )}>
                                    <Trophy className="h-3 w-3 fill-current" />
                                </div>
                            ) : item.icon === "home" ? (
                                <Button variant="ghost" className="p-0 h-6 w-6 hover:bg-transparent" onClick={() => window.location.href = '/dashboard'}>
                                    <Home className="h-5 w-5" />
                                </Button>
                            ) : (
                                <div className="h-6 w-6 border-2 border-transparent flex items-center justify-center">
                                    {item.label === "Squad" && <Users className="h-5 w-5" />}
                                    {item.label === "Market" && <ShoppingBag className="h-5 w-5" />}
                                    {item.label === "Store" && <Package className="h-5 w-5" />}
                                </div>
                            )}
                            <span className={cn(
                                "text-[9px] uppercase font-bold tracking-widest",
                                item.active && "text-emerald-400 drop-shadow-md"
                            )}>{item.label}</span>

                            {item.active && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
