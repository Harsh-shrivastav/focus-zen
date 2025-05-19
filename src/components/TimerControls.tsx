"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, SkipForward, Lock, Unlock } from "lucide-react"
import type { TimerState } from "../types/timer"

interface TimerControlsProps {
  timerState: TimerState
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipToNextPhase: () => void
  toggleStrictMode: () => void
  isStrictMode: boolean
}

export default function TimerControls({
  timerState,
  startTimer,
  pauseTimer,
  resetTimer,
  skipToNextPhase,
  toggleStrictMode,
  isStrictMode,
}: TimerControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-center gap-4">
        {timerState === "running" ? (
          <ControlButton onClick={pauseTimer} icon={<Pause size={24} />} label="Pause" primary />
        ) : (
          <ControlButton onClick={startTimer} icon={<Play size={24} />} label="Start" primary />
        )}

        <ControlButton onClick={resetTimer} icon={<RotateCcw size={24} />} label="Reset" />

        <ControlButton onClick={skipToNextPhase} icon={<SkipForward size={24} />} label="Skip" />
      </div>

      <div className="flex justify-center">
        <ControlButton
          onClick={toggleStrictMode}
          icon={isStrictMode ? <Unlock size={20} /> : <Lock size={20} />}
          label={isStrictMode ? "Exit Strict Mode" : "Enter Strict Mode"}
          small
        />
      </div>
    </div>
  )
}

interface ControlButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  primary?: boolean
  small?: boolean
}

function ControlButton({ onClick, icon, label, primary, small }: ControlButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center justify-center rounded-full 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          primary
            ? "bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500"
        }
        ${small ? "px-4 py-2 text-sm" : "p-4"}
      `}
      aria-label={label}
    >
      {icon}
      {small && <span className="ml-2">{label}</span>}
    </motion.button>
  )
}
