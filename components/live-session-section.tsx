"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Video, Mic, MicOff, VideoOff, Settings, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const aiTips = [
  "Great posture! Keep it up.",
  "Maintain more eye contact with the camera.",
  "Your voice tone is excellent.",
  "Try to speak a bit slower.",
  "Good use of hand gestures!",
  "Remember to smile naturally.",
]

export function LiveSessionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)
  const [confidence, setConfidence] = useState(72)
  const [activeExpression, setActiveExpression] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)

  useEffect(() => {
    const confidenceInterval = setInterval(() => {
      setConfidence((prev) => {
        const change = Math.random() * 8 - 4
        return Math.max(45, Math.min(95, prev + change))
      })
    }, 1500)

    const expressionInterval = setInterval(() => {
      setActiveExpression(Math.floor(Math.random() * 3))
    }, 3000)

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % aiTips.length)
    }, 4000)

    return () => {
      clearInterval(confidenceInterval)
      clearInterval(expressionInterval)
      clearInterval(tipInterval)
    }
  }, [])

  const getConfidenceColor = (value: number) => {
    if (value >= 70) return "from-green-500 to-green-400"
    if (value >= 50) return "from-yellow-500 to-yellow-400"
    return "from-red-500 to-red-400"
  }

  const getConfidenceLabel = (value: number) => {
    if (value >= 70) return "Confident"
    if (value >= 50) return "Moderate"
    return "Needs Work"
  }

  const expressions = [
    { emoji: "🙂", label: "Positive" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😟", label: "Concerned" },
  ]

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6">
            Live Session Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4 text-balance">
            Experience the <span className="text-primary">interview session</span>
          </h2>
          <p className="text-lg text-secondary-foreground/70 max-w-2xl mx-auto">
            See how our AI analyzes your interview performance in real-time with instant feedback and metrics.
          </p>
        </div>

        <div
          className={`bg-card rounded-3xl shadow-2xl overflow-hidden ${isInView ? "animate-fade-in-up" : "opacity-0"}`}
        >
          {/* Session header */}
          <div className="bg-muted px-6 py-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Live Session</span>
              </div>
              <span className="text-sm text-muted-foreground">Duration: 08:24</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={micOn ? "text-primary" : "text-muted-foreground"}
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={videoOn ? "text-primary" : "text-muted-foreground"}
                onClick={() => setVideoOn(!videoOn)}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main session content */}
          <div className="grid lg:grid-cols-3 gap-0">
            {/* Webcam feed */}
            <div className="lg:col-span-2 p-6 border-r border-border">
              <div className="relative aspect-video bg-secondary/5 rounded-2xl overflow-hidden">
                <img
                  src="/professional-woman-in-blazer-at-modern-desk-during.jpg"
                  alt="Interview candidate"
                  className="w-full h-full object-cover"
                />

                {/* Overlay elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Recording indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-secondary-foreground text-sm font-medium">Recording</span>
                  </div>

                  {/* Face detection frame */}
                  <div className="absolute top-1/4 left-1/3 w-32 h-40 border-2 border-primary/50 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Analytics panel */}
            <div className="p-6 space-y-6">
              {/* Confidence meter */}
              <div className="bg-muted/50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Confidence Level</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      confidence >= 70
                        ? "bg-green-100 text-green-700"
                        : confidence >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getConfidenceLabel(confidence)}
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1 h-32 bg-muted rounded-xl overflow-hidden relative">
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getConfidenceColor(confidence)} transition-all duration-500`}
                      style={{ height: `${confidence}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground drop-shadow-lg">
                        {Math.round(confidence)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expression detection */}
              <div className="bg-muted/50 rounded-2xl p-5">
                <span className="text-sm font-medium text-foreground mb-4 block">Facial Expression</span>
                <div className="flex justify-between">
                  {expressions.map((exp, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                        activeExpression === index ? "bg-primary/10 scale-110" : "opacity-50"
                      }`}
                    >
                      <span className="text-3xl">{exp.emoji}</span>
                      <span className="text-xs text-muted-foreground">{exp.label}</span>
                      {activeExpression === index && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tips */}
              <div className="bg-teal-light rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">AI Feedback</span>
                </div>
                <p className="text-foreground font-medium transition-all duration-300">{aiTips[currentTip]}</p>
              </div>

              {/* Quick metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <div className="text-xs text-muted-foreground">Eye Contact</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-accent">Good</div>
                  <div className="text-xs text-muted-foreground">Voice Tone</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
