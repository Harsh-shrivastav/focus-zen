"use client"

import { useCallback, useRef } from "react"

export function useAudio(isMuted = false) {
  const tickSoundRef = useRef<HTMLAudioElement | null>(null)
  const endSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements lazily
  const initializeAudio = () => {
    if (!tickSoundRef.current) {
      tickSoundRef.current = new Audio()
      tickSoundRef.current.src =
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMDAwMD///////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAAbA2MzOuAAAAAAAAAAAAAAAAAAAA/+MYxAANmAKwQAUAAAOAeBD5IP///kYHgf/+Tn/nf//5OeCB9///5P//OEDBAAA9g+D59S/////nggQOCAIHgQBAEDv//yBg+D4Pg+BAEAQBAEAQPg+D4IAg/+MYxBYUEi6mQA0AAP+fwfB8HwQPg+CAIHwfB8EAQBAEAQBA+D4PggCAIAgCB8HwfB8EAQBAEAQBA+D4PggCAIAgCAIHwfB8EAQBAEAQBA+D4PggCAIAgCA"
      tickSoundRef.current.volume = 0.2
    }

    if (!endSoundRef.current) {
      endSoundRef.current = new Audio()
      endSoundRef.current.src = "/notification.mp3"
      endSoundRef.current.volume = 0.5
    }
  }

  // Play tick sound
  const playTickSound = useCallback(() => {
    if (isMuted) return

    initializeAudio()

    if (tickSoundRef.current) {
      // Reset and play
      tickSoundRef.current.currentTime = 0
      tickSoundRef.current.play().catch((err) => console.error("Error playing tick sound:", err))
    }
  }, [isMuted])

  // Play end sound
  const playEndSound = useCallback(() => {
    if (isMuted) return

    initializeAudio()

    if (endSoundRef.current) {
      // Reset and play
      endSoundRef.current.currentTime = 0
      endSoundRef.current.play().catch((err) => console.error("Error playing end sound:", err))
    }
  }, [isMuted])

  return {
    playTickSound,
    playEndSound,
  }
}
