import { Suspense } from "react"
import { MockInterviewSession } from "@/components/mock-interview-session"

export const metadata = {
  title: "Mock Interview Session | ConfidentMe",
  description: "Practice your interview skills with AI-powered real-time feedback",
}

function InterviewLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Preparing your interview session...</p>
      </div>
    </div>
  )
}

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<InterviewLoading />}>
        <MockInterviewSession />
      </Suspense>
    </main>
  )
}
