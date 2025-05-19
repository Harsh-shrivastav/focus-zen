"use client"

import { useState, useEffect, useCallback } from "react"
import { useTimer } from "./useTimer"
import { useTimerSettings } from "./useTimerSettings"
import type { TimerPhase } from "../types/timer"

export function useEnhancedTimer() {
  const { workDuration, shortBreakDuration, longBreakDuration } = useTimerSettings()
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("work")
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0)

  // Determine duration based on current phase
  const getDuration = useCallback(() => {
    switch (currentPhase) {
      case "work":
        return workDuration
      case "shortBreak":
        return shortBreakDuration
      case "longBreak":
        return longBreakDuration
    }
  }, [currentPhase, workDuration, shortBreakDuration, longBreakDuration])

  const {
    timeRemaining,
    progress,
    timerState,
    startTimer: start,
    pauseTimer,
    resetTimer: reset,
    setDuration,
  } = useTimer(getDuration())

  // Update duration when phase changes
  useEffect(() => {
    setDuration(getDuration())
  }, [getDuration, setDuration])

  // Auto-transition to next phase when timer completes
  useEffect(() => {
    if (timerState === "completed") {
      if (currentPhase === "work") {
        // Increment completed work sessions
        const newCompletedSessions = completedWorkSessions + 1
        setCompletedWorkSessions(newCompletedSessions)

        // After 4 work sessions, take a long break
        if (newCompletedSessions % 4 === 0) {
          setCurrentPhase("longBreak")
        } else {
          setCurrentPhase("shortBreak")
        }
      } else {
        // After any break, go back to work
        setCurrentPhase("work")
      }
    }
  }, [timerState, currentPhase, completedWorkSessions])

  // Reset timer with new duration when phase changes
  const resetTimer = useCallback(() => {
    reset()
    setDuration(getDuration())
  }, [reset, getDuration, setDuration])

  // Start timer with current phase duration
  const startTimer = useCallback(() => {
    setDuration(getDuration())
    start()
  }, [start, getDuration, setDuration])

  // Skip to next phase
  const skipToNextPhase = useCallback(() => {
    if (currentPhase === "work") {
      const newCompletedSessions = completedWorkSessions + 1
      setCompletedWorkSessions(newCompletedSessions)

      if (newCompletedSessions % 4 === 0) {
        setCurrentPhase("longBreak")
      } else {
        setCurrentPhase("shortBreak")
      }
    } else {
      setCurrentPhase("work")
    }

    reset()
  }, [currentPhase, completedWorkSessions, reset])

  return {
    timeRemaining,
    progress,
    timerState,
    currentPhase,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNextPhase,
  }
}
