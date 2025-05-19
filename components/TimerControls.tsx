"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, SkipForward, Lock, Unlock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  isStrictMode: boolean
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipPhase: () => void
  toggleStrictMode: () => void
}

export default function TimerControls({
  isRunning,
  isPaused,
  isStrictMode,
  startTimer,
  pauseTimer,
  resetTimer,
  skipPhase,
  toggleStrictMode,
}: TimerControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isRunning && !isPaused ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    onClick={pauseTimer}
                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-full h-14 w-14 p-0"
                  >
                    <Pause className="h-6 w-6" />
                    <span className="sr-only">Pause</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pause Timer</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    onClick={startTimer}
                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-full h-14 w-14 p-0"
                  >
                    <Play className="h-6 w-6" />
                    <span className="sr-only">Start</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start Timer</p>
                </TooltipContent>
              </Tooltip>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="outline" onClick={resetTimer} className="rounded-full h-14 w-14 p-0">
                  <RotateCcw className="h-5 w-5" />
                  <span className="sr-only">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Timer</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="outline" onClick={skipPhase} className="rounded-full h-14 w-14 p-0">
                  <SkipForward className="h-5 w-5" />
                  <span className="sr-only">Skip</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Skip to Next Phase</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleStrictMode} className="flex items-center gap-2">
                  {isStrictMode ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {isStrictMode ? "Exit Strict Mode" : "Enter Strict Mode"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isStrictMode ? "Exit fullscreen focus mode" : "Enter fullscreen focus mode to prevent distractions"}
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
