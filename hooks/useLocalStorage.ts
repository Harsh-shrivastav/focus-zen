"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  // Get initial value (handle function initializers)
  const getInitialValue = () => {
    return initialValue instanceof Function ? initialValue() : initialValue
  }

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getInitialValue)

  // Flag to track if we've initialized from localStorage
  const initialized = useRef(false)

  // Initialize the state
  useEffect(() => {
    if (typeof window === "undefined" || initialized.current) {
      return
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      if (item) {
        setStoredValue(JSON.parse(item))
      }
      initialized.current = true
    } catch (error) {
      // If error also return initialValue
      console.error("Error reading from localStorage:", error)
    }
  }, [key])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue] as const
}
