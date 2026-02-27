"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Video, VideoOff, Mic, MicOff, Sparkles, ArrowLeft, FileText, Save, CheckCircle, History } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Volume2, Play, Square } from "lucide-react" // Import missing icons
import { AnalysisPanel } from "@/components/analysis-panel" // Import missing component

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

type ExpressionState = "confident" | "moderate" | "nervous"

interface AnalysisResult {
  transcription: string
  grammarMistakes: { original: string; suggestion: string; reason: string }[]
  wordSuggestions: { original: string; better: string; reason: string }[]
  fillerWords: { word: string; count: number }[]
  overallScore: number
  tips: string[]
}

const grammarRules = [
  {
    pattern: /\bi am\b/gi,
    check: (match: string, context: string) =>
      context.includes("I am")
        ? null
        : { original: match, suggestion: "I am", reason: "Always capitalize 'I' when referring to yourself" },
  },
  {
    pattern: /\b(he|she|it)\s+(have)\b/gi,
    suggestion: "has",
    reason: "Third person singular requires 'has' instead of 'have'",
  },
  { pattern: /\b(i|we|they|you)\s+(has)\b/gi, suggestion: "have", reason: "Use 'have' with I, we, they, and you" },
  {
    pattern: /\b(is|are|was|were)\s+went\b/gi,
    suggestion: "gone",
    reason: "Use 'gone' with helping verbs (is/are/was/were)",
  },
  {
    pattern: /\btheir\s+(is|are|was|were)\b/gi,
    suggestion: "there",
    reason: "'There' is used to indicate location or existence, not 'their'",
  },
  { pattern: /\byour\s+welcome\b/gi, suggestion: "you're welcome", reason: "'You're' is the contraction of 'you are'" },
  { pattern: /\bcould of\b/gi, suggestion: "could have", reason: "Use 'could have' not 'could of'" },
  { pattern: /\bshould of\b/gi, suggestion: "should have", reason: "Use 'should have' not 'should of'" },
  { pattern: /\bwould of\b/gi, suggestion: "would have", reason: "Use 'would have' not 'would of'" },
  { pattern: /\balot\b/gi, suggestion: "a lot", reason: "'A lot' is two words" },
  {
    pattern: /\bme and\s+\w+\b/gi,
    suggestion: "[Name] and I",
    reason: "Place yourself last and use 'I' as the subject",
  },
  { pattern: /\bdefinately\b/gi, suggestion: "definitely", reason: "Correct spelling is 'definitely'" },
  { pattern: /\boccured\b/gi, suggestion: "occurred", reason: "Correct spelling is 'occurred' (double 'r')" },
  { pattern: /\brecieve\b/gi, suggestion: "receive", reason: "Remember: 'i' before 'e' except after 'c'" },
  { pattern: /\bseperate\b/gi, suggestion: "separate", reason: "Correct spelling is 'separate'" },
  { pattern: /\buntil\s+such\s+time\s+as\b/gi, suggestion: "until", reason: "Simplify to just 'until'" },
  { pattern: /\bin\s+order\s+to\b/gi, suggestion: "to", reason: "Simplify 'in order to' to just 'to'" },
  { pattern: /\bat\s+this\s+point\s+in\s+time\b/gi, suggestion: "now", reason: "Simplify to 'now' or 'currently'" },
  { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, suggestion: "because", reason: "Simplify to 'because'" },
  { pattern: /\bhas\s+got\b/gi, suggestion: "has", reason: "'Has' alone is sufficient" },
  {
    pattern: /\bi\s+(has|goes|does|wants|needs|likes|thinks)\b/gi,
    suggestion: (match: string) =>
      match
        .replace(/has/i, "have")
        .replace(/goes/i, "go")
        .replace(/does/i, "do")
        .replace(/wants/i, "want")
        .replace(/needs/i, "need")
        .replace(/likes/i, "like")
        .replace(/thinks/i, "think"),
    reason: "First person 'I' takes base verb form without 's'",
  },
  {
    pattern: /\b(strengths?|skills?)\s+includes?\b/gi,
    suggestion: "include",
    reason: "Plural subjects take 'include' not 'includes'",
  },
  {
    pattern: /\blooking\s+forward\s+to\s+(meet|work|discuss|hear|see|speak|talk)\b/gi,
    suggestion: (match: string) => match + "ing",
    reason: "After 'looking forward to', use the gerund form (-ing)",
  },
]

