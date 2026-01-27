"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function clearWatchHistory() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from('watch_history')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/history');
    return { success: true };
}

export async function clearSavedVideos() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Delete all collection items for user's collections
    const { data: collections } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', user.id);

    if (collections && collections.length > 0) {
        const collectionIds = collections.map(c => c.id);

        const { error } = await supabase
            .from('collection_items')
            .delete()
            .in('collection_id', collectionIds);

        if (error) {
            return { success: false, error: error.message };
        }
    }

    revalidatePath('/collections');
    return { success: true };
}

export async function clearNotes() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/notes');
    return { success: true };
}

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Delete user data in order (due to foreign key constraints)
    // 1. Collection items
    const { data: collections } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', user.id);

    if (collections && collections.length > 0) {
        const collectionIds = collections.map(c => c.id);
        await supabase.from('collection_items').delete().in('collection_id', collectionIds);
    }

    // 2. Collections
    await supabase.from('collections').delete().eq('user_id', user.id);

    // 3. Notes
    await supabase.from('notes').delete().eq('user_id', user.id);

    // 4. Watch history
    await supabase.from('watch_history').delete().eq('user_id', user.id);

    // 5. Finally delete the user account
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is missing. Cannot delete user auth.");
        // We return success true here because all data is gone, but the auth user remains.
        // This prevents the user from being stuck in a "partial delete" state error loop.
        // However, we should sign them out.
        return { success: false, error: "Configuration error: Missing Service Role Key. Data deleted but account remains." };
    }

    const adminSupabase = await createAdminClient();
    const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
