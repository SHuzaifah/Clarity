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
                "hidden h-full bg-background md:flex flex-col border-r transition-all duration-300 ease-in-out overflow-y-auto shrink-0 z-40",
                isCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            <div className={cn("flex flex-col gap-2 p-2 flex-1", !isCollapsed && "p-4")}>
                <div className="py-2">
                    {!isCollapsed && (
                        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                            Discover
                        </h2>
                    )}
                    <div className={cn("space-y-1", isCollapsed && "flex flex-col gap-2 items-center")}>
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center transition-all duration-200 group relative",
                                        isCollapsed
                                            ? "h-12 w-12 justify-center rounded-2xl"
                                            : "gap-4 rounded-lg px-3 py-3 min-h-[48px]",
                                        isActive
                                            ? (isCollapsed ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground")
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    <item.icon className={cn(
                                        "shrink-0 transition-transform duration-200",
                                        isCollapsed ? "h-6 w-6" : "h-5 w-5",
                                        isActive && isCollapsed && "scale-110"
                                    )} />

                                    {!isCollapsed && (
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
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
