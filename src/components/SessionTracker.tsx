"use client"

import { motion } from "framer-motion"
import type { TimerPhase } from "../types/timer"

interface SessionTrackerProps {
  currentPhase: TimerPhase
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
}

export default function SessionTracker({
  currentPhase,
  workDuration,
  shortBreakDuration,
  longBreakDuration,
}: SessionTrackerProps) {
  // Define the sequence: work -> short break -> work -> short break -> work -> short break -> work -> long break
  const sequence = ["work", "shortBreak", "work", "shortBreak", "work", "shortBreak", "work", "longBreak"]

  // Find the current position in the sequence
  const currentIndex = sequence.findIndex((phase) => phase === currentPhase)

  // Calculate total duration in minutes
  const calculateTotalDuration = () => {
    const workMinutes = workDuration / 60000
    const shortBreakMinutes = shortBreakDuration / 60000
    const longBreakMinutes = longBreakDuration / 60000

    return workMinutes * 4 + shortBreakMinutes * 3 + longBreakMinutes
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Session Progress</h3>
        <span className="text-xs opacity-70">
          {Math.floor(currentIndex / 2) + 1}/4 Pomodoros • {calculateTotalDuration()} min total
        </span>
      </div>

      <div className="flex gap-1 w-full">
        {sequence.map((phase, index) => (
          <div key={index} className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {index === currentIndex ? (
              <motion.div
                className={`h-full ${
                  phase === "work" ? "bg-rose-500" : phase === "shortBreak" ? "bg-emerald-500" : "bg-blue-500"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            ) : index < currentIndex ? (
              <div
                className={`h-full w-full ${
                  phase === "work" ? "bg-rose-500" : phase === "shortBreak" ? "bg-emerald-500" : "bg-blue-500"
                }`}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
