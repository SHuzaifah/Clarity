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
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                    <form onSubmit={handleSearch} className="flex w-full items-center">
                        <Input
                            placeholder="Search"
                            className="w-full rounded-l-full border-r-0 border-muted-foreground/20 bg-transparent pl-4 shadow-none focus-visible:ring-0 focus-visible:border-primary/50"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            className="rounded-r-full rounded-l-none border border-l-0 border-muted-foreground/20 bg-muted/50 px-5 hover:bg-muted"
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
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
