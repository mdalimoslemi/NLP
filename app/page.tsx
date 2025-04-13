"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [text, setText] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("entities")

  const analyzeText = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Text Analysis with Spacy</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Text Input</CardTitle>
          <CardDescription>Enter text to analyze with Spacy NLP</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter text to analyze..."
            className="min-h-[150px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={analyzeText} disabled={loading || !text.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Text"
            )}
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>NLP analysis powered by Spacy</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="sentences">Sentences</TabsTrigger>
              </TabsList>

              <TabsContent value="entities" className="mt-4">
                <h3 className="text-lg font-medium mb-2">Named Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {results.entities.length > 0 ? (
                    results.entities.map((entity: any, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        <span className="font-semibold mr-2">{entity.text}</span>
                        <span className="text-xs text-muted-foreground">{entity.label}</span>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No entities found</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tokens" className="mt-4">
                <h3 className="text-lg font-medium mb-2">Tokens & Parts of Speech</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {results.tokens.map((token: any, index: number) => (
                    <div key={index} className="border rounded p-2 flex justify-between">
                      <span>{token.text}</span>
                      <Badge variant="secondary">{token.pos}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sentences" className="mt-4">
                <h3 className="text-lg font-medium mb-2">Sentences</h3>
                <div className="space-y-2">
                  {results.sentences.map((sentence: string, index: number) => (
                    <div key={index} className="border rounded p-3">
                      {sentence}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
