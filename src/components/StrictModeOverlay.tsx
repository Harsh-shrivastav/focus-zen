"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { TimerPhase } from "../types/timer"
import TimerDisplay from "./TimerDisplay"

interface StrictModeOverlayProps {
  exitStrictMode: () => void
  timeRemaining: number
  currentPhase: TimerPhase
  progress: number
}

export default function StrictModeOverlay({
  exitStrictMode,
  timeRemaining,
  currentPhase,
  progress,
}: StrictModeOverlayProps) {
  // Request fullscreen when strict mode is activated
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (error) {
        console.error("Failed to enter fullscreen mode:", error)
      }
    }

    requestFullscreen()

    // Prevent tab switching using the visibility API
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Play an alert sound or show a notification to bring user back
        new Audio("/notification.mp3").play().catch((err) => console.error(err))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      // Exit fullscreen when strict mode is deactivated
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err))
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 text-white"
    >
      <button
        onClick={exitStrictMode}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Exit strict mode"
      >
        <X size={24} />
      </button>

      <div className="text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-8">Strict Mode Activated</h2>

        <div className="mb-8">
          <TimerDisplay
            timeRemaining={timeRemaining}
            progress={progress}
            currentPhase={currentPhase}
            timerState="running"
          />
        </div>

        <p className="text-gray-400 mb-4">Stay focused! Strict mode helps you avoid distractions.</p>

        <p className="text-sm text-gray-500">Press the X button in the top right to exit strict mode.</p>
      </div>
    </motion.div>
  )
}
