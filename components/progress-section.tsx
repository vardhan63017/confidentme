"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Calendar, Clock, TrendingUp } from "lucide-react"
import { ConfidenceChart } from "@/components/charts/confidence-chart"
import { EyeContactChart } from "@/components/charts/eye-contact-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"

const sessions = [
  { date: "Dec 1, 2025", confidence: 82, duration: "15 min", type: "Technical" },
  { date: "Nov 28, 2025", confidence: 76, duration: "20 min", type: "Behavioral" },
  { date: "Nov 25, 2025", confidence: 71, duration: "18 min", type: "Technical" },
  { date: "Nov 22, 2025", confidence: 68, duration: "12 min", type: "General" },
]

export function ProgressSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)

  return (
    <section id="progress" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light text-primary font-medium text-sm mb-6">
            Track Your Growth
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4 text-balance">
            Monitor your <span className="text-primary">interview progress</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All your past interviews are stored and analyzed. Track your improvement over time with detailed analytics.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Session history */}
          <div
            className={`lg:col-span-1 bg-card rounded-2xl p-6 shadow-lg border border-border ${
              isInView ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Sessions
            </h3>
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-foreground">{session.date}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {session.duration} • {session.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`w-4 h-4 ${session.confidence >= 75 ? "text-green-500" : session.confidence >= 60 ? "text-yellow-500" : "text-red-500"}`}
                    />
                    <span className="font-semibold text-foreground">{session.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`bg-card rounded-2xl p-6 shadow-lg border border-border ${
                isInView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Confidence Over Time</h3>
              <ConfidenceChart animate={isInView} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div
                className={`bg-card rounded-2xl p-6 shadow-lg border border-border ${
                  isInView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Eye Contact %</h3>
                <EyeContactChart animate={isInView} />
              </div>
              <div
                className={`bg-card rounded-2xl p-6 shadow-lg border border-border ${
                  isInView ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: "0.3s" }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Overall Performance</h3>
                <PerformanceChart animate={isInView} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
