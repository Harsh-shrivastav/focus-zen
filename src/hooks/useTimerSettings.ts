import { useLocalStorage } from "./useLocalStorage"

export function useTimerSettings() {
  // Default durations in milliseconds
  const [workDuration, setWorkDuration] = useLocalStorage("focuszen-work-duration", 25 * 60 * 1000) // 25 minutes
  const [shortBreakDuration, setShortBreakDuration] = useLocalStorage("focuszen-short-break-duration", 5 * 60 * 1000) // 5 minutes
  const [longBreakDuration, setLongBreakDuration] = useLocalStorage("focuszen-long-break-duration", 15 * 60 * 1000) // 15 minutes

  return {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
  }
}
