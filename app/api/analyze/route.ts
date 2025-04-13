import { type NextRequest, NextResponse } from "next/server"
import { saveAnalysisToDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Call Python Django backend API
    const response = await fetch("http://localhost:8000/api/analyze/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze text")
    }

    const data = await response.json()

    // Save analysis results to database
    await saveAnalysisToDatabase(text, data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in analyze route:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}
