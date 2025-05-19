"use client"

import { motion } from "framer-motion"
import type { TimerPhase } from "@/types/timer"
import type { Settings } from "@/types/settings"

interface SessionTrackerProps {
  phase: TimerPhase
  sessionsCompleted: number
  settings: Settings
}

export default function SessionTracker({ phase, sessionsCompleted, settings }: SessionTrackerProps) {
  // Define the sequence: work -> short break -> work -> short break -> work -> short break -> work -> long break
  const sequence = ["work", "shortBreak", "work", "shortBreak", "work", "shortBreak", "work", "longBreak"]

  // Find the current position in the sequence
  const currentIndex = sequence.findIndex((p) => p === phase)

  // Calculate which pomodoro we're on (1-4)
  const currentPomodoro = Math.floor(currentIndex / 2) + 1

  // Calculate total duration in minutes
  const calculateTotalDuration = () => {
    const workMinutes = settings.workDuration / 60000
    const shortBreakMinutes = settings.shortBreakDuration / 60000
    const longBreakMinutes = settings.longBreakDuration / 60000

    return workMinutes * 4 + shortBreakMinutes * 3 + longBreakMinutes
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Session Progress</h3>
        <span className="text-xs opacity-70">
          {currentPomodoro}/4 Pomodoros • {calculateTotalDuration()} min total
        </span>
      </div>

      <div className="flex gap-1 w-full">
        {sequence.map((p, index) => (
          <div key={index} className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {index === currentIndex ? (
              <motion.div
                className={`h-full ${
                  p === "work" ? "bg-rose-500" : p === "shortBreak" ? "bg-emerald-500" : "bg-blue-500"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            ) : index < currentIndex ? (
              <div
                className={`h-full w-full ${
                  p === "work" ? "bg-rose-500" : p === "shortBreak" ? "bg-emerald-500" : "bg-blue-500"
                }`}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Total completed sessions: {sessionsCompleted}
      </div>
    </div>
  )
}
