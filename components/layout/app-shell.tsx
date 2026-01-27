"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { createContext, useContext, useState } from "react"

interface AppShellContextType {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined)

export function useAppShell() {
    const context = useContext(AppShellContext)
    if (!context) {
        throw new Error("useAppShell must be used within an AppShell")
    }
    return context
}

interface AppShellProps {
    children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)

    return (
        <AppShellContext.Provider value={{ isCollapsed, toggleSidebar }}>
            <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AppShellContext.Provider>
    )
}
