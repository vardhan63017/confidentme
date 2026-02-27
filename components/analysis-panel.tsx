"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Lightbulb, FileText, TrendingUp, AlertTriangle } from "lucide-react"

interface AnalysisResult {
  transcription: string
  grammarMistakes: { original: string; suggestion: string; reason: string }[]
  wordSuggestions: { original: string; better: string; reason: string }[]
  fillerWords: { word: string; count: number }[]
  overallScore: number
  tips: string[]
}

export function AnalysisPanel({ result }: { result: AnalysisResult }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const totalFillerWords = result.fillerWords.reduce((sum, f) => sum + f.count, 0)

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">Overall Performance</h3>
            <p className="text-white/60 text-sm">Based on speech & expressions</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(result.overallScore / 100) * 220} 220`}
                className={getScoreColor(result.overallScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{result.grammarMistakes.length}</p>
            <p className="text-xs text-white/50">Grammar Errors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{totalFillerWords}</p>
            <p className="text-xs text-white/50">Filler Words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{result.wordSuggestions.length}</p>
            <p className="text-xs text-white/50">Improvements</p>
          </div>
        </div>
      </Card>

      {/* Transcription */}
      <Card className="bg-white/10 border-white/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-white font-medium">Your Response (Transcribed)</h3>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{result.transcription}</p>
      </Card>

      {result.fillerWords.length > 0 && (
        <Card className="bg-white/10 border-white/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h3 className="text-white font-medium">Filler Words Detected</h3>
            <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {totalFillerWords} total
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.fillerWords.map((filler, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1"
              >
                <span className="text-yellow-400 text-sm">"{filler.word}"</span>
                <span className="text-white/50 text-xs">x{filler.count}</span>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-3">
            Tip: Replace filler words with brief pauses to sound more confident and articulate.
          </p>
        </Card>
      )}

      {/* Grammar Mistakes */}
      {result.grammarMistakes.length > 0 && (
        <Card className="bg-white/10 border-white/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h3 className="text-white font-medium">Grammar Corrections</h3>
            <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {result.grammarMistakes.length} found
            </span>
          </div>
          <div className="space-y-3">
            {result.grammarMistakes.map((mistake, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 line-through text-sm">{mistake.original}</span>
                  <span className="text-white/40">→</span>
                  <span className="text-green-400 text-sm font-medium">{mistake.suggestion}</span>
                </div>
                <p className="text-white/50 text-xs">{mistake.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Word Suggestions */}
      {result.wordSuggestions.length > 0 && (
        <Card className="bg-white/10 border-white/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="text-white font-medium">Word Improvements</h3>
            <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
              {result.wordSuggestions.length} suggestions
            </span>
          </div>
          <div className="space-y-3">
            {result.wordSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-sm">"{suggestion.original}"</span>
                  <span className="text-white/40">→</span>
                  <span className="text-primary text-sm font-medium">"{suggestion.better}"</span>
                </div>
                <p className="text-white/50 text-xs">{suggestion.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Issues Found */}
      {result.grammarMistakes.length === 0 &&
        result.fillerWords.length === 0 &&
        result.wordSuggestions.length === 0 && (
          <Card className="bg-green-500/10 border-green-500/30 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="text-green-400 font-medium">Excellent! No major issues detected</h3>
            </div>
            <p className="text-white/60 text-sm mt-2">
              Your response was clear and well-articulated. Keep practicing to maintain this level!
            </p>
          </Card>
        )}

      {/* Tips */}
      <Card className="bg-white/10 border-white/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h3 className="text-white font-medium">Personalized Tips</h3>
        </div>
        <div className="space-y-2">
          {result.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
