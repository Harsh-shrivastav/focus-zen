"use client"

import { motion } from "framer-motion"
import type { TimerPhase, TimerState } from "../types/timer"

interface TimerDisplayProps {
  timeRemaining: number
  progress: number
  currentPhase: TimerPhase
  timerState: TimerState
}

export default function TimerDisplay({ timeRemaining, progress, currentPhase, timerState }: TimerDisplayProps) {
  // Format time as mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate colors based on current phase
  const getColors = () => {
    switch (currentPhase) {
      case "work":
        return {
          ring: "stroke-rose-500",
          text: "text-rose-500",
          background: "bg-rose-500/10",
        }
      case "shortBreak":
        return {
          ring: "stroke-emerald-500",
          text: "text-emerald-500",
          background: "bg-emerald-500/10",
        }
      case "longBreak":
        return {
          ring: "stroke-blue-500",
          text: "text-blue-500",
          background: "bg-blue-500/10",
        }
    }
  }

  const { ring, text, background } = getColors()

  // SVG parameters
  const size = 280
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full ${background} p-8`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - progress),
            transition: { duration: 0.5 },
          }}
          className={ring}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className={`text-5xl font-bold ${text}`}
          key={timeRemaining}
          initial={{ opacity: 0.8, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(timeRemaining)}
        </motion.span>

        <span className="text-sm mt-2 capitalize opacity-80">
          {currentPhase === "work" ? "Focus" : currentPhase === "shortBreak" ? "Short Break" : "Long Break"}
        </span>

        {timerState === "paused" && <span className="text-xs mt-1 opacity-60">Paused</span>}
      </div>
    </motion.div>
  )
}
