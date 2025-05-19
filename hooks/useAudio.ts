"use client"

import { useCallback, useRef, useEffect } from "react"
import { useSettings } from "./useSettings"
import { useLocalStorage } from "./useLocalStorage"

export function useAudio() {
  const { settings } = useSettings()
  const [isMuted, setIsMuted] = useLocalStorage("focuszen-muted", false)

  const tickSoundRef = useRef<HTMLAudioElement | null>(null)
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null)
  const initializedRef = useRef(false)

  // Initialize audio elements only once
  useEffect(() => {
    if (typeof window !== "undefined" && !initializedRef.current) {
      tickSoundRef.current = new Audio()
      tickSoundRef.current.src = "/tick.mp3"

      alarmSoundRef.current = new Audio()
      alarmSoundRef.current.src = "/notification.mp3"

      initializedRef.current = true
    }
  }, [])

  // Update volume when settings change
  useEffect(() => {
    if (tickSoundRef.current) {
      tickSoundRef.current.volume = settings.tickingVolume / 100
    }

    if (alarmSoundRef.current) {
      alarmSoundRef.current.volume = settings.alarmVolume / 100
    }
  }, [settings.tickingVolume, settings.alarmVolume])

  // Play tick sound
  const playTickSound = useCallback(() => {
    if (isMuted || !settings.tickingSoundEnabled || !tickSoundRef.current) return

    // Reset and play
    tickSoundRef.current.currentTime = 0
    tickSoundRef.current.play().catch((err) => console.error("Error playing tick sound:", err))
  }, [isMuted, settings.tickingSoundEnabled])

  // Play alarm sound
  const playAlarmSound = useCallback(() => {
    if (isMuted || !settings.alarmSoundEnabled || !alarmSoundRef.current) return

    // Reset and play
    alarmSoundRef.current.currentTime = 0
    alarmSoundRef.current.play().catch((err) => console.error("Error playing alarm sound:", err))
  }, [isMuted, settings.alarmSoundEnabled])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [setIsMuted])

  return {
    isMuted,
    toggleMute,
    playTickSound,
    playAlarmSound,
  }
}
