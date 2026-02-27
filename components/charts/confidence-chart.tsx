"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { session: "Session 1", confidence: 45 },
  { session: "Session 2", confidence: 52 },
  { session: "Session 3", confidence: 58 },
  { session: "Session 4", confidence: 65 },
  { session: "Session 5", confidence: 71 },
  { session: "Session 6", confidence: 68 },
  { session: "Session 7", confidence: 76 },
  { session: "Session 8", confidence: 82 },
]

export function ConfidenceChart({ animate }: { animate: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setShow(true), 300)
      return () => clearTimeout(timer)
    }
  }, [animate])

  if (!show) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="session" tick={{ fontSize: 12, fill: "#4A5568" }} axisLine={{ stroke: "#E2E8F0" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#4A5568" }} axisLine={{ stroke: "#E2E8F0" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#1ABC9C"
            strokeWidth={3}
            dot={{ fill: "#1ABC9C", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#7D5CFF" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
