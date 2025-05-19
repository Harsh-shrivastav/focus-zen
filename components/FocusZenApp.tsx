"use client"

import { useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import { useTimer } from "@/hooks/useTimer"
import { useSettings } from "@/hooks/useSettings"
import { useStats } from "@/hooks/useStats"
import { useAudio } from "@/hooks/useAudio"
import { useQuotes } from "@/hooks/useQuotes"
import { useRewards } from "@/hooks/useRewards"
import { useLocalStorage } from "@/hooks/useLocalStorage"

import TimerDisplay from "./TimerDisplay"
import TimerControls from "./TimerControls"
import SessionTracker from "./SessionTracker"
import StrictModeOverlay from "./StrictModeOverlay"
import SettingsPanel from "./SettingsPanel"
import StatsPanel from "./StatsPanel"
import QuoteDisplay from "./QuoteDisplay"
import RewardsPanel from "./RewardsPanel"
import ThemeToggle from "./ThemeToggle"
import SoundToggle from "./SoundToggle"
import Header from "./Header"
import Footer from "./Footer"

export default function FocusZenApp() {
  const { theme } = useTheme()
  const { settings } = useSettings()
  const {
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
  } = useTimer()

  const { stats, addCompletedSession } = useStats()
  const { isMuted, toggleMute } = useAudio()
  const { currentQuote } = useQuotes(phase, isRunning)
  const { rewards, checkForNewRewards } = useRewards(stats)
  const [activePanel, setActivePanel] = useLocalStorage<string | null>("focuszen-active-panel", null)

  // Track completed sessions
  useEffect(() => {
    if (phase === "work" && timeRemaining === 0 && !isPaused && isRunning) {
      addCompletedSession()
      checkForNewRewards()
    }
  }, [phase, timeRemaining, isPaused, isRunning, addCompletedSession, checkForNewRewards])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  // Show notification when timer completes
  useEffect(() => {
    if (timeRemaining === 0 && !isPaused && isRunning) {
      if (Notification.permission === "granted") {
        const message =
          phase === "work" ? "Work session completed! Time for a break." : "Break time is over. Ready to focus again?"

        new Notification("FocusZen", {
          body: message,
          icon: "/favicon.ico",
        })
      }
    }
  }, [timeRemaining, isPaused, isRunning, phase])

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-1 flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 transition-colors duration-300">
        <Header activePanel={activePanel} setActivePanel={setActivePanel} />

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
          {isStrictMode && (
            <StrictModeOverlay
              timeRemaining={timeRemaining}
              progress={progress}
              phase={phase}
              exitStrictMode={exitStrictMode}
            />
          )}

          <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
            <TimerDisplay timeRemaining={timeRemaining} progress={progress} phase={phase} isPaused={isPaused} />

            <QuoteDisplay quote={currentQuote} />

            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              isStrictMode={isStrictMode}
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              resetTimer={resetTimer}
              skipPhase={skipPhase}
              toggleStrictMode={toggleStrictMode}
            />

            <SessionTracker phase={phase} sessionsCompleted={sessionsCompleted} settings={settings} />

            {activePanel === "settings" && <SettingsPanel onClose={() => setActivePanel(null)} />}

            {activePanel === "stats" && <StatsPanel stats={stats} onClose={() => setActivePanel(null)} />}

            {activePanel === "rewards" && <RewardsPanel rewards={rewards} onClose={() => setActivePanel(null)} />}
          </div>
        </main>

        <div className="fixed top-4 right-4 flex gap-2">
          <SoundToggle isMuted={isMuted} toggleMute={toggleMute} />
          <ThemeToggle />
        </div>

        <Footer />
      </div>
    </div>
  )
}
