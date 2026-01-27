"use client";

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

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
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-background p-8 rounded-xl border shadow-sm">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to continue your learning journey
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive text-center">
                    Authentication failed. Please try again.
                </div>
            )}

            <div className="grid gap-6">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={handleLogin}
                    className="h-11 relative"
                >
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}
                    Sign in with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    <p>Only Google Login is enabled for now.</p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 px-4">
            <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
                <Button variant="ghost" className="font-bold text-lg">
                    Clarity
                </Button>
            </Link>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
