"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, memo } from "react"
import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAppShell } from "./app-shell"

export const Header = memo(function Header() {
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
                    {/* Replaced Sidebar Menu with Logo for mobile */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="relative h-8 w-auto aspect-[3/1]">
                            <img
                                src="/logo-black.png"
                                alt="Clarity"
                                className="h-full w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/logo-white.png"
                                alt="Clarity"
                                className="h-full w-auto object-contain hidden dark:block"
                            />
                        </div>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center max-w-2xl mx-auto px-2">
                    <form onSubmit={handleSearch} className="flex w-full items-center">
                        <div className="relative w-full flex items-center">
                            <Input
                                placeholder="Search"
                                className="w-full h-10 rounded-l-full border border-r-0 border-muted-foreground/20 bg-muted/10 pl-4 shadow-none focus-visible:ring-0 focus-visible:border-primary/50 text-base"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                                >
                                    <span className="sr-only">Clear</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            )}
                        </div>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="h-10 rounded-r-full rounded-l-none border border-l-0 border-muted-foreground/20 bg-muted/30 px-6 hover:bg-muted/50"
                        >
                            <Search className="h-5 w-5 text-muted-foreground" />
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
})
