"use client"

import { useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"

type Theme = "light" | "dark"

export function useTheme() {
  // Use useState with a function to initialize only once
  const [theme, setTheme] = useLocalStorage<Theme>("focuszen-theme", () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light" // Default for SSR
  })

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
    }
  }, [theme])

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return {
    theme,
    toggleTheme,
  }
}
