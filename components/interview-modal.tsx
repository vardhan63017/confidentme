"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Play, LogIn, Sparkles, History } from "lucide-react"
import { InterviewTypeModal } from "./interview-type-modal"

interface InterviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InterviewModal({ open, onOpenChange }: InterviewModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"try" | "login" | null>(null)
  const [showInterviewType, setShowInterviewType] = useState(false)

  const handleTryNow = () => {
    setIsLoading("try")
    onOpenChange(false)
    setShowInterviewType(true)
  }

  const handleLoginAndContinue = () => {
    setIsLoading("login")
    onOpenChange(false)
    router.push("/login?redirect=/history")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-[450px] p-0 overflow-hidden border-0 shadow-2xl bg-card">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-center text-foreground">
                Start Your Interview Journey
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground text-sm">
                Choose how you'd like to proceed with your mock interview
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Options container */}
          <div className="p-6 pt-4 space-y-4">
            {/* Try for Now Option */}
            <button
              onClick={handleTryNow}
              disabled={isLoading !== null}
              className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-base">Try for Now</span>
                    <Sparkles className="w-4 h-4 text-primary opacity-60" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Start practicing immediately without an account
                  </p>
                </div>
              </div>
            </button>

            {/* Login and Continue Option */}
            <button
              onClick={handleLoginAndContinue}
              disabled={isLoading !== null}
              className="w-full p-4 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
                  <LogIn className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-primary-foreground text-base">Login & Continue</span>
                    <History className="w-4 h-4 text-primary-foreground opacity-60" />
                  </div>
                  <p className="text-sm text-primary-foreground/80 mt-0.5">
                    Track progress and view your interview history
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-0">
            <p className="text-sm text-center text-muted-foreground">
              New to ConfidentMe?{" "}
              <button
                onClick={() => {
                  onOpenChange(false)
                  router.push("/signup?redirect=/history")
                }}
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <InterviewTypeModal open={showInterviewType} onOpenChange={setShowInterviewType} />
    </>
  )
}
