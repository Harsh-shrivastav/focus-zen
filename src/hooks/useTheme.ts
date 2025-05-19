"use client"

import { useEffect } from "react"
import { useLocalStorage } from "./useLocalStorage"

type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "focuszen-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  )

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}
