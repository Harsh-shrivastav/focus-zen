"use client"

import { motion } from "framer-motion"
import { Settings, BarChart2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
  activePanel: string | null
  setActivePanel: (panel: string | null) => void
}

export default function Header({ activePanel, setActivePanel }: HeaderProps) {
  return (
    <header className="w-full border-b dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.h1
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FocusZen
        </motion.h1>

        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActivePanel(activePanel === "settings" ? null : "settings")}
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActivePanel(activePanel === "stats" ? null : "stats")}
                  aria-label="Statistics"
                >
                  <BarChart2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Statistics</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActivePanel(activePanel === "rewards" ? null : "rewards")}
                  aria-label="Achievements"
                >
                  <Trophy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Achievements</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}
