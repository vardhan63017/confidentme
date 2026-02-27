"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FileText, MessageSquare, Upload, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InterviewTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InterviewTypeModal({ open, onOpenChange }: InterviewTypeModalProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"general" | "resume" | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGeneralInterview = () => {
    onOpenChange(false)
    router.push("/interview")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      setResumeFile(file)
      setError(null)
    }
  }

  const handleResumeInterview = async () => {
    if (!resumeFile) {
      setError("Please upload your resume first")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze resume")
      }

      const data = await response.json()

      // Store questions in sessionStorage for the interview page
      sessionStorage.setItem("interviewQuestions", JSON.stringify(data.questions))
      sessionStorage.setItem("interviewType", "resume")
      sessionStorage.setItem("resumeSummary", data.summary || "")

      setIsAnalyzing(false)
      onOpenChange(false)
      router.push("/interview?type=resume")
    } catch (err) {
      setError("Failed to analyze resume. Please try again.")
      setIsUploading(false)
    }
  }

  const resetModal = () => {
    setSelectedType(null)
    setResumeFile(null)
    setIsUploading(false)
    setIsAnalyzing(false)
    setError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetModal()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="w-[90vw] max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl bg-card">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-center text-foreground">Choose Interview Type</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Select how you'd like to practice your interview skills
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4 space-y-4">
          {!selectedType ? (
            <>
              {/* General Interview Option */}
              <button
                onClick={() => setSelectedType("general")}
                className="w-full p-5 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <MessageSquare className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground text-lg block">General Interview</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Practice with common interview questions for any role
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>

              {/* Resume-Based Interview Option */}
              <button
                onClick={() => setSelectedType("resume")}
                className="w-full p-5 rounded-xl border-2 border-border bg-card hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <FileText className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-foreground text-lg block">Resume-Based Interview</span>
                    <p className="text-sm text-muted-foreground mt-1">Upload your resume for personalized questions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </button>
            </>
          ) : selectedType === "general" ? (
            // General Interview Confirmation
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">General Interview Practice</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  You'll be asked common interview questions to help you prepare for any job interview.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedType(null)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleGeneralInterview} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  Start Interview
                </Button>
              </div>
            </div>
          ) : (
            // Resume Upload Section
            <div className="space-y-5">
              <button
                onClick={() => setSelectedType(null)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                ← Back to options
              </button>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload Your Resume</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  We'll analyze your resume and generate personalized interview questions
                </p>
              </div>

              {/* Upload Area */}
              <label
                className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  resumeFile ? "border-green-500 bg-green-500/5" : "border-border hover:border-accent hover:bg-accent/5"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                {resumeFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                    <p className="text-foreground font-medium">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                    <p className="text-foreground font-medium">Click to upload PDF</p>
                    <p className="text-sm text-muted-foreground">Max file size: 5MB</p>
                  </div>
                )}
              </label>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                onClick={handleResumeInterview}
                disabled={!resumeFile || isUploading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Start Resume Interview
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
