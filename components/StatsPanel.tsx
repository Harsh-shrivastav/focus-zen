"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Calendar, BarChart2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Stats } from "@/types/stats"
import { formatTime } from "@/lib/utils"
import CalendarView from "./CalendarView"

interface StatsPanelProps {
  stats: Stats
  onClose: () => void
}

export default function StatsPanel({ stats, onClose }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState("summary")

  // Calculate total focus time in hours and minutes
  const calculateTotalFocusTime = () => {
    const totalMinutes = stats.totalFocusTime / 60000
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)

    if (hours === 0) {
      return `${minutes} min`
    }

    return `${hours}h ${minutes}m`
  }

  // Calculate daily average
  const calculateDailyAverage = () => {
    if (stats.dailyAverage === 0) return "N/A"
    return `${stats.dailyAverage.toFixed(1)} sessions`
  }

  // Calculate current streak
  const calculateStreak = () => {
    return `${stats.currentStreak} days`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50"
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Statistics</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Total Focus Time</span>
                  </div>
                  <p className="text-2xl font-bold">{calculateTotalFocusTime()}</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <BarChart2 className="h-4 w-4" />
                    <span>Sessions Completed</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.completedSessions}</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Daily Average</span>
                  </div>
                  <p className="text-2xl font-bold">{calculateDailyAverage()}</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Current Streak</span>
                  </div>
                  <p className="text-2xl font-bold">{calculateStreak()}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  {stats.recentSessions.length > 0 ? (
                    stats.recentSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span>{formatTime(session.duration)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent sessions</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarView dailyHistory={stats.dailyHistory} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
