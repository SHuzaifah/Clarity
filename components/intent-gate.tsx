"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Compass, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type IntentType = "learn" | "revise" | "explore" | null;

interface IntentGateProps {
    onIntentSelected: (intent: IntentType) => void;
    isOpen: boolean;
}

export function IntentGate({ onIntentSelected, isOpen }: IntentGateProps) {
    const [selected, setSelected] = useState<IntentType>(null);

    const intents = [
        {
            id: "learn",
            label: "Learn",
            icon: Brain,
            description: "Deep dive into new concepts. Strict path.",
            color: "bg-blue-500/10 text-blue-500 hover:border-blue-500",
        },
        {
            id: "revise",
            label: "Revise",
            icon: RotateCcw,
            description: "Quick review of known nodes. Higher speed.",
            color: "bg-amber-500/10 text-amber-500 hover:border-amber-500",
        },
        {
            id: "explore",
            label: "Explore",
            icon: Compass,
            description: "Wander through connections. No linear path.",
            color: "bg-emerald-500/10 text-emerald-500 hover:border-emerald-500",
        },
    ] as const;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4"
                >
                    <div className="mx-auto max-w-2xl text-center w-full">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8 text-3xl font-bold tracking-tight"
                        >
                            What is your intention?
                        </motion.h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {intents.map((intent, index) => (
                                <motion.button
                                    key={intent.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    onClick={() => {
                                        setSelected(intent.id);
                                        // Add a small delay for the animation
                                        setTimeout(() => onIntentSelected(intent.id), 300);
                                    }}
                                    className={cn(
                                        "group relative flex flex-col items-center justify-between rounded-xl border border-border p-6 transition-all hover:scale-105 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
                                        intent.color,
                                        selected === intent.id && "ring-2 ring-ring scale-105"
                                    )}
                                >
                                    <div className="mb-4 rounded-full bg-background p-3 shadow-sm group-hover:shadow-md">
                                        <intent.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">{intent.label}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {intent.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 text-sm text-muted-foreground"
                        >
                            This sets your default playback speed and next-node suggestions.
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
