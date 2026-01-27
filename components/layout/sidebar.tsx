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
                "hidden h-full bg-background md:flex flex-col border-r transition-all duration-300 ease-in-out overflow-y-auto shrink-0",
                isCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            <div className="flex flex-col gap-2 p-4 flex-1">
                <div className="px-2 py-2">
                    {!isCollapsed && <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Discover</h2>}
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-lg py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isCollapsed
                                        ? "flex-col justify-center gap-1 px-1 h-16"
                                        : "flex-row gap-3 px-3 min-h-[40px] text-sm font-medium",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                                title={isCollapsed ? item.title : undefined}
                            >
                                <item.icon className={cn(
                                    isCollapsed ? "h-6 w-6" : "h-4 w-4"
                                )} />
                                {isCollapsed ? (
                                    <span className="text-[10px] text-center w-full truncate leading-tight">
                                        {item.title}
                                    </span>
                                ) : (
                                    <span>{item.title}</span>
                                )}
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
