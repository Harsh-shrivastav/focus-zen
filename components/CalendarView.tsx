"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DailyHistory } from "@/types/stats"

interface CalendarViewProps {
  dailyHistory: DailyHistory
}

export default function CalendarView({ dailyHistory }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Create array of empty cells for days before first day of month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Get intensity for a specific day (0-4)
  const getIntensity = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const sessions = dailyHistory[dateString] || 0

    if (sessions === 0) return 0
    if (sessions <= 2) return 1
    if (sessions <= 4) return 2
    if (sessions <= 6) return 3
    return 4
  }

  // Get color class based on intensity
  const getColorClass = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800"
    if (intensity === 1) return "bg-rose-200 dark:bg-rose-900"
    if (intensity === 2) return "bg-rose-300 dark:bg-rose-800"
    if (intensity === 3) return "bg-rose-400 dark:bg-rose-700"
    return "bg-rose-500 dark:bg-rose-600"
  }

  // Get sessions for a specific day
  const getSessions = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return dailyHistory[dateString] || 0
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {days.map((day) => {
          const intensity = getIntensity(day)
          const sessions = getSessions(day)

          return (
            <div
              key={day}
              className={`aspect-square rounded-md flex flex-col items-center justify-center ${getColorClass(intensity)}`}
              title={`${sessions} sessions`}
            >
              <span className="text-xs">{day}</span>
              {sessions > 0 && <span className="text-[10px] opacity-70">{sessions}</span>}
            </div>
          )
        })}
      </div>

      <div className="flex justify-center items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1 mr-3">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
          <span>0</span>
        </div>
        <div className="flex items-center gap-1 mr-3">
          <div className="w-3 h-3 bg-rose-200 dark:bg-rose-900 rounded"></div>
          <span>1-2</span>
        </div>
        <div className="flex items-center gap-1 mr-3">
          <div className="w-3 h-3 bg-rose-300 dark:bg-rose-800 rounded"></div>
          <span>3-4</span>
        </div>
        <div className="flex items-center gap-1 mr-3">
          <div className="w-3 h-3 bg-rose-400 dark:bg-rose-700 rounded"></div>
          <span>5-6</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-rose-500 dark:bg-rose-600 rounded"></div>
          <span>7+</span>
        </div>
      </div>
    </div>
  )
}
