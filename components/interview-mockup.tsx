"use client"

import { useState, useEffect } from "react"
import { Video, Mic, Bot } from "lucide-react"

export function InterviewMockup() {
  const [confidence, setConfidence] = useState(75)
  const [activeExpression, setActiveExpression] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence((prev) => {
        const change = Math.random() * 10 - 5
        return Math.max(40, Math.min(95, prev + change))
      })
      setActiveExpression(Math.floor(Math.random() * 3))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getConfidenceColor = (value: number) => {
    if (value >= 70) return "bg-green-500"
    if (value >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const expressions = ["🙂", "😐", "😟"]

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl" />

      <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-secondary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-secondary-foreground text-sm font-medium">Live Interview Session</span>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-red-400" />
            <Mic className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-5 gap-4 p-4">
          {/* Webcam view */}
          <div className="col-span-3 relative">
            <div className="aspect-video bg-secondary/5 rounded-xl overflow-hidden relative">
              <img src="/professional-person-in-business-attire-at-desk-wit.jpg" alt="Interview candidate" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-secondary-foreground text-xs font-medium">REC</span>
              </div>
            </div>

            {/* AI Robot overlay */}
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur rounded-xl p-3 shadow-lg border border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-xs font-medium text-foreground">AI Interviewer</div>
                  <div className="text-xs text-muted-foreground">Analyzing...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics panel */}
          <div className="col-span-2 space-y-4">
            {/* Confidence meter */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">Confidence Level</div>
              <div className="flex items-end gap-2 h-24">
                <div className="flex-1 bg-muted rounded-lg overflow-hidden relative">
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${getConfidenceColor(confidence)} transition-all duration-500 animate-confidence-pulse`}
                    style={{ height: `${confidence}%` }}
                  />
                </div>
                <div className="text-2xl font-bold text-foreground">{Math.round(confidence)}%</div>
              </div>
            </div>

            {/* Expression indicators */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">Expression</div>
              <div className="flex justify-around">
                {expressions.map((emoji, index) => (
                  <div
                    key={index}
                    className={`text-2xl transition-all duration-300 ${
                      activeExpression === index ? "scale-125 opacity-100" : "scale-100 opacity-40"
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tip */}
            <div className="bg-teal-light rounded-xl p-3 border border-primary/20">
              <div className="text-xs font-medium text-primary mb-1">AI Tip</div>
              <div className="text-xs text-foreground">
                {confidence >= 70
                  ? "Great tone! Keep maintaining eye contact."
                  : confidence >= 50
                    ? "Try to speak more slowly and clearly."
                    : "Take a deep breath and relax your shoulders."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
