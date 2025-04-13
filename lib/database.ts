// This is a client-side utility to interact with our Django backend
// which handles the actual database operations

export async function saveAnalysisToDatabase(text: string, results: any) {
  try {
    const response = await fetch("http://localhost:8000/api/save-analysis/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        entities: results.entities,
        tokens: results.tokens,
        sentences: results.sentences,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save analysis to database")
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving to database:", error)
    throw error
  }
}

export async function getRecentAnalyses() {
  try {
    const response = await fetch("http://localhost:8000/api/recent-analyses/")

    if (!response.ok) {
      throw new Error("Failed to fetch recent analyses")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching recent analyses:", error)
    throw error
  }
}
