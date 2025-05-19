"use client"

import { useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"
import { useSettings } from "./useSettings"
import type { Stats, Session } from "@/types/stats"

const DEFAULT_STATS: Stats = {
  completedSessions: 0,
  totalFocusTime: 0,
  dailyAverage: 0,
  currentStreak: 0,
  longestStreak: 0,
  startDate: new Date().toISOString(),
  dailyHistory: {},
  recentSessions: [],
}

export function useStats() {
  const { settings } = useSettings()
  const [stats, setStats] = useLocalStorage<Stats>("focuszen-stats", DEFAULT_STATS)

  // Add a completed session to stats
  const addCompletedSession = () => {
    const today = new Date().toISOString().split("T")[0]

    setStats((prevStats) => {
      // Create new session
      const newSession: Session = {
        date: new Date().toISOString(),
        duration: settings.workDuration,
      }

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

      // Calculate streak
      let currentStreak = prevStats.currentStreak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split("T")[0]

      if (dailyHistory[today]) {
        // If already completed a session today, streak continues
        currentStreak = prevStats.currentStreak
      } else if (dailyHistory[yesterdayString]) {
        // If completed a session yesterday, streak increases
        currentStreak = prevStats.currentStreak + 1
      } else {
        // Otherwise, streak resets to 1
        currentStreak = 1
      }

      // Update longest streak if needed
      const longestStreak = Math.max(prevStats.longestStreak, currentStreak)

      // Update recent sessions (keep last 10)
      const recentSessions = [newSession, ...prevStats.recentSessions].slice(0, 10)

      return {
        completedSessions: totalSessions,
        totalFocusTime: prevStats.totalFocusTime + settings.workDuration,
        dailyAverage,
        currentStreak,
        longestStreak,
        startDate: prevStats.startDate,
        dailyHistory,
        recentSessions,
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
