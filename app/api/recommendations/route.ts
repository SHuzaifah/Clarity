import { NextRequest, NextResponse } from "next/server"
import { getPersonalizedRecommendations } from "@/lib/actions/recommendations"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            )
        }

        const videos = await getPersonalizedRecommendations(userId)

        return NextResponse.json({ videos }, {
            headers: {
                'Cache-Control': 'private, max-age=60, stale-while-revalidate=120'
            }
        })
    } catch (error) {
        console.error("Error fetching recommendations:", error)
        return NextResponse.json(
            { error: "Failed to fetch recommendations" },
            { status: 500 }
        )
    }
}
