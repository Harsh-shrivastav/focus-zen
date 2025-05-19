"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { TimerState } from "../types/timer"

export function useTimer(initialDuration: number) {
  const [duration, setDuration] = useState(initialDuration)
  const [timeRemaining, setTimeRemaining] = useState(initialDuration)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const timerRef = useRef<number | null>(null)
  const lastTickRef = useRef<number | null>(null)

  // Calculate progress (0 to 1)
  const progress = 1 - timeRemaining / duration

  // Start the timer
  const startTimer = useCallback(() => {
    if (timerState === "running") return

    setTimerState("running")
    lastTickRef.current = Date.now()

    timerRef.current = window.setInterval(() => {
      const now = Date.now()
      const elapsed = now - (lastTickRef.current || now)
      lastTickRef.current = now

      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - elapsed)

        if (newTime === 0) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          setTimerState("completed")
        }

        return newTime
      })
    }, 100) // Update more frequently for smoother animation
  }, [timerState])

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTimerState("paused")
  }, [])

  // Reset the timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTimeRemaining(duration)
    setTimerState("idle")
  }, [duration])

  // Update timeRemaining when duration changes
  useEffect(() => {
    if (timerState === "idle") {
      setTimeRemaining(duration)
    }
  }, [duration, timerState])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return {
    timeRemaining,
    progress,
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  }
}
