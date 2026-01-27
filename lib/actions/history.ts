"use server";

import { createClient } from "@/lib/supabase/server";

interface HistoryEntry {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    completed?: boolean;
    position?: number;
    duration?: number;
    notes?: any;
}

export async function addToHistory({ videoId, title, thumbnailUrl, completed, position, duration, notes }: HistoryEntry) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Use Upsert to prevent duplicates
    const updateData: any = {
        user_id: user.id,
        video_id: videoId,
        title,
        thumbnail_url: thumbnailUrl,
        watched_at: new Date().toISOString(), // Update timestamp on every interaction
    };

    if (completed !== undefined) updateData.completed = completed;
    if (position !== undefined) updateData.last_position = position;
    if (duration !== undefined) updateData.total_duration = duration;
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await supabase
        .from("watch_history")
        .upsert(updateData, { onConflict: 'user_id, video_id' });

    if (error) {
        console.error("Failed to update history:", error);
    }
}

export async function getWatchHistory(videoId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("video_id", videoId)
        .single();

    return data;
}
