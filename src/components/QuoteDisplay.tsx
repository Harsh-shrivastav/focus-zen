"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"
import type { TimerPhase, TimerState } from "../types/timer"

interface QuoteDisplayProps {
  currentPhase: TimerPhase
  timerState: TimerState
}

// Collection of motivational quotes
const quotes = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "You don't have to be great to start, but you have to start to be great.",
  "The way to get started is to quit talking and begin doing.",
  "It's not about having time, it's about making time.",
  "Productivity is never an accident. It is always the result of a commitment to excellence.",
  "Don't count the days, make the days count.",
  "The only way to do great work is to love what you do.",
  "Your focus determines your reality.",
  "Small progress is still progress.",
  "The best way to predict the future is to create it.",
  "Don't wait for inspiration. It comes while working.",
  "Action is the foundational key to all success.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The most effective way to do it, is to do it.",
  "Productivity is being able to do things that you were never able to do before.",
  "Time is what we want most, but what we use worst.",
  "Either you run the day, or the day runs you.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
]

// Collection of break quotes
const breakQuotes = [
  "Take a breath. You've earned it.",
  "Rest is not idleness, it is the key to better work.",
  "The time to relax is when you don't have time for it.",
  "Almost everything will work again if you unplug it for a few minutes, including you.",
  "Sometimes the most productive thing you can do is relax.",
  "Your mind will answer most questions if you learn to relax and wait for the answer.",
  "Rest when you're weary. Refresh and renew yourself.",
  "Taking time to do nothing often brings everything into perspective.",
  "The breaks you take from work pay you back manifold when you return.",
  "Rest is not a luxury, it's a necessity.",
]

export default function QuoteDisplay({ currentPhase, timerState }: QuoteDisplayProps) {
  const [quote, setQuote] = useState("")

  // Change quote when phase changes or timer completes
  useEffect(() => {
    const quoteList = currentPhase === "work" ? quotes : breakQuotes
    const randomIndex = Math.floor(Math.random() * quoteList.length)
    setQuote(quoteList[randomIndex])
  }, [currentPhase, timerState === "completed"])

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={quote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-2 text-sm text-center italic opacity-75"
        >
          <Quote size={16} className="shrink-0 mt-0.5" />
          <p>{quote}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
