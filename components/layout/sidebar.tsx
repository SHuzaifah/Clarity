"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Use Lucide icons directly if available or custom component
import { Home, Library, Settings, History, PlaySquare, Clock, User, ChevronLeft, ChevronRight, FileText, Bookmark } from "lucide-react"
import { useAppShell } from "./app-shell"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Home",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Library",
        href: "/library",
        icon: Library,
    },
    {
        title: "Collections",
        href: "/collections",
        icon: Bookmark,
    },
    {
        title: "Notebook",
        href: "/notes",
        icon: FileText,
    },
    {
        title: "History",
        href: "/history",
        icon: History,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, toggleSidebar } = useAppShell()

    return (
        <aside
            className={cn(
                "hidden h-full bg-background md:flex flex-col border-r transition-all duration-300 ease-in-out overflow-y-auto shrink-0 group z-40",
                isCollapsed ? "w-[72px] hover:w-64 relative" : "w-64"
            )}
        >
            <div className="flex flex-col gap-2 p-4 flex-1">
                <div className="px-2 py-2">
                    <h2 className={cn(
                        "mb-2 px-2 text-lg font-semibold tracking-tight transition-all duration-300 whitespace-nowrap overflow-hidden",
                        isCollapsed ? "opacity-0 w-0 group-hover:w-auto group-hover:opacity-100" : "opacity-100"
                    )}>
                        Discover
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground min-h-[48px]",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                    isCollapsed && "justify-start" // Always justify start to align icons
                                )}
                                title={isCollapsed ? item.title : undefined}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span className={cn(
                                    "text-sm font-medium whitespace-nowrap transition-all duration-300",
                                    isCollapsed ? "opacity-0 w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100" : "opacity-100"
                                )}>
                                    {item.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
            {/* Footer collapse button */}
            <div className="p-4 border-t flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="ml-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
        </aside>
    )
}
