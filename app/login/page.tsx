"use client";

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    const handleLogin = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border bg-background/60 p-10 font-sans shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
            <div className="flex flex-col space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-base text-muted-foreground">
                    Sign in to continue mastering what you watch.
                </p>
            </div>

            {error && (
                <div className="mt-4 bg-destructive/10 p-3 rounded-md text-sm text-destructive text-center">
                    Authentication failed. Please try again.
                </div>
            )}

            <div className="mt-8 grid gap-6">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={handleLogin}
                    className="h-12 border-primary/20 bg-background/50 text-base font-medium hover:bg-primary/5 hover:text-primary relative transition-all duration-300"
                >
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-5 w-5" />
                    )}
                    Sign in with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted-foreground/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    <p>Only Google Login is supported for secure access.</p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute -top-1/2 -left-1/2 h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[100px] animate-pulse" />

            <Link href="/" className="absolute left-8 top-8 z-20 transition-transform hover:-translate-x-1">
                <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>
            </Link>

            <Suspense fallback={<div className="text-muted-foreground animate-pulse">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
