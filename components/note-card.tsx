"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Calendar, MoreVertical, Download, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteItemProps {
    item: any; // Using any for simplicity matching the supabase shape, but ideally strictly typed
}

export function NoteCard({ item }: NoteItemProps) {
    const handleExport = (e: React.MouseEvent, format: 'md' | 'pdf' | 'txt') => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        const title = item.title || "Untitled Video";
        const dateStr = new Date(item.watched_at).toLocaleDateString();
        const videoId = item.video_id;
        const notes = item.notes;

        if (format === 'md') {
            const mdContent = `# ${title}
**Date:** ${dateStr}
**Video:** [Link](https://www.youtube.com/watch?v=${videoId})

## Summary
${notes.summary || "No summary."}

## Notes
${notes.jot || "No notes."}
`;
            navigator.clipboard.writeText(mdContent);
            alert("Copied Markdown to clipboard!");
        } else if (format === 'txt') {
            const content = `Title: ${title}
Date: ${dateStr}
Video: https://www.youtube.com/watch?v=${videoId}

Summary:
${notes.summary || "No summary."}

Notes:
${notes.jot || "No notes."}
            `;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.txt`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            const maxLineWidth = pageWidth - (margin * 2);

            doc.setFontSize(16);
            doc.text(title.substring(0, 50) + (title.length > 50 ? "..." : ""), margin, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Date: ${dateStr}`, margin, 30);
            doc.setTextColor(0);

            let y = 45;

            if (notes.summary) {
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Summary", margin, y);
                y += 7;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);

                const splitSummary = doc.splitTextToSize(notes.summary, maxLineWidth);
                doc.text(splitSummary, margin, y);
                y += splitSummary.length * 5 + 10;
            }

            if (notes.jot) {
                if (y > 250) { doc.addPage(); y = 20; }
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Notes", margin, y);
                y += 7;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);

                const splitJot = doc.splitTextToSize(notes.jot, maxLineWidth);
                doc.text(splitJot, margin, y);
                y += splitJot.length * 5 + 10;
            }

            if (notes.canvas && typeof notes.canvas === 'string') {
                if (y > 200) { doc.addPage(); y = 20; }
                try {
                    const imgProps = doc.getImageProperties(notes.canvas);
                    const pdfWidth = maxLineWidth;
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    doc.text("Sketch:", margin, y);
                    y += 5;
                    doc.addImage(notes.canvas, 'PNG', margin, y, pdfWidth, pdfHeight);
                } catch (e) {
                    console.error("Failed to add image", e);
                }
            }

            doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        }
    };

    return (
        <Link
            href={`/watch/${item.video_id}`}
            className="group block h-full select-none" // added select-none to prevent text selection when clicking menu
        >
            <div className="h-full border rounded-xl bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col relative">
                {/* Export Menu Button - Positioned absolute top-right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-sm bg-background/80 backdrop-blur-sm"
                                onClick={(e) => e.stopPropagation()} // Stop navigation
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleExport(e, 'md')}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Markdown
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleExport(e, 'pdf')}>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleExport(e, 'txt')}>
                                <FileText className="mr-2 h-4 w-4" /> Download TXT
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-start justify-between mb-3 pr-8">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.watched_at), { addSuffix: true })}
                    </span>
                </div>

                <h3 className="font-semibold text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug">
                    {item.title || "Untitled Video"}
                </h3>

                <div className="flex-1 space-y-3">
                    {/* Canvas Preview */}
                    {item.notes.canvas && typeof item.notes.canvas === 'string' && (
                        <div className="w-full h-32 bg-white dark:bg-zinc-900 rounded-lg border-2 flex items-center justify-center overflow-hidden relative shadow-sm">
                            <img
                                src={item.notes.canvas}
                                alt="Sketch"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    )}

                    {/* Preview of note content */}
                    {(item.notes.jot || item.notes.summary) && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {item.notes.jot || item.notes.summary}
                        </p>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t flex flex-wrap gap-1.5">
                    {item.notes.canvas && typeof item.notes.canvas === 'string' && (
                        <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md">
                            Sketch
                        </span>
                    )}
                    {item.notes.summary && (
                        <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                            Summary
                        </span>
                    )}
                    {item.notes.jot && (
                        <span className="text-[10px] uppercase font-semibold tracking-wide px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
                            Notes
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
