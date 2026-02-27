"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  Mic,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  Target,
  Zap,
  BookOpen,
} from "lucide-react"
import { ConfidenceChart } from "@/components/charts/confidence-chart"
import { EyeContactChart } from "@/components/charts/eye-contact-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { MistakesBreakdown } from "@/components/charts/mistakes-breakdown"
import { SessionDetail } from "@/components/session-detail"

const sessions = [
  {
    id: 1,
    date: "Dec 1, 2025",
    confidence: 82,
    duration: "15 min",
    type: "Technical",
    eyeContact: 78,
    voiceScore: 85,
    grammarErrors: 3,
    fillerWords: 5,
    improvements: ["Better eye contact", "Clearer explanations"],
    mistakes: ["Said 'um' frequently", "Rushed through answers"],
  },
  {
    id: 2,
    date: "Nov 28, 2025",
    confidence: 76,
    duration: "20 min",
    type: "Behavioral",
    eyeContact: 72,
    voiceScore: 79,
    grammarErrors: 5,
    fillerWords: 8,
    improvements: ["Good STAR method usage", "Confident tone"],
    mistakes: ["Incomplete answers", "Poor posture detected"],
  },
  {
    id: 3,
    date: "Nov 25, 2025",
    confidence: 71,
    duration: "18 min",
    type: "Technical",
    eyeContact: 65,
    voiceScore: 74,
    grammarErrors: 7,
    fillerWords: 12,
    improvements: ["Technical accuracy improved"],
    mistakes: ["Avoided eye contact", "Monotone voice", "Grammar issues"],
  },
  {
    id: 4,
    date: "Nov 22, 2025",
    confidence: 68,
    duration: "12 min",
    type: "General",
    eyeContact: 60,
    voiceScore: 70,
    grammarErrors: 9,
    fillerWords: 15,
    improvements: ["Showed enthusiasm"],
    mistakes: ["Too many filler words", "Nervous body language", "Incomplete sentences"],
  },
  {
    id: 5,
    date: "Nov 18, 2025",
    confidence: 55,
    duration: "10 min",
    type: "Technical",
    eyeContact: 52,
    voiceScore: 60,
    grammarErrors: 12,
    fillerWords: 20,
    improvements: [],
    mistakes: ["Very nervous", "Poor eye contact", "Many grammar errors", "Excessive filler words"],
  },
]

const overallStats = {
  totalSessions: 12,
  avgConfidence: 74,
  confidenceChange: +19,
  totalPracticeTime: "3h 45m",
  mistakesReduced: 65,
  topImprovement: "Eye Contact",
  topWeakness: "Filler Words",
}

const commonMistakes = [
  { category: "Filler Words", count: 60, trend: -45, icon: MessageSquare },
  { category: "Grammar Errors", count: 36, trend: -30, icon: BookOpen },
  { category: "Poor Eye Contact", count: 28, trend: -52, icon: Eye },
  { category: "Voice Monotone", count: 15, trend: -20, icon: Mic },
]

const improvements = [
  { skill: "Eye Contact", before: 45, after: 78, change: +33 },
  { skill: "Voice Clarity", before: 55, after: 85, change: +30 },
  { skill: "Confidence", before: 50, after: 82, change: +32 },
  { skill: "Grammar", before: 60, after: 88, change: +28 },
  { skill: "Filler Words Reduced", before: 25, after: 85, change: +60 },
]

export function ProgressDashboard() {
  const [selectedSession, setSelectedSession] = useState<(typeof sessions)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/interview">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Progress Dashboard</h1>
          <p className="text-muted-foreground">
            Track your improvement, analyze mistakes, and see how far you've come.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />+{overallStats.confidenceChange}%
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{overallStats.avgConfidence}%</div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </div>

          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{overallStats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>

          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{overallStats.totalPracticeTime}</div>
            <div className="text-sm text-muted-foreground">Practice Time</div>
          </div>

          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                -{overallStats.mistakesReduced}%
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">Mistakes</div>
            <div className="text-sm text-muted-foreground">Reduced significantly</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Confidence Over Time Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Confidence Trend</h2>
              <span className="text-sm text-primary font-medium flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +32% improvement
              </span>
            </div>
            <ConfidenceChart animate={true} />
          </div>

          {/* Common Mistakes */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Common Mistakes
            </h2>
            <div className="space-y-4">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <mistake.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{mistake.category}</div>
                      <div className="text-xs text-muted-foreground">{mistake.count} occurrences</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {mistake.trend}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvements Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Improvements */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Skill Improvements
            </h2>
            <div className="space-y-5">
              {improvements.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{item.skill}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      +{item.change}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-muted-foreground/30 rounded-full"
                      style={{ width: `${item.before}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${item.after}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Before: {item.before}%</span>
                    <span className="text-xs text-primary font-medium">Now: {item.after}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes Breakdown Chart */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Mistakes Breakdown</h2>
            <MistakesBreakdown />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Eye Contact Progress</h2>
            <EyeContactChart animate={true} />
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Overall Performance</h2>
            <PerformanceChart animate={true} />
          </div>
        </div>

        {/* Session History */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Session History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Eye Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Voice</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Errors</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedSession(session)}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-foreground">{session.date}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {session.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{session.duration}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            session.confidence >= 75
                              ? "bg-green-500"
                              : session.confidence >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-foreground">{session.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">{session.eyeContact}%</td>
                    <td className="py-4 px-4 text-sm text-foreground">{session.voiceScore}%</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          {session.grammarErrors} grammar
                        </span>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          {session.fillerWords} fillers
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" className="text-primary">
                        View
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-secondary to-secondary/90 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            Personalized Recommendations
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-primary">Focus Area</h3>
              <p className="text-sm text-white/80">
                Work on reducing filler words like "um" and "uh". Try pausing instead of using fillers.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-primary">Keep Doing</h3>
              <p className="text-sm text-white/80">
                Your eye contact has improved significantly! Continue maintaining camera focus during responses.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-primary">Next Goal</h3>
              <p className="text-sm text-white/80">
                Aim for 85% confidence in your next session. Practice the STAR method for behavioral questions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Session Detail Modal */}
      {selectedSession && <SessionDetail session={selectedSession} onClose={() => setSelectedSession(null)} />}
    </div>
  )
}
