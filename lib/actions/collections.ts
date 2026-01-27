"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCollections() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name', { ascending: true }); // Watch Later will be sorted. Maybe pin it?

    if (error) {
        console.error("Error fetching collections:", error);
        return [];
    }
    return data;
}

export async function getCollectionItems(collectionId: string) {
    const supabase = await createClient();

    // Join with videos table to get details
    // Note: This requires a foreign key relation if we want to use single query join?
    // But `collection_items.video_id` is text, `videos.id` is text.
    // If we didn't define explicit FK in SQL, Supabase might not infer it unless we did.
    // We didn't define FK in `collections_schema.sql` (just `video_id text`).
    // So we need to fetch items, then fetch videos.

    // 1. Get items
    const { data: items, error } = await supabase
        .from('collection_items')
        .select('id, video_id, added_at')
        .eq('collection_id', collectionId)
        .order('added_at', { ascending: false });

    if (error || !items || items.length === 0) return [];

    const videoIds = items.map(i => i.video_id);

    // 2. Get videos details
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);

    // Map back to preserve order or just return
    // We can return combined object
    return items.map(item => {
        const video = videos?.find(v => v.id === item.video_id);
        return {
            ...item,
            video: video || null // Video might be missing if not synced yet?
        };
    });
}

export async function addToCollection(collectionName: string, videoId: string, videoMetadata?: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    try {
        // 1. Ensure Collection Exists
        let { data: collection } = await supabase
            .from('collections')
            .select('id')
            .eq('user_id', user.id)
            .eq('name', collectionName)
            .single();

        if (!collection) {
            const { data: newCollection, error: createError } = await supabase
                .from('collections')
                .insert({ user_id: user.id, name: collectionName })
                .select('id')
                .single();

            if (createError) throw createError;
            collection = newCollection;
        }

        // 2. Upsert Video Metadata (if provided) to ensure it exists in 'videos' table
        if (videoMetadata) {
            await supabase.from('videos').upsert({
                id: videoId,
                title: videoMetadata.title,
                channel_id: videoMetadata.channelId || 'unknown', // Fallback
                channel_title: videoMetadata.channelTitle,
                thumbnail_url: videoMetadata.thumbnailUrl,
                published_at: videoMetadata.publishedAt,
            }, { onConflict: 'id' });
        }

        // 3. Add to Collection
        const { error: insertError } = await supabase
            .from('collection_items')
            .insert({ collection_id: collection.id, video_id: videoId });

        if (insertError) {
            // Ignore duplicate key error (already in collection)
            if (insertError.code === '23505') return { success: true, message: "Already in collection" };
            throw insertError;
        }

        revalidatePath('/collections');
        return { success: true };
    } catch (e) {
        console.error("Error adding to collection:", e);
        return { error: "Failed to save video" };
    }
}

export async function removeFromCollection(collectionName: string, videoId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get collection ID
    const { data: collection } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', collectionName)
        .single();

    if (collection) {
        await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', collection.id)
            .eq('video_id', videoId);

        revalidatePath('/collections');
    }
}

export async function checkVideoSavedStatus(videoId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Watch Later')
        .single();

    if (!data) return false;

    const { count } = await supabase
        .from('collection_items')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', data.id)
        .eq('video_id', videoId);

    return (count || 0) > 0;
}
