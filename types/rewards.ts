export interface Reward {
  id: string
  title: string
  description: string
  threshold: number
  thresholdType?: "sessions" | "streak"
  level: "bronze" | "silver" | "gold"
  dateUnlocked: string
}
