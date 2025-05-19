"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSettings } from "./useSettings"
import { useAudio } from "./useAudio"
import type { TimerPhase } from "@/types/timer"

export function useTimer() {
  const { settings } = useSettings()
  const { playTickSound, playAlarmSound } = useAudio()

  const [phase, setPhase] = useState<TimerPhase>("work")
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isStrictMode, setIsStrictMode] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [pomodoroCount, setPomodoroCount] = useState(0)

  const timerRef = useRef<number | null>(null)
  const lastTickRef = useRef<number | null>(null)

  // Get current duration based on phase
  const getCurrentDuration = useCallback(() => {
    switch (phase) {
      case "work":
        return settings.workDuration
      case "shortBreak":
        return settings.shortBreakDuration
      case "longBreak":
        return settings.longBreakDuration
    }
  }, [phase, settings])

  // Calculate progress (0 to 1)
  const progress = 1 - timeRemaining / getCurrentDuration()

  // Start timer
  const startTimer = useCallback(() => {
    if (isRunning && !isPaused) return

    setIsRunning(true)
    setIsPaused(false)
    lastTickRef.current = Date.now()

    timerRef.current = window.setInterval(() => {
      const now = Date.now()
      const elapsed = now - (lastTickRef.current || now)
      lastTickRef.current = now

      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - elapsed)

        // Play tick sound every second
        if (Math.floor(prev / 1000) !== Math.floor(newTime / 1000) && newTime > 0) {
          playTickSound()
        }

        // Timer completed
        if (newTime === 0) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          playAlarmSound()
          handlePhaseComplete()
        }

        return newTime
      })
    }, 100) // Update more frequently for smoother animation
  }, [isRunning, isPaused, playTickSound, playAlarmSound])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsPaused(true)
  }, [])

  // Reset timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTimeRemaining(getCurrentDuration())
    setIsRunning(false)
    setIsPaused(false)
  }, [getCurrentDuration])

  // Skip to next phase
  const skipPhase = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    handlePhaseComplete()
  }, [])

  // Handle phase completion
  const handlePhaseComplete = useCallback(() => {
    if (phase === "work") {
      // Increment completed sessions
      setSessionsCompleted((prev) => prev + 1)

      // Increment pomodoro count
      const newPomodoroCount = pomodoroCount + 1
      setPomodoroCount(newPomodoroCount)

      // After 4 work sessions, take a long break
      if (newPomodoroCount % 4 === 0) {
        setPhase("longBreak")
        setTimeRemaining(settings.longBreakDuration)
      } else {
        setPhase("shortBreak")
        setTimeRemaining(settings.shortBreakDuration)
      }

      // Auto-start breaks if enabled
      if (settings.autoStartBreaks) {
        setIsRunning(true)
        setIsPaused(false)
      } else {
        setIsRunning(false)
        setIsPaused(false)
      }
    } else {
      // After any break, go back to work
      setPhase("work")
      setTimeRemaining(settings.workDuration)

      // Auto-start pomodoros if enabled
      if (settings.autoStartPomodoros) {
        setIsRunning(true)
        setIsPaused(false)
      } else {
        setIsRunning(false)
        setIsPaused(false)
      }
    }
  }, [
    phase,
    pomodoroCount,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    settings.workDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
  ])

  // Toggle strict mode
  const toggleStrictMode = useCallback(() => {
    setIsStrictMode((prev) => !prev)
  }, [])

  // Exit strict mode
  const exitStrictMode = useCallback(() => {
    setIsStrictMode(false)
  }, [])

  // Remove this effect as it's causing an update loop
  // useEffect(() => {
  //   if (!isRunning || isPaused) {
  //     setTimeRemaining(getCurrentDuration())
  //   }
  // }, [phase, settings, isRunning, isPaused, getCurrentDuration])

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
    phase,
    isRunning,
    isPaused,
    isStrictMode,
    sessionsCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    toggleStrictMode,
    exitStrictMode,
  }
}
