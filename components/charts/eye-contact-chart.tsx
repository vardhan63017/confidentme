"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { session: "S1", eyeContact: 45 },
  { session: "S2", eyeContact: 55 },
  { session: "S3", eyeContact: 62 },
  { session: "S4", eyeContact: 58 },
  { session: "S5", eyeContact: 70 },
  { session: "S6", eyeContact: 75 },
]

export function EyeContactChart({ animate }: { animate: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setShow(true), 500)
      return () => clearTimeout(timer)
    }
  }, [animate])

  if (!show) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="session" tick={{ fontSize: 11, fill: "#4A5568" }} axisLine={{ stroke: "#E2E8F0" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#4A5568" }} axisLine={{ stroke: "#E2E8F0" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="eyeContact" fill="#7D5CFF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
