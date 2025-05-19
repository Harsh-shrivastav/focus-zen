"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react"
import type { Stats } from "../types/timer"

interface StatsDashboardProps {
  stats: Stats
  workDuration: number
  setWorkDuration: (duration: number) => void
  shortBreakDuration: number
  setShortBreakDuration: (duration: number) => void
  longBreakDuration: number
  setLongBreakDuration: (duration: number) => void
}

export default function StatsDashboard({
  stats,
  workDuration,
  setWorkDuration,
  shortBreakDuration,
  setShortBreakDuration,
  longBreakDuration,
  setLongBreakDuration,
}: StatsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Convert milliseconds to minutes for display
  const msToMin = (ms: number) => ms / 60000

  // Calculate total focus time in hours and minutes
  const calculateTotalFocusTime = () => {
    const totalMinutes = stats.completedSessions * msToMin(workDuration)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)

    if (hours === 0) {
      return `${minutes} min`
    }

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="w-full border dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart2 size={18} />
          <span className="font-medium">Statistics & Settings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">{stats.completedSessions} sessions completed</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Focus Time</h4>
                  <p className="text-2xl font-bold">{calculateTotalFocusTime()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Daily Average</h4>
                  <p className="text-2xl font-bold">
                    {stats.dailyAverage > 0 ? `${stats.dailyAverage.toFixed(1)} sessions` : "N/A"}
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-3">Timer Settings (minutes)</h4>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="work-duration" className="block text-xs mb-1">
                    Work
                  </label>
                  <input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={msToMin(workDuration)}
                    onChange={(e) => setWorkDuration(Number.parseInt(e.target.value) * 60000)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="short-break-duration" className="block text-xs mb-1">
                    Short Break
                  </label>
                  <input
                    id="short-break-duration"
                    type="number"
                    min="1"
                    max="30"
                    value={msToMin(shortBreakDuration)}
                    onChange={(e) => setShortBreakDuration(Number.parseInt(e.target.value) * 60000)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="long-break-duration" className="block text-xs mb-1">
                    Long Break
                  </label>
                  <input
                    id="long-break-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={msToMin(longBreakDuration)}
                    onChange={(e) => setLongBreakDuration(Number.parseInt(e.target.value) * 60000)}
                    className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
