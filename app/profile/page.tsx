"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Mail, AlertTriangle, X } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { deleteAccount } from "@/lib/actions/settings";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
                setName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "");
            }
            setIsLoading(false);
        };
        getUser();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: name }
        });

        if (error) {
            alert(`Error updating profile: ${error.message}`);
        } else {
            alert("Profile updated successfully");
            router.refresh();
        }
        setIsSaving(false);
    };

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") {
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteAccount();

            if (result.success) {
                // Redirect to home page after successful deletion
                window.location.href = "/";
            } else {
                alert(`Error: ${result.error}`);
                setIsDeleting(false);
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and account access.</p>
                </div>

                <div className="space-y-6">
                    {/* Personal Info */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                {name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">{name}</h2>
                                <p className="text-sm text-muted-foreground">{email}</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address (Read-only)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={email}
                                        disabled
                                        className="pl-9 bg-muted"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Auth Provider</Label>
                                <div className="flex items-center gap-2 p-2 px-3 border rounded-md bg-muted/50 text-sm">
                                    <span className="font-semibold text-zinc-600 dark:text-zinc-400">Google</span>
                                    <span className="text-zinc-400">•</span>
                                    <span className="text-zinc-500">Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <SignOutButton />
                        <Button onClick={handleSave} disabled={isSaving || isLoading}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                    {/* App Settings & Legal */}
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-muted/30">
                            <h3 className="font-semibold text-sm">App Settings</h3>
                        </div>
                        <div className="divide-y">
                            <button
                                onClick={() => router.push('/settings')}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                            >
                                <span className="text-sm font-medium">General Settings</span>
                                <div className="text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </button>
                            <button
                                onClick={() => router.push('/privacy')}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                            >
                                <span className="text-sm font-medium">Privacy Policy</span>
                                <div className="text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </button>
                            <button
                                onClick={() => router.push('/terms')}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                            >
                                <span className="text-sm font-medium">Terms of Service</span>
                                <div className="text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone - After action buttons */}
                    <div className="rounded-lg border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800 dark:text-red-200">Danger Zone</h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    Once you delete your account, there is no going back. All your data will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="text-red-700 border-red-400 bg-white hover:bg-red-100 hover:text-red-800 hover:border-red-500 dark:text-red-400 dark:border-red-700 dark:bg-transparent dark:hover:bg-red-900/30 dark:hover:border-red-600 font-medium"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background border rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Delete Account</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setConfirmText("");
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3 py-4">
                            <p className="text-sm">
                                This will permanently delete:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                                <li>Your profile and account</li>
                                <li>All saved videos and collections</li>
                                <li>All notes and annotations</li>
                                <li>Your complete watch history</li>
                            </ul>
                            <div className="pt-2">
                                <Label htmlFor="confirm" className="text-sm font-medium">
                                    Type <span className="font-mono font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
                                </Label>
                                <Input
                                    id="confirm"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="mt-2 font-mono"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setConfirmText("");
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleDeleteAccount}
                                disabled={confirmText !== "DELETE" || isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Forever"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
