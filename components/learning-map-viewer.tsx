"use client";

import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import { MapNode, MapEdge } from "@/types";
import { useRouter } from "next/navigation";

const initialNodes = [
    {
        id: "1",
        position: { x: 0, y: 0 },
        data: { label: "Start: Limits Concept" },
        type: "input",
        className: "border-2 border-primary bg-background shadow-lg rounded-xl p-4 w-[200px] text-center font-bold hover:border-blue-500 cursor-pointer transition-colors",
    },
    {
        id: "2",
        position: { x: 0, y: 150 },
        data: { label: "Left & Right Limits" },
        className: "border border-border bg-card shadow-sm rounded-xl p-4 w-[200px] text-center hover:border-primary cursor-pointer transition-colors",
    },
    {
        id: "3",
        position: { x: -100, y: 300 },
        data: { label: "Solved Examples" },
        className: "border border-border bg-card shadow-sm rounded-xl p-4 w-[200px] text-center hover:border-primary cursor-pointer transition-colors",
    },
    {
        id: "4",
        position: { x: 100, y: 300 },
        data: { label: "Common Traps" },
        className: "border border-destructive/50 bg-destructive/10 shadow-sm rounded-xl p-4 w-[200px] text-center hover:border-destructive cursor-pointer transition-colors",
    },
    {
        id: "5",
        position: { x: 0, y: 450 },
        data: { label: "Final Quiz" },
        type: "output",
        className: "border-2 border-primary bg-primary text-primary-foreground shadow-lg rounded-xl p-4 w-[200px] text-center font-bold hover:bg-primary/90 cursor-pointer transition-colors",
    },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3", markerEnd: { type: MarkerType.ArrowClosed } },
    { id: "e2-4", source: "2", target: "4", markerEnd: { type: MarkerType.ArrowClosed } },
    { id: "e3-5", source: "3", target: "5", animated: true },
    { id: "e4-5", source: "4", target: "5", animated: true },
];

export function LearningMapViewer() {
    const router = useRouter();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        // Navigate to the focus player for this node
        router.push(`/play/${node.id}`);
    }, [router]);

    return (
        <div className="h-full min-h-[500px] w-full items-center justify-center bg-muted/5 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
                className="bg-background/50"
            >
                <Background gap={20} color="var(--border)" className="opacity-50" />
                <Controls className="bg-background border-border shadow-sm p-1 rounded-lg" />
            </ReactFlow>
        </div>
    );
}
