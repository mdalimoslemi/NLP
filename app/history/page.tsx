"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentAnalyses } from "@/lib/database"
import { Loader2 } from "lucide-react"

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const data = await getRecentAnalyses()
        setAnalyses(data)
      } catch (err) {
        setError("Failed to load analysis history")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Analysis History</h1>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No analysis history found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader>
                <CardTitle className="text-lg">Analysis #{analysis.id}</CardTitle>
                <CardDescription>{new Date(analysis.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Original Text</h3>
                  <p className="border rounded p-3 bg-muted/30">{analysis.text}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Entities</h3>
                    <div className="flex flex-wrap gap-1">
                      {analysis.entities.map((entity: any, idx: number) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                          {entity.text} ({entity.label})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Tokens</h3>
                    <p className="text-sm">{analysis.tokens.length} tokens extracted</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Sentences</h3>
                    <p className="text-sm">{analysis.sentences.length} sentences identified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
