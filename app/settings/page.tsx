"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Monitor, Shield, Info, Trash2, Mail, FileText, ExternalLink } from "lucide-react";
import { clearWatchHistory, clearSavedVideos, clearNotes } from "@/lib/actions/settings";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const [clearing, setClearing] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClearData = async (type: 'history' | 'saved' | 'notes') => {
        if (!confirm(`Are you sure you want to clear all ${type === 'history' ? 'watch history' : type === 'saved' ? 'saved videos' : 'notes'}? This action cannot be undone.`)) {
            return;
        }

        setClearing(type);

        try {
            let result;
            if (type === 'history') {
                result = await clearWatchHistory();
            } else if (type === 'saved') {
                result = await clearSavedVideos();
            } else {
                result = await clearNotes();
            }

            if (result.success) {
                alert(`Successfully cleared ${type === 'history' ? 'watch history' : type === 'saved' ? 'saved videos' : 'notes'}`);
                router.refresh();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setClearing(null);
        }
    };

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8 py-4 px-4">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your preferences and data.</p>
                </div>

                {/* Appearance */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Monitor className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Appearance</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Theme</Label>
                            <p className="text-sm text-muted-foreground">
                                Choose how Clarity looks to you.
                            </p>
                        </div>
                        {mounted ? (
                            <div className="flex items-center gap-2 border rounded-lg p-1">
                                <Button
                                    size="sm"
                                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                                    onClick={() => setTheme('light')}
                                    className="px-3 text-xs"
                                >
                                    Light
                                </Button>
                                <Button
                                    size="sm"
                                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                                    onClick={() => setTheme('dark')}
                                    className="px-3 text-xs"
                                >
                                    Dark
                                </Button>
                                <Button
                                    size="sm"
                                    variant={theme === 'system' ? 'secondary' : 'ghost'}
                                    onClick={() => setTheme('system')}
                                    className="px-3 text-xs"
                                >
                                    System
                                </Button>
                            </div>
                        ) : (
                            <div className="h-9 w-[180px] border rounded-lg bg-muted/50 animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Privacy & Data */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Privacy &amp; Data</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div className="space-y-0.5">
                                <Label className="text-base">Clear Watch History</Label>
                                <p className="text-sm text-muted-foreground">
                                    Remove all videos from your watch history.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleClearData('history')}
                                disabled={clearing === 'history'}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {clearing === 'history' ? 'Clearing...' : 'Clear'}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                            <div className="space-y-0.5">
                                <Label className="text-base">Clear Saved Videos</Label>
                                <p className="text-sm text-muted-foreground">
                                    Remove all videos from your collections.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleClearData('saved')}
                                disabled={clearing === 'saved'}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {clearing === 'saved' ? 'Clearing...' : 'Clear'}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="space-y-0.5">
                                <Label className="text-base">Clear Notes</Label>
                                <p className="text-sm text-muted-foreground">
                                    Delete all your saved notes and annotations.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleClearData('notes')}
                                disabled={clearing === 'notes'}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {clearing === 'notes' ? 'Clearing...' : 'Clear'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Info className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">About</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">App Version</span>
                            <span className="text-sm font-medium">1.0.0</span>
                        </div>

                        <div className="pt-4 border-t space-y-3">
                            <a
                                href="/terms"
                                className="flex items-center justify-between py-2 hover:text-primary transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm font-medium">Terms &amp; Privacy</span>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            </a>

                            <a
                                href="mailto:shuzaifah02@gmail.com"
                                className="flex items-center justify-between py-2 hover:text-primary transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm font-medium">Feedback / Contact</span>
                                </div>
                                <span className="text-xs text-muted-foreground group-hover:text-primary">shuzaifah02@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
