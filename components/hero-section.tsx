"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, BarChart3 } from "lucide-react"
import { InterviewMockup } from "@/components/interview-mockup"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { InterviewModal } from "@/components/interview-modal"

export function HeroSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleStartInterview = () => {
    if (!user) {
      setShowModal(true)
    } else {
      router.push("/interview")
    }
  }

  const handleViewProgress = () => {
    if (!user) {
      router.push("/login?redirect=/history")
    } else {
      router.push("/history")
    }
  }

  return (
    <>
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light text-primary font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI-Powered Interview Coach
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary leading-tight text-balance">
                Practice Interviews. <span className="text-primary">Build Confidence.</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Master your interview skills with AI-powered feedback. Get real-time analysis of your facial
                expressions, voice tone, and body language to ace your next interview.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleStartInterview}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 text-lg px-8 py-6 animate-pulse-glow"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Mock Interview
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleViewProgress}
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all text-lg px-8 py-6 bg-transparent"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View My Progress
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">89%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">4.9</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <InterviewMockup />
            </div>
          </div>
        </div>
      </section>

      <InterviewModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
