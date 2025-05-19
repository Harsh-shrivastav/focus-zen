export interface Session {
  date: string
  duration: number
}

export interface DailyHistory {
  [date: string]: number
}

export interface Stats {
  completedSessions: number
  totalFocusTime: number
  dailyAverage: number
  currentStreak: number
  longestStreak: number
  startDate: string
  dailyHistory: DailyHistory
  recentSessions: Session[]
}
