"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"

interface QuoteDisplayProps {
  quote: string
}

export default function QuoteDisplay({ quote }: QuoteDisplayProps) {
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
