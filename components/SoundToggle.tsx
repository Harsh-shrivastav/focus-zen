"use client"

import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SoundToggleProps {
  isMuted: boolean
  toggleMute: () => void
}

export default function SoundToggle({ isMuted, toggleMute }: SoundToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMuted ? "Unmute" : "Mute"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
