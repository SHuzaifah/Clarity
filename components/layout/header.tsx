"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { Button } from "@/components/ui/button"
import { useAppShell } from "./app-shell"

export function Header() {
    const { toggleSidebar } = useAppShell()
    const router = useRouter()
    const [query, setQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-6 gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/dashboard" className="hidden md:flex items-center space-x-2">
                        <span className="font-bold text-xl">Clarity</span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses, channels, or videos..."
                            className="pl-9 w-full bg-muted/50 focus:bg-background transition-colors"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Link href="/profile">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" title="Profile">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold border border-primary/20">
                                S
                            </div>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
