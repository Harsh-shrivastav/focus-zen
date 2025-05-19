"use client"

import { useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"
import type { Stats } from "../types/timer"

export function useStats() {
  const [stats, setStats] = useLocalStorage<Stats>("focuszen-stats", {
    completedSessions: 0,
    dailyAverage: 0,
    startDate: new Date().toISOString(),
    dailyHistory: {},
  })

  // Add a completed session to stats
  const addCompletedSession = () => {
    const today = new Date().toISOString().split("T")[0]

    setStats((prevStats) => {
      // Update daily history
      const dailyHistory = { ...prevStats.dailyHistory }
      dailyHistory[today] = (dailyHistory[today] || 0) + 1

      // Calculate days since start
      const startDate = new Date(prevStats.startDate)
      const currentDate = new Date()
      const daysSinceStart = Math.max(
        1,
        Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      )

      // Calculate daily average
      const totalSessions = prevStats.completedSessions + 1
      const dailyAverage = totalSessions / daysSinceStart

      return {
        completedSessions: totalSessions,
        dailyAverage,
        startDate: prevStats.startDate,
        dailyHistory,
      }
    })
  }

  // Initialize start date if it's the first time
  useEffect(() => {
    if (!stats.startDate) {
      setStats((prevStats) => ({
        ...prevStats,
        startDate: new Date().toISOString(),
      }))
    }
  }, [stats.startDate, setStats])

  return {
    stats,
    addCompletedSession,
  }
}