const wordImprovements = [
  { words: ["good", "nice"], better: "excellent", reason: "More impactful and professional" },
  { words: ["bad"], better: "challenging", reason: "Frames negatives more positively" },
  { words: ["stuff", "things"], better: "aspects/elements/responsibilities", reason: "More specific and professional" },
  { words: ["very"], better: "extremely/highly/remarkably", reason: "Stronger emphasis without overuse" },
  { words: ["got"], better: "obtained/received/acquired", reason: "More formal vocabulary" },
  { words: ["a lot"], better: "significantly/considerably", reason: "More professional phrasing" },
  { words: ["helped"], better: "assisted/contributed to/facilitated", reason: "Action verbs show initiative" },
  { words: ["worked on"], better: "developed/delivered/implemented", reason: "Action verbs demonstrate ownership" },
  { words: ["big"], better: "significant/substantial/major", reason: "More professional descriptor" },
  { words: ["hard"], better: "challenging/demanding/rigorous", reason: "More sophisticated vocabulary" },
  { words: ["think"], better: "believe/consider/am confident that", reason: "Shows more conviction" },
  { words: ["pretty good"], better: "proficient/accomplished", reason: "More confident and specific" },
  { words: ["team player"], better: "collaborative professional", reason: "Less cliched, more specific" },
  { words: ["problem solver"], better: "analytical thinker", reason: "More unique and descriptive" },
  { words: ["self-starter"], better: "proactive/initiative-driven", reason: "Less overused" },
  { words: ["passionate"], better: "dedicated/committed/driven", reason: "Less overused in interviews" },
  { words: ["basically"], better: "(remove or be specific)", reason: "Filler word that weakens statements" },
  { words: ["honestly"], better: "(remove)", reason: "Implies other statements may not be honest" },
  { words: ["um", "uh", "like", "you know"], better: "(pause instead)", reason: "Filler words reduce credibility" },
]

const fillerWordsList = [
  "um",
  "uh",
  "like",
  "you know",
  "basically",
  "actually",
  "literally",
  "so",
  "well",
  "I mean",
  "kind of",
  "sort of",
  "right",
  "okay",
]

const defaultQuestions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths?",
  "Why do you want to work for this company?",
  "Describe a challenging situation you faced and how you handled it.",
  "Where do you see yourself in 5 years?",
]

