export type TimerPhase = "work" | "shortBreak" | "longBreak"
export type TimerState = "idle" | "running" | "paused" | "completed"

export interface Stats {
  completedSessions: number
  dailyAverage: number
  startDate: string
  dailyHistory: Record<string, number>
}
