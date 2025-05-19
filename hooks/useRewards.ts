"use client"

import { useLocalStorage } from "./useLocalStorage"
import type { Reward } from "@/types/rewards"
import type { Stats } from "@/types/stats"

// Define reward thresholds
const REWARDS = [
  {
    id: "first-pomodoro",
    title: "First Step",
    description: "Complete your first Pomodoro session",
    threshold: 1,
    level: "bronze",
  },
  {
    id: "five-pomodoros",
    title: "Getting Started",
    description: "Complete 5 Pomodoro sessions",
    threshold: 5,
    level: "bronze",
  },
  {
    id: "ten-pomodoros",
    title: "Building Momentum",
    description: "Complete 10 Pomodoro sessions",
    threshold: 10,
    level: "bronze",
  },
  {
    id: "twenty-five-pomodoros",
    title: "Quarter Century",
    description: "Complete 25 Pomodoro sessions",
    threshold: 25,
    level: "silver",
  },
  {
    id: "fifty-pomodoros",
    title: "Half Century",
    description: "Complete 50 Pomodoro sessions",
    threshold: 50,
    level: "silver",
  },
  {
    id: "hundred-pomodoros",
    title: "Century Milestone",
    description: "Complete 100 Pomodoro sessions",
    threshold: 100,
    level: "gold",
  },
  {
    id: "three-day-streak",
    title: "Consistency",
    description: "Maintain a 3-day streak",
    thresholdType: "streak",
    threshold: 3,
    level: "bronze",
  },
  {
    id: "seven-day-streak",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    thresholdType: "streak",
    threshold: 7,
    level: "silver",
  },
  {
    id: "fourteen-day-streak",
    title: "Fortnight Focus",
    description: "Maintain a 14-day streak",
    thresholdType: "streak",
    threshold: 14,
    level: "gold",
  },
]

export function useRewards(stats: Stats) {
  const [rewards, setRewards] = useLocalStorage<Reward[]>("focuszen-rewards", [])

  // Check for new rewards
  const checkForNewRewards = () => {
    const newRewards: Reward[] = []

    REWARDS.forEach((rewardTemplate) => {
      // Skip if already earned
      if (rewards.some((r) => r.id === rewardTemplate.id)) {
        return
      }

      // Check if threshold is met
      let isEarned = false

      if (rewardTemplate.thresholdType === "streak") {
        isEarned = stats.currentStreak >= rewardTemplate.threshold
      } else {
        isEarned = stats.completedSessions >= rewardTemplate.threshold
      }

      if (isEarned) {
        newRewards.push({
          ...rewardTemplate,
          dateUnlocked: new Date().toISOString(),
        })
      }
    })

    if (newRewards.length > 0) {
      setRewards((prev) => [...prev, ...newRewards])
    }

    return newRewards
  }

  return {
    rewards,
    checkForNewRewards,
  }
}
