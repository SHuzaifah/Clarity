"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Clock, FileText } from "lucide-react";
import Link from "next/link";

import { use } from "react";

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // Mock course data
    const course = {
        id: id,
        title: "Calculus: Limits & Continuity",
        description: "Master the foundation of calculus with a structured path including limits, continuity, and derivatives.",
        progress: 35,
        modules: [
            {
                id: "mod-1",
                title: "Introduction to Limits",
                videos: [
                    { id: "riXcZT2ICjA", title: "What is a Limit?", duration: "10:05", completed: true },
                    { id: "video2", title: "Computing Limits", duration: "15:30", completed: false },
                ]
            },
            {
                id: "mod-2",
                title: "Continuity",
                videos: [
                    { id: "video3", title: "Definition of Continuity", duration: "12:00", completed: false },
                    { id: "video4", title: "Intermediate Value Theorem", duration: "08:45", completed: false },
                ]
            }
        ]
    };

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                    <div className="aspect-video w-full md:w-[400px] rounded-xl bg-muted overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60"
                            alt="Course Thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold">{course.title}</h1>
                            <p className="text-muted-foreground mt-2">{course.description}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 4h 20m</span>
                            <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> 12 Lessons</span>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex justify-between text-sm">
                                <span>{course.progress}% Complete</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="w-full md:w-auto gap-2">
                                <Play className="h-4 w-4 fill-current" />
                                Continue Learning
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Course Content</h2>
                    <div className="grid gap-4">
                        {course.modules.map((module, index) => (
                            <div key={module.id} className="border rounded-lg p-4 space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                                        {index + 1}
                                    </span>
                                    {module.title}
                                </h3>
                                <div className="space-y-2 pl-8">
                                    {module.videos.map((video) => (
                                        <Link
                                            key={video.id}
                                            href={`/watch/${video.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`mt-0.5 ${video.completed ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                    {video.completed ? <CheckCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium group-hover:text-primary transition-colors">{video.title}</p>
                                                    <p className="text-xs text-muted-foreground">Video • {video.duration}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                Play
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
