"use client"

import { useLocalStorage } from "./useLocalStorage"
import type { Settings } from "@/types/settings"

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25 * 60 * 1000, // 25 minutes
  shortBreakDuration: 5 * 60 * 1000, // 5 minutes
  longBreakDuration: 15 * 60 * 1000, // 15 minutes
  autoStartBreaks: false,
  autoStartPomodoros: false,
  tickingSoundEnabled: true,
  alarmSoundEnabled: true,
  tickingVolume: 30,
  alarmVolume: 70,
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>("focuszen-settings", DEFAULT_SETTINGS)

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }))
  }

  return {
    settings,
    updateSettings,
  }
}
