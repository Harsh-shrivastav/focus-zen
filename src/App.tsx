"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Volume2, VolumeX } from "lucide-react"
import TimerDisplay from "./components/TimerDisplay"
import TimerControls from "./components/TimerControls"
import SessionTracker from "./components/SessionTracker"
import StatsDashboard from "./components/StatsDashboard"
import StrictModeOverlay from "./components/StrictModeOverlay"
import QuoteDisplay from "./components/QuoteDisplay"
import { useEnhancedTimer } from "./hooks/useEnhancedTimer"
import { useTimerSettings } from "./hooks/useTimerSettings"
import { useAudio } from "./hooks/useAudio"
import { useStrictMode } from "./hooks/useStrictMode"
import { useTheme } from "./hooks/useTheme"
import { useStats } from "./hooks/useStats"

export default function App() {
  const [isMuted, setIsMuted] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { timerState, currentPhase, timeRemaining, progress, startTimer, pauseTimer, resetTimer, skipToNextPhase } =
    useEnhancedTimer()

  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
  } = useTimerSettings()

  const { playTickSound, playEndSound } = useAudio(isMuted)
  const { isStrictMode, toggleStrictMode, exitStrictMode } = useStrictMode()
  const { stats, addCompletedSession } = useStats()

  // Play tick sound every second when timer is running
  useEffect(() => {
    if (timerState === "running" && timeRemaining % 1000 === 0) {
      playTickSound()
    }
  }, [timeRemaining, timerState, playTickSound])

  // Play end sound and show notification when a phase completes
  useEffect(() => {
    if (timerState === "completed") {
      playEndSound()

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("FocusZen", {
          body: `${currentPhase === "work" ? "Work session" : "Break"} completed!`,
          icon: "/favicon.ico",
        })
      }

      // Track completed work sessions
      if (currentPhase === "work") {
        addCompletedSession()
      }
    }
  }, [timerState, currentPhase, playEndSound, addCompletedSession])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="fixed top-4 right-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold tracking-tight">FocusZen</h1>

        <AnimatePresence mode="wait">
          {isStrictMode && (
            <StrictModeOverlay
              exitStrictMode={exitStrictMode}
              timeRemaining={timeRemaining}
              currentPhase={currentPhase}
              progress={progress}
            />
          )}
        </AnimatePresence>

        <TimerDisplay
          timeRemaining={timeRemaining}
          progress={progress}
          currentPhase={currentPhase}
          timerState={timerState}
        />

        <QuoteDisplay currentPhase={currentPhase} timerState={timerState} />

        <TimerControls
          timerState={timerState}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          skipToNextPhase={skipToNextPhase}
          toggleStrictMode={toggleStrictMode}
          isStrictMode={isStrictMode}
        />

        <SessionTracker
          currentPhase={currentPhase}
          workDuration={workDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
        />

        <StatsDashboard
          stats={stats}
          workDuration={workDuration}
          setWorkDuration={setWorkDuration}
          shortBreakDuration={shortBreakDuration}
          setShortBreakDuration={setShortBreakDuration}
          longBreakDuration={longBreakDuration}
          setLongBreakDuration={setLongBreakDuration}
        />
      </main>
    </div>
  )
}
