export type VideoProvider = 'youtube';

export interface Video {
    id: string;
    title: string;
    url: string;
    provider: VideoProvider;
    duration?: number;
    thumbnailUrl?: string;
    channelName: string;
}

export interface Checkpoint {
    id: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    type: 'quiz' | 'reflection';
}

export interface MapNode {
    id: string;
    label: string;
    description?: string;
    videos: Video[];
    checkpoints?: Checkpoint[];
    // For visual positioning
    position?: { x: number; y: number };
    type?: 'concept' | 'root' | 'end';
}

export interface MapEdge {
    id: string;
    sourceId: string;
    targetId: string;
    label?: string;
}

export interface LearningMap {
    id: string;
    title: string;
    description: string;
    nodes: MapNode[];
    edges: MapEdge[];
    authorId: string;
    isPublic: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProgress {
    userId: string;
    mapId: string;
    completedNodeIds: string[];
    currentNodeId: string;
    startedAt: Date;
    lastActiveAt: Date;
}
