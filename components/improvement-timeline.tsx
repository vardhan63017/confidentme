"use client"

import { CheckCircle, ArrowUp } from "lucide-react"

const milestones = [
  { date: "Week 1", achievement: "First session completed", improvement: "Baseline established" },
  { date: "Week 2", achievement: "Eye contact improved by 15%", improvement: "+15% eye contact" },
  { date: "Week 3", achievement: "Reduced filler words by 40%", improvement: "-40% fillers" },
  { date: "Week 4", achievement: "Reached 80% confidence score", improvement: "+25% confidence" },
]

export function ImprovementTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative pl-12">
            <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">{milestone.date}</div>
              <div className="font-medium text-foreground">{milestone.achievement}</div>
              <div className="text-sm text-primary flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3" />
                {milestone.improvement}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
