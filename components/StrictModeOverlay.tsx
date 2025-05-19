"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import TimerDisplay from "./TimerDisplay"
import type { TimerPhase } from "@/types/timer"

interface StrictModeOverlayProps {
  timeRemaining: number
  progress: number
  phase: TimerPhase
  exitStrictMode: () => void
}

export default function StrictModeOverlay({ timeRemaining, progress, phase, exitStrictMode }: StrictModeOverlayProps) {
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
      <Button
        onClick={exitStrictMode}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        aria-label="Exit strict mode"
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="text-center max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-8">Strict Focus Mode</h2>

        <div className="mb-8">
          <TimerDisplay timeRemaining={timeRemaining} progress={progress} phase={phase} isPaused={false} />
        </div>

        <p className="text-gray-400 mb-4">
          Stay focused! Strict mode helps you avoid distractions by keeping you in fullscreen.
        </p>

        <p className="text-sm text-gray-500">Press the X button in the top right to exit strict mode.</p>
      </div>
    </motion.div>
  )
}
