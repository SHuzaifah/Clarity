import { NextResponse } from "next/server";

export async function GET() {
    // Clarity Rule: Search is strictly limited to Whitelisted Channels.
    // General YouTube search is DISABLED.
    // Video search is currently disabled until we ingest video data locally.
    // The frontend handles Channel Search locally using the CHANNELS list.

    return NextResponse.json({ videos: [] });
}
