"use client"

import { useState, useCallback, useEffect } from "react"

export function useStrictMode() {
  const [isStrictMode, setIsStrictMode] = useState(false)

  // Toggle strict mode
  const toggleStrictMode = useCallback(() => {
    setIsStrictMode((prev) => !prev)
  }, [])

  // Exit strict mode
  const exitStrictMode = useCallback(() => {
    setIsStrictMode(false)
  }, [])

  // Prevent user from accidentally leaving the page in strict mode
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStrictMode) {
        e.preventDefault()
        e.returnValue = "Are you sure you want to leave? Your focus session is still active."
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isStrictMode])

  return {
    isStrictMode,
    toggleStrictMode,
    exitStrictMode,
  }
}
