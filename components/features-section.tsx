"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Video, Activity, Eye, MessageSquare, FileText, Carrot as Mirror } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "AI Mock Interview",
    description:
      "Practice with our AI interviewer using your camera and microphone. Get realistic interview scenarios tailored to your industry.",
    color: "bg-primary",
  },
  {
    icon: Activity,
    title: "Live Confidence Meter",
    description:
      "Real-time analysis of your facial expressions and body language with an intuitive confidence gauge that tracks your performance.",
    color: "bg-accent",
  },
  {
    icon: Eye,
    title: "Eye Contact & Voice Tracking",
    description:
      "Monitor your eye contact patterns and voice tone throughout the interview. Receive instant feedback on areas to improve.",
    color: "bg-secondary",
  },
  {
    icon: MessageSquare,
    title: "Personalized AI Feedback",
    description:
      "Get detailed feedback and actionable tips after each session. Our AI identifies patterns and suggests improvements.",
    color: "bg-primary",
  },
  {
    icon: FileText,
    title: "Resume-Based Questions",
    description:
      "Upload your resume and receive customized interview questions based on your experience, skills, and target role.",
    color: "bg-accent",
  },
  {
    icon: Mirror,
    title: "Interview Mirror Mode",
    description:
      "Practice in mirror mode to see yourself as the interviewer sees you. Perfect your posture, gestures, and expressions.",
    color: "bg-secondary",
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)

  return (
    <section id="features" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-light text-accent font-medium text-sm mb-6">
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-4 text-balance">
            Everything you need to <span className="text-primary">ace your interview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to analyze, practice, and improve your interview
            skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl border border-border transition-all duration-300 hover:-translate-y-2 ${
                isInView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
