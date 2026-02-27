"use client"

import { useState, useMemo } from "react"
import { useAuth, type InterviewSession } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Eye,
  Mic,
  AlertTriangle,
  ChevronRight,
  Play,
  Activity,
  Lightbulb,
  MessageSquare,
  Hand,
  Volume2,
  BookOpen,
  Smile,
  Mail,
  CalendarDays,
  Award,
  Zap,
  BarChart3,
  Trophy,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const newUserTips = [
  {
    icon: Eye,
    title: "Eye Contact",
    description: "Maintain consistent eye contact with the camera to appear confident and engaged.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Target,
    title: "Confidence",
    description: "Speak clearly and at a steady pace. Avoid rushing through your answers.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Hand,
    title: "Body Language",
    description: "Use natural hand gestures and maintain good posture throughout the interview.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Volume2,
    title: "Voice Tone",
    description: "Vary your tone to keep the interviewer engaged. Avoid monotone responses.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    icon: MessageSquare,
    title: "Filler Words",
    description: "Minimize 'um', 'uh', 'like', and other filler words. Pause instead if needed.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: BookOpen,
    title: "Grammar",
    description: "Use proper grammar and complete sentences. Practice articulating complex ideas.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
]

// Default zero data for new users with attractive graphs
const zeroRadarData = [
  { skill: "Confidence", value: 0, fullMark: 100 },
  { skill: "Eye Contact", value: 0, fullMark: 100 },
  { skill: "Voice Tone", value: 0, fullMark: 100 },
  { skill: "Lip Movement", value: 0, fullMark: 100 },
  { skill: "Grammar", value: 0, fullMark: 100 },
  { skill: "Fluency", value: 0, fullMark: 100 },
]

const zeroProgressData = [
  { name: "Confidence", value: 0, fill: "#22c55e" },
  { name: "Eye Contact", value: 0, fill: "#3b82f6" },
  { name: "Voice Tone", value: 0, fill: "#f97316" },
  { name: "Lip Movement", value: 0, fill: "#a855f7" },
]

export function HistoryDashboard() {
  const { user, sessions } = useAuth()
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null)

  // Calculate stats
  const stats = useMemo(() => {
    if (sessions.length === 0) return null

    const totalSessions = sessions.length
    const avgConfidence = Math.round(sessions.reduce((acc, s) => acc + s.confidenceScore, 0) / totalSessions)
    const avgEyeContact = Math.round(sessions.reduce((acc, s) => acc + s.eyeContactScore, 0) / totalSessions)
    const avgVoiceTone = Math.round(sessions.reduce((acc, s) => acc + s.voiceToneScore, 0) / totalSessions)
    const avgLipMovement = Math.round(sessions.reduce((acc, s) => acc + (s.lipMovementScore || 0), 0) / totalSessions)
    const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0)
    const totalGrammarErrors = sessions.reduce((acc, s) => acc + s.grammarErrors, 0)
    const totalFillerWords = sessions.reduce((acc, s) => acc + s.fillerWords, 0)

    // Improvement calculation (first vs last session)
    const firstSession = sessions[0]
    const lastSession = sessions[sessions.length - 1]
    const confidenceImprovement = lastSession.confidenceScore - firstSession.confidenceScore
    const grammarImprovement = firstSession.grammarErrors - lastSession.grammarErrors

    return {
      totalSessions,
      avgConfidence,
      avgEyeContact,
      avgVoiceTone,
      avgLipMovement,
      totalTime,
      totalGrammarErrors,
      totalFillerWords,
      confidenceImprovement,
      grammarImprovement,
    }
  }, [sessions])

  // Chart data for existing users
  const confidenceOverTime = useMemo(() => {
    return sessions.map((s, i) => ({
      session: `S${i + 1}`,
      confidence: s.confidenceScore,
      eyeContact: s.eyeContactScore,
      voiceTone: s.voiceToneScore,
      lipMovement: s.lipMovementScore || 0,
    }))
  }, [sessions])

  const mistakesOverTime = useMemo(() => {
    return sessions.map((s, i) => ({
      session: `S${i + 1}`,
      grammar: s.grammarErrors,
      filler: s.fillerWords,
    }))
  }, [sessions])

  const skillsBreakdown = useMemo(() => {
    if (!stats) return zeroProgressData
    return [
      { name: "Confidence", value: stats.avgConfidence, fill: "#22c55e" },
      { name: "Eye Contact", value: stats.avgEyeContact, fill: "#3b82f6" },
      { name: "Voice Tone", value: stats.avgVoiceTone, fill: "#f97316" },
      { name: "Lip Movement", value: stats.avgLipMovement, fill: "#a855f7" },
    ]
  }, [stats])

  const radarData = useMemo(() => {
    if (!stats) return zeroRadarData
    return [
      { skill: "Confidence", value: stats.avgConfidence, fullMark: 100 },
      { skill: "Eye Contact", value: stats.avgEyeContact, fullMark: 100 },
      { skill: "Voice Tone", value: stats.avgVoiceTone, fullMark: 100 },
      { skill: "Lip Movement", value: stats.avgLipMovement, fullMark: 100 },
      {
        skill: "Grammar",
        value: Math.max(0, 100 - (stats.totalGrammarErrors / stats.totalSessions) * 10),
        fullMark: 100,
      },
      { skill: "Fluency", value: Math.max(0, 100 - (stats.totalFillerWords / stats.totalSessions) * 5), fullMark: 100 },
    ]
  }, [stats])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins} min`
  }

  // New User View
  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary border-primary/20 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.name || "New User"}!</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      Joined{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        : "Recently"}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 max-w-xl">
                  You're all set to start practicing! Complete your first mock interview to see your performance metrics
                  and track your improvement over time.
                </p>
              </div>
              <Link href="/interview" className="flex-shrink-0">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start First Interview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid with Zero Values */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border/50 hover:border-primary/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                  <p className="text-xs text-muted-foreground mt-1">No interviews yet</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-green-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-foreground">0%</p>
                  <p className="text-xs text-muted-foreground mt-1">Start to measure</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-blue-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Eye Contact</p>
                  <p className="text-3xl font-bold text-foreground">0%</p>
                  <p className="text-xs text-muted-foreground mt-1">Start to measure</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-orange-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Voice Tone</p>
                  <p className="text-3xl font-bold text-foreground">0%</p>
                  <p className="text-xs text-muted-foreground mt-1">Start to measure</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border/50 hover:border-purple-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lip Movement</p>
                  <p className="text-3xl font-bold text-foreground">0%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smile className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-red-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Grammar Errors</p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-amber-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Filler Words</p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 hover:border-cyan-500/30 transition-all hover:shadow-md group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Practice Time</p>
                  <p className="text-3xl font-bold text-foreground">0m</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section for New Users */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart showing all zeros */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Skills Overview</CardTitle>
              </div>
              <CardDescription>Complete your first interview to see your skill breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={zeroRadarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bars showing zeros */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </div>
              <CardDescription>Track your progress across key interview skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {zeroProgressData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                  <div className="relative">
                    <Progress value={0} className="h-3" />
                    <div
                      className="absolute inset-0 h-3 rounded-full opacity-20"
                      style={{ backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="bg-card border-border/50 mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Tips for Your First Interview</CardTitle>
            </div>
            <CardDescription>Follow these tips to ace your mock interview and get the best feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newUserTips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${tip.borderColor} ${tip.bgColor} hover:scale-[1.02] transition-all cursor-default`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <tip.icon className={`w-5 h-5 ${tip.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary via-primary/90 to-accent border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2">Ready to Ace Your Interview?</h3>
                <p className="text-white/80 mb-4 max-w-xl">
                  Start your first mock interview now and get instant AI-powered feedback on your confidence,
                  communication, and presentation skills.
                </p>
                <Link href="/interview">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Begin Mock Interview
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Existing User View with Data
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Profile Header */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary border-primary/20 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, {user?.name}!</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-muted-foreground">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{stats.totalSessions} interviews completed</span>
                </div>
              </div>
            </div>
            <Link href="/interview" className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                New Interview
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:border-green-500/30 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{stats.avgConfidence}%</p>
                  {stats.confidenceImprovement > 0 ? (
                    <span className="text-xs text-green-500 flex items-center bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3 mr-0.5" />+{stats.confidenceImprovement}%
                    </span>
                  ) : stats.confidenceImprovement < 0 ? (
                    <span className="text-xs text-red-500 flex items-center bg-red-500/10 px-1.5 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {stats.confidenceImprovement}%
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:border-cyan-500/30 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Practice Time</p>
                <p className="text-3xl font-bold text-foreground">{formatTotalTime(stats.totalTime)}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:border-orange-500/30 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors Reduced</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{Math.max(0, stats.grammarImprovement)}</p>
                  {stats.grammarImprovement > 0 && (
                    <span className="text-xs text-green-500 flex items-center bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      Better
                    </span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Trend */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Performance Trend</CardTitle>
            </div>
            <CardDescription>Track your skills improvement over sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceOverTime}>
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEyeContact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVoiceTone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="session" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="confidence"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorConfidence)"
                    name="Confidence"
                  />
                  <Area
                    type="monotone"
                    dataKey="eyeContact"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorEyeContact)"
                    name="Eye Contact"
                  />
                  <Area
                    type="monotone"
                    dataKey="voiceTone"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorVoiceTone)"
                    name="Voice Tone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Skills Overview</CardTitle>
            </div>
            <CardDescription>Your average performance across all metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mistakes Chart */}
      <Card className="bg-card border-border/50 mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Errors Over Time</CardTitle>
          </div>
          <CardDescription>Track your grammar errors and filler words reduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mistakesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="grammar" fill="#ef4444" name="Grammar Errors" radius={[4, 4, 0, 0]} />
                <Bar dataKey="filler" fill="#eab308" name="Filler Words" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Session History</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {sessions.length} sessions
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...sessions].reverse().map((session, index) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session === selectedSession ? null : session)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedSession?.id === session.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${
                        session.confidenceScore >= 80
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : session.confidenceScore >= 60
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {session.confidenceScore}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground capitalize">{session.type} Interview</span>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                          #{sessions.length - index}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg">
                        <Clock className="w-4 h-4" />
                        {formatDuration(session.duration)}
                      </div>
                      <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg">
                        <Eye className="w-4 h-4" />
                        {session.eyeContactScore}%
                      </div>
                      <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-lg">
                        <Mic className="w-4 h-4" />
                        {session.voiceToneScore}%
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        selectedSession?.id === session.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSession?.id === session.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" /> Error Metrics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm p-2 bg-red-500/5 rounded-lg">
                            <span className="text-muted-foreground">Grammar Errors</span>
                            <span className="text-red-500 font-semibold">{session.grammarErrors}</span>
                          </div>
                          <div className="flex justify-between text-sm p-2 bg-amber-500/5 rounded-lg">
                            <span className="text-muted-foreground">Filler Words</span>
                            <span className="text-amber-500 font-semibold">{session.fillerWords}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" /> Performance Scores
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm p-2 bg-green-500/5 rounded-lg">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="text-green-500 font-semibold">{session.confidenceScore}%</span>
                          </div>
                          <div className="flex justify-between text-sm p-2 bg-blue-500/5 rounded-lg">
                            <span className="text-muted-foreground">Eye Contact</span>
                            <span className="text-blue-500 font-semibold">{session.eyeContactScore}%</span>
                          </div>
                          <div className="flex justify-between text-sm p-2 bg-orange-500/5 rounded-lg">
                            <span className="text-muted-foreground">Voice Tone</span>
                            <span className="text-orange-500 font-semibold">{session.voiceToneScore}%</span>
                          </div>
                          <div className="flex justify-between text-sm p-2 bg-purple-500/5 rounded-lg">
                            <span className="text-muted-foreground">Lip Movement</span>
                            <span className="text-purple-500 font-semibold">{session.lipMovementScore || 0}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Play className="w-4 h-4 text-primary" /> Actions
                        </h4>
                        <Link href="/interview">
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            <Play className="w-4 h-4 mr-2" />
                            Practice Again
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
