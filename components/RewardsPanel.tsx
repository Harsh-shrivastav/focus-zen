"use client"

import { motion } from "framer-motion"
import { X, Award, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reward } from "@/types/rewards"

interface RewardsPanelProps {
  rewards: Reward[]
  onClose: () => void
}

export default function RewardsPanel({ rewards, onClose }: RewardsPanelProps) {
  // Get icon based on reward level
  const getRewardIcon = (level: string) => {
    switch (level) {
      case "bronze":
        return <Award className="h-6 w-6 text-amber-700" />
      case "silver":
        return <Trophy className="h-6 w-6 text-gray-400" />
      case "gold":
        return <Star className="h-6 w-6 text-yellow-400" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  // Get color class based on reward level
  const getRewardColorClass = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
      case "silver":
        return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      case "gold":
        return "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50"
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {rewards.length > 0 ? (
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getRewardColorClass(reward.level)} flex items-center gap-4`}
                >
                  <div className="p-2 rounded-full bg-white dark:bg-gray-900">{getRewardIcon(reward.level)}</div>
                  <div>
                    <h3 className="font-medium">{reward.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
                    <p className="text-xs mt-1 opacity-70">
                      Unlocked: {new Date(reward.dateUnlocked).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="font-medium mb-2">No achievements yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete focus sessions to earn achievements and rewards!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
