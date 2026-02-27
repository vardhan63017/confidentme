"use client"

import { X, Eye, Mic, MessageSquare, BookOpen, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Session {
  id: number
  date: string
  confidence: number
  duration: string
  type: string
  eyeContact: number
  voiceScore: number
  grammarErrors: number
  fillerWords: number
  improvements: string[]
  mistakes: string[]
}

interface SessionDetailProps {
  session: Session
  onClose: () => void
}

export function SessionDetail({ session, onClose }: SessionDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Session Details</h2>
            <p className="text-sm text-muted-foreground">
              {session.date} - {session.type} Interview
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{session.confidence}%</div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{session.eyeContact}%</div>
              <div className="text-xs text-muted-foreground">Eye Contact</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Mic className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{session.voiceScore}%</div>
              <div className="text-xs text-muted-foreground">Voice Score</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{session.duration}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>

          {/* Error Summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Grammar Errors</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{session.grammarErrors}</div>
              <p className="text-sm text-red-700">Common errors: Subject-verb agreement, tense consistency</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Filler Words</h3>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{session.fillerWords}</div>
              <p className="text-sm text-orange-700">Most used: "um", "uh", "like", "you know"</p>
            </div>
          </div>

          {/* Improvements */}
          {session.improvements.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">What You Did Well</h3>
              </div>
              <ul className="space-y-2">
                {session.improvements.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mistakes */}
          {session.mistakes.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {session.mistakes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-red-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Tips */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">AI Recommendations for Next Session</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                Practice pausing instead of using filler words - take a breath before responding.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                Focus on maintaining eye contact with the camera for at least 70% of your response.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Practice Similar Questions</Button>
        </div>
      </div>
    </div>
  )
}
