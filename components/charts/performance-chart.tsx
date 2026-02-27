"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Excellent", value: 35, color: "#1ABC9C" },
  { name: "Good", value: 40, color: "#7D5CFF" },
  { name: "Needs Work", value: 25, color: "#0B1633" },
]

export function PerformanceChart({ animate }: { animate: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setShow(true), 700)
      return () => clearTimeout(timer)
    }
  }, [animate])

  if (!show) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: "#4A5568", fontSize: "12px" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
