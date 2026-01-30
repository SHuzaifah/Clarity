"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pen, Undo, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScratchpadProps {
    initialData?: string;
    onSave?: (data: string) => void;
    isDark?: boolean;
}

export default function Scratchpad({ initialData, onSave, isDark = false }: ScratchpadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
    const [history, setHistory] = useState<string[]>([]);

    const getCtx = () => canvasRef.current?.getContext('2d');

    const [initialized, setInitialized] = useState(false);

    // Handle Resize & HiDPI first
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current && canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                const { width, height } = containerRef.current.getBoundingClientRect();

                // If dimensions haven't changed siginificantly, skip to avoid reset
                if (canvasRef.current.width === width * dpr && canvasRef.current.height === height * dpr) {
                    if (!initialized) setInitialized(true);
                    return;
                }

                // Save content if initialized (to prevent clearing on resize)
                let tempCanvas: HTMLCanvasElement | null = null;
                if (initialized) {
                    tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvasRef.current.width;
                    tempCanvas.height = canvasRef.current.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    if (tempCtx) tempCtx.drawImage(canvasRef.current, 0, 0);
                }

                // Resize canvas to HiDPI
                canvasRef.current.width = width * dpr;
                canvasRef.current.height = height * dpr;

                // Fix CSS size
                canvasRef.current.style.width = `${width}px`;
                canvasRef.current.style.height = `${height}px`;

                // Scale context
                const ctx = getCtx();
                if (ctx) {
                    ctx.scale(dpr, dpr);
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    // Restore content
                    if (tempCanvas) {
                        ctx.save();
                        ctx.scale(1 / dpr, 1 / dpr);
                        ctx.drawImage(tempCanvas, 0, 0);
                        ctx.restore();
                    }
                }

                if (!initialized) setInitialized(true);
            }
        };

        window.addEventListener('resize', updateSize);
        // Run immediately
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, [initialized]);

    // Load initial data ONLY after initialization
    // Load initial data ONLY after initialization along with a ref check
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (initialized && initialData && canvasRef.current && !hasLoadedRef.current) {
            hasLoadedRef.current = true;

            const img = new Image();
            img.onload = () => {
                const ctx = getCtx();
                if (ctx && canvasRef.current) {
                    const dpr = window.devicePixelRatio || 1;

                    // Clear first to be safe
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.restore();

                    const logicalWidth = canvasRef.current.width / dpr;
                    const logicalHeight = canvasRef.current.height / dpr;

                    ctx.drawImage(img, 0, 0, logicalWidth, logicalHeight);

                    // Save this as the first history state
                    saveHistory();
                }
            };
            img.src = initialData;
        }
    }, [initialized, initialData]);

    const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = getCtx();
        if (!ctx || !canvasRef.current) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e);

        setLastPoint({ x: offsetX, y: offsetY });

        // Set up drawing style
        ctx.lineWidth = mode === 'pen' ? 2.5 : 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Theme-aware colors
        const bgColor = isDark ? '#09090b' : '#ffffff';
        const penColor = isDark ? '#ffffff' : '#000000';
        ctx.strokeStyle = mode === 'pen' ? penColor : bgColor;

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        saveHistory();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !lastPoint) return;
        const ctx = getCtx();
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e);

        // Use quadratic curve for smooth drawing
        const midX = (lastPoint.x + offsetX) / 2;
        const midY = (lastPoint.y + offsetY) / 2;

        ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
        ctx.stroke();

        setLastPoint({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            setLastPoint(null);
            getCtx()?.closePath();
            triggerSave();
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
        if ('touches' in e) {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        } else {
            return {
                offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
                offsetY: (e as React.MouseEvent).nativeEvent.offsetY
            };
        }
    };

    const saveHistory = () => {
        if (canvasRef.current) {
            const data = canvasRef.current.toDataURL();
            setHistory(prev => [...prev.slice(-10), data]);
        }
    };

    const undo = () => {
        if (history.length === 0 || !canvasRef.current) return;
        const prevData = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));

        const img = new Image();
        img.onload = () => {
            const ctx = getCtx();
            if (ctx && canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                // Clear physical pixels
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.restore();

                ctx.drawImage(img, 0, 0, canvasRef.current.width / dpr, canvasRef.current.height / dpr);
                triggerSave();
            }
        };
        img.src = prevData;
    };

    const clear = () => {
        saveHistory();
        const ctx = getCtx();
        if (ctx && canvasRef.current) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.restore();
            triggerSave();
        }
    };

    const triggerSave = useCallback(() => {
        if (onSave && canvasRef.current) {
            onSave(canvasRef.current.toDataURL());
        }
    }, [onSave]);

    return (
        <div ref={containerRef} className={cn(
            "relative h-full w-full select-none touch-none overflow-hidden cursor-crosshair",
            isDark ? "bg-zinc-950" : "bg-white"
        )}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block"
            />

            {/* Toolbar */}
            <div className={cn(
                "absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 p-1 backdrop-blur border shadow-sm rounded-lg",
                isDark
                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
                    : "bg-white/95 border-zinc-200 text-zinc-900"
            )}>
                <Button
                    variant={mode === 'pen' ? (isDark ? 'secondary' : 'default') : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMode('pen')}
                    title="Pen"
                >
                    <Pen className="h-4 w-4" />
                </Button>
                <Button
                    variant={mode === 'eraser' ? (isDark ? 'secondary' : 'default') : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMode('eraser')}
                    title="Eraser"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
                <div className={cn("w-px mx-1 my-1", isDark ? "bg-zinc-700" : "bg-zinc-200")} />
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", isDark ? "hover:text-white" : "hover:text-black")}
                    onClick={undo}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-red-500"
                    onClick={clear}
                    title="Clear"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