export function MockInterviewSession() {
  const searchParams = useSearchParams()
  const interviewTypeParam = searchParams.get("type")
  const router = useRouter()
  const { user, addSession } = useAuth()

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const expressionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [expressionState, setExpressionState] = useState<ExpressionState>("moderate")
  const [expressionHistory, setExpressionHistory] = useState<ExpressionState[]>([])
  const [interviewType, setInterviewType] = useState<"general" | "resume">("general")
  const [resumeSummary, setResumeSummary] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>(defaultQuestions)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (interviewTypeParam === "resume") {
      setInterviewType("resume")
      const storedQuestions = sessionStorage.getItem("interviewQuestions")
      const storedSummary = sessionStorage.getItem("resumeSummary")

      if (storedQuestions) {
        try {
          const parsed = JSON.parse(storedQuestions)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed)
          }
        } catch (e) {
          console.log("Failed to parse questions")
        }
      }

      if (storedSummary) {
        setResumeSummary(storedSummary)
      }
    }
  }, [interviewTypeParam])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = ""
          let final = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript + " "
            } else {
              interim += transcript
            }
          }

          if (final) {
            setLiveTranscript((prev) => prev + final)
          }
          setInterimTranscript(interim)
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log("Speech recognition error:", event.error)
          if (event.error === "not-allowed") {
            setSpeechSupported(false)
          }
        }

        recognitionRef.current = recognition
      } else {
        setSpeechSupported(false)
      }
    }
  }, [])

  const simulateExpressionAnalysis = useCallback(() => {
    const states: ExpressionState[] = ["confident", "moderate", "nervous"]
    const weights = [0.5, 0.35, 0.15]
    const random = Math.random()
    let cumulative = 0
    let newState: ExpressionState = "moderate"

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) {
        newState = states[i]
        break
      }
    }

    setExpressionState(newState)
    setExpressionHistory((prev) => [...prev.slice(-29), newState])
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: true,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      streamRef.current = stream
      setIsCameraOn(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Please allow camera access to use this feature.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraOn(false)
    stopRecording()
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
      }
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return

    audioChunksRef.current = []
    setLiveTranscript("")
    setInterimTranscript("")

    const mediaRecorder = new MediaRecorder(streamRef.current)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.start(1000)
    mediaRecorderRef.current = mediaRecorder
    setIsRecording(true)
    setRecordingTime(0)
    setAnalysisResult(null)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.log("Recognition already started")
      }
    }

    expressionIntervalRef.current = setInterval(simulateExpressionAnalysis, 2000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.log("Recognition already stopped")
      }
    }

    if (expressionIntervalRef.current) {
      clearInterval(expressionIntervalRef.current)
      expressionIntervalRef.current = null
    }
  }

  const analyzeRecording = async () => {
    setIsAnalyzing(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const transcript =
      liveTranscript.trim() || "No speech detected. Please try recording again and speak clearly into your microphone."

    const grammarMistakes: { original: string; suggestion: string; reason: string }[] = []

    grammarRules.forEach((rule) => {
      const matches = transcript.match(rule.pattern)
      if (matches) {
        matches.forEach((match) => {
          const suggestion = typeof rule.suggestion === "function" ? rule.suggestion(match) : rule.suggestion

          if (suggestion && !grammarMistakes.find((m) => m.original.toLowerCase() === match.toLowerCase())) {
            grammarMistakes.push({
              original: match,
              suggestion: suggestion,
              reason: rule.reason,
            })
          }
        })
      }
    })

    const wordSuggestions: { original: string; better: string; reason: string }[] = []
    const lowerTranscript = transcript.toLowerCase()

    wordImprovements.forEach((improvement) => {
      improvement.words.forEach((word) => {
        if (lowerTranscript.includes(word.toLowerCase())) {
          if (!wordSuggestions.find((s) => s.original.toLowerCase() === word.toLowerCase())) {
            wordSuggestions.push({
              original: word,
              better: improvement.better,
              reason: improvement.reason,
            })
          }
        }
      })
    })

    const fillerWords: { word: string; count: number }[] = []
    fillerWordsList.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, "gi")
      const matches = transcript.match(regex)
      if (matches && matches.length > 0) {
        fillerWords.push({ word: filler, count: matches.length })
      }
    })

    const baseScore = calculateOverallScore()
    const grammarPenalty = grammarMistakes.length * 3
    const fillerPenalty = fillerWords.reduce((sum, f) => sum + f.count, 0) * 2
    const overallScore = Math.max(40, Math.min(100, baseScore - grammarPenalty - fillerPenalty))

    const tips: string[] = []

    if (grammarMistakes.length > 0) {
      tips.push(`Review the ${grammarMistakes.length} grammar correction(s) and practice using correct forms`)
    }
    if (fillerWords.length > 0) {
      tips.push(`Reduce filler words like "${fillerWords[0].word}" - try pausing silently instead`)
    }
    if (wordSuggestions.length > 0) {
      tips.push("Use more professional vocabulary to strengthen your responses")
    }
    if (expressionHistory.filter((e) => e === "nervous").length > expressionHistory.length * 0.3) {
      tips.push("Practice deep breathing before interviews to reduce visible nervousness")
    }
    if (expressionHistory.filter((e) => e === "confident").length > expressionHistory.length * 0.6) {
      tips.push("Great confidence level! Keep maintaining eye contact with the camera")
    }
    tips.push("Structure your answers using the STAR method (Situation, Task, Action, Result)")

    const result: AnalysisResult = {
      transcription: transcript,
      grammarMistakes,
      wordSuggestions,
      fillerWords,
      overallScore,
      tips: tips.slice(0, 5),
    }

    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  const calculateOverallScore = (): number => {
    if (expressionHistory.length === 0) return 75

    const scores = { confident: 100, moderate: 70, nervous: 40 }
    const total = expressionHistory.reduce((sum, state) => sum + scores[state], 0)
    return Math.round(total / expressionHistory.length)
  }

  const getExpressionColor = (state: ExpressionState) => {
    switch (state) {
      case "confident":
        return "rgb(34, 197, 94)"
      case "moderate":
        return "rgb(234, 179, 8)"
      case "nervous":
        return "rgb(239, 68, 68)"
    }
  }

  const getExpressionLabel = (state: ExpressionState) => {
    switch (state) {
      case "confident":
        return "Confident"
      case "moderate":
        return "Moderate"
      case "nervous":
        return "Nervous"
    }
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
  }

  const saveSessionToDatabase = async () => {
    if (!user || !analysisResult) return

    setIsSaving(true)
    try {
      const confidenceScore =
        expressionHistory.length > 0
          ? Math.round((expressionHistory.filter((e) => e === "confident").length / expressionHistory.length) * 100)
          : 50

      const eyeContactScore =
        expressionHistory.length > 0
          ? Math.round((expressionHistory.filter((e) => e !== "nervous").length / expressionHistory.length) * 100)
          : 50

      const voiceToneScore = analysisResult.overallScore

      const lipMovementScore =
        expressionHistory.length > 0
          ? Math.round(
              (expressionHistory.filter((e) => e === "confident").length * 100 +
                expressionHistory.filter((e) => e === "moderate").length * 70 +
                expressionHistory.filter((e) => e === "nervous").length * 40) /
                expressionHistory.length,
            )
          : 50

      const grammarErrors = analysisResult.grammarMistakes.length
      const fillerWords = analysisResult.fillerWords.reduce((sum, f) => sum + f.count, 0)
      const wordImprovements = analysisResult.wordSuggestions.length

      await addSession({
        date: new Date(),
        duration: recordingTime,
        confidenceScore,
        eyeContactScore,
        voiceToneScore,
        lipMovementScore,
        grammarErrors,
        fillerWords,
        wordImprovements,
        expressionTimeline: expressionHistory,
        transcript: analysisResult.transcription,
        type: interviewType === "resume" ? "behavioral" : "general",
      })

      setIsSaved(true)
    } catch (error) {
      console.error("Error saving session:", error)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    return () => {
      stopCamera()
      if (expressionIntervalRef.current) {
        clearInterval(expressionIntervalRef.current)
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const [speechSupported, setSpeechSupported] = useState(true)

  return (
    <div className="min-h-screen bg-secondary p-4 lg:p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Logo />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {interviewType === "resume" && (
          <Card className="bg-gradient-to-r from-accent/20 to-accent/5 border-accent/30 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">Resume-Based Interview</span>
                  <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">Personalized</span>
                </div>
                {resumeSummary && <p className="text-white/70 text-sm mt-1">{resumeSummary}</p>}
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="bg-white/10 border-white/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary text-sm font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={nextQuestion}
                  className="text-white hover:text-primary hover:bg-white/10"
                >
                  Next Question
                </Button>
              </div>
              <p className="text-white text-lg font-medium">{questions[currentQuestion]}</p>
            </Card>

            <Card className="bg-black/50 border-white/20 overflow-hidden relative aspect-video">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/90">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                      <Video className="w-10 h-10 text-white/50" />
                    </div>
                    <p className="text-white/70">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}

              {isCameraOn && (
                <div
                  className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 transition-all duration-500 flex items-center justify-center"
                  style={{
                    borderColor: getExpressionColor(expressionState),
                    boxShadow: `0 0 20px ${getExpressionColor(expressionState)}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full transition-all duration-500"
                    style={{ backgroundColor: getExpressionColor(expressionState) }}
                  />
                </div>
              )}

              {isCameraOn && (
                <div
                  className="absolute top-4 left-24 px-3 py-1 rounded-full text-sm font-medium text-white transition-all duration-500"
                  style={{ backgroundColor: getExpressionColor(expressionState) }}
                >
                  {getExpressionLabel(expressionState)}
                </div>
              )}

              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
                </div>
              )}

              {isCameraOn && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  {streamRef.current?.getAudioTracks()[0]?.enabled ? (
                    <div className="flex items-center gap-2 bg-green-500/80 px-3 py-1 rounded-full">
                      <Volume2 className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">Audio Recording</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full">
                      <MicOff className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">Muted</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="bg-white/10 border-white/20 p-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isCameraOn ? (
                  <Button onClick={startCamera} className="bg-primary hover:bg-primary/90 text-white">
                    <Video className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="destructive">
                      <VideoOff className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                    <Button
                      onClick={toggleMic}
                      variant={streamRef.current?.getAudioTracks()[0]?.enabled ? "secondary" : "outline"}
                      className={
                        !streamRef.current?.getAudioTracks()[0]?.enabled
                          ? "border-white/30 text-white hover:bg-white/10"
                          : ""
                      }
                    >
                      {streamRef.current?.getAudioTracks()[0]?.enabled ? (
                        <Mic className="w-4 h-4 mr-2" />
                      ) : (
                        <MicOff className="w-4 h-4 mr-2" />
                      )}
                      {streamRef.current?.getAudioTracks()[0]?.enabled ? "Mute" : "Unmute"}
                    </Button>
                    {!isRecording ? (
                      <Button onClick={startRecording} className="bg-green-500 hover:bg-green-600 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </>
                )}
              </div>
              {!speechSupported && (
                <p className="text-yellow-400 text-xs text-center mt-2">
                  Speech recognition not supported in this browser. Try Chrome for best results.
                </p>
              )}
            </Card>

            {isRecording && (
              <Card className="bg-white/10 border-white/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="text-white font-medium">Live Transcription</h3>
                </div>
                <div className="min-h-[60px] max-h-[120px] overflow-y-auto">
                  <p className="text-white/80 text-sm">
                    {liveTranscript}
                    <span className="text-white/50 italic">{interimTranscript}</span>
                    {!liveTranscript && !interimTranscript && (
                      <span className="text-white/50">Speak now... your words will appear here</span>
                    )}
                  </p>
                </div>
              </Card>
            )}

            {expressionHistory.length > 0 && (
              <Card className="bg-white/10 border-white/20 p-4">
                <h3 className="text-white font-medium mb-3">Expression Timeline</h3>
                <div className="flex gap-1 flex-wrap">
                  {expressionHistory.map((state, index) => (
                    <div
                      key={index}
                      className="w-3 h-8 rounded-sm transition-all duration-300"
                      style={{ backgroundColor: getExpressionColor(state) }}
                      title={getExpressionLabel(state)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-white/70">Confident</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-white/70">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-white/70">Nervous</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {!isRecording && (liveTranscript || expressionHistory.length > 0) && !analysisResult && (
              <Button
                onClick={analyzeRecording}
                disabled={isAnalyzing}
                className="w-full bg-accent hover:bg-accent/90 text-white py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing your response...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Analyzing
                  </>
                )}
              </Button>
            )}

            {analysisResult && (
              <>
                <AnalysisPanel result={analysisResult} />
                {user && (
                  <Card className="bg-white/10 border-white/20 p-4">
                    <div className="space-y-3">
                      {!isSaved ? (
                        <Button
                          onClick={saveSessionToDatabase}
                          disabled={isSaving}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Saving your progress...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5 mr-2" />
                              Save Session to History
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Session saved successfully!</span>
                          </div>
                          <Button
                            onClick={() => router.push("/history")}
                            className="w-full bg-accent hover:bg-accent/90 text-white py-4"
                          >
                            <History className="w-5 h-5 mr-2" />
                            View Your History & Progress
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {!user && (
                  <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 p-4">
                    <div className="text-center space-y-3">
                      <p className="text-white/80">Want to save your progress and track improvement over time?</p>
                      <Button onClick={() => router.push("/login")} className="bg-accent hover:bg-accent/90 text-white">
                        Login to Save History
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {isRecording && (
              <Card className="bg-white/10 border-white/20 p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Real-time Tips
                </h3>
                <div className="space-y-2">
                  <RealTimeTip expressionState={expressionState} />
                </div>
              </Card>
            )}

            {!analysisResult && !isRecording && (
              <Card className="bg-white/10 border-white/20 p-6">
                <h3 className="text-white font-medium mb-4">How to use</h3>
                <ol className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0">
                      1
                    </span>
                    <span>Click "Start Camera" to enable your webcam</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0">
                      2
                    </span>
                    <span>Click "Start Recording" to begin your practice session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0">
                      3
                    </span>
                    <span>Answer the interview question - your speech will be transcribed live</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0">
                      4
                    </span>
                    <span>
                      Click "Stop Recording" and then "Start Analyzing" for grammar corrections and word improvements
                    </span>
                  </li>
                </ol>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RealTimeTip({ expressionState }: { expressionState: ExpressionState }) {
  const [tipIndex, setTipIndex] = useState(0)

  const tips = {
    confident: [
      "Great job! Your confidence is showing through.",
      "Excellent eye contact - keep it up!",
      "Your posture looks professional.",
    ],
    moderate: [
      "Try to maintain more consistent eye contact.",
      "Take a deep breath and relax your shoulders.",
      "Speak a bit more slowly for clarity.",
    ],
    nervous: [
      "It's okay to pause and collect your thoughts.",
      "Try to look directly at the camera.",
      "Remember to breathe deeply.",
    ],
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips[expressionState].length)
    }, 5000)
    return () => clearInterval(interval)
  }, [expressionState])

  const currentTips = tips[expressionState]

  return (
    <div
      className={`p-3 rounded-lg transition-all duration-300 ${
        expressionState === "confident"
          ? "bg-green-500/20 border border-green-500/30"
          : expressionState === "moderate"
            ? "bg-yellow-500/20 border border-yellow-500/30"
            : "bg-red-500/20 border border-red-500/30"
      }`}
    >
      <p className="text-white text-sm">{currentTips[tipIndex]}</p>
    </div>
  )
}
