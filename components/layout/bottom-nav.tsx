"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Library, FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const items = [
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
            title: "Notes",
            href: "/notes",
            icon: FileText,
        },
        {
            title: "You",
            href: "/profile",
            icon: User,
        },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border/50 flex items-center justify-around z-50 pb-safe">
            {items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                        <span className="text-[10px] font-medium">{item.title}</span>
                    </Link>
                )
            })}
        </div>
    )
}
