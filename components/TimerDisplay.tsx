"use client"

import { motion } from "framer-motion"
import { formatTime } from "@/lib/utils"
import type { TimerPhase } from "@/types/timer"

interface TimerDisplayProps {
  timeRemaining: number
  progress: number
  phase: TimerPhase
  isPaused: boolean
}

export default function TimerDisplay({ timeRemaining, progress, phase, isPaused }: TimerDisplayProps) {
  // Get colors based on current phase
  const getColors = () => {
    switch (phase) {
      case "work":
        return {
          ring: "stroke-rose-500",
          text: "text-rose-500",
          background: "bg-rose-50 dark:bg-rose-950/20",
        }
      case "shortBreak":
        return {
          ring: "stroke-emerald-500",
          text: "text-emerald-500",
          background: "bg-emerald-50 dark:bg-emerald-950/20",
        }
      case "longBreak":
        return {
          ring: "stroke-blue-500",
          text: "text-blue-500",
          background: "bg-blue-50 dark:bg-blue-950/20",
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
          }}
          transition={{ duration: 0.5 }}
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
          {phase === "work" ? "Focus" : phase === "shortBreak" ? "Short Break" : "Long Break"}
        </span>

        {isPaused && <span className="text-xs mt-1 opacity-60">Paused</span>}
      </div>
    </motion.div>
  )
}
