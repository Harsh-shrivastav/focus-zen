"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/hooks/useSettings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings()

  // Convert milliseconds to minutes for display
  const msToMin = (ms: number) => ms / 60000

  // Local state for form values
  const [workDuration, setWorkDuration] = useState(msToMin(settings.workDuration))
  const [shortBreakDuration, setShortBreakDuration] = useState(msToMin(settings.shortBreakDuration))
  const [longBreakDuration, setLongBreakDuration] = useState(msToMin(settings.longBreakDuration))
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks)
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(settings.autoStartPomodoros)
  const [tickingSoundEnabled, setTickingSoundEnabled] = useState(settings.tickingSoundEnabled)
  const [alarmSoundEnabled, setAlarmSoundEnabled] = useState(settings.alarmSoundEnabled)
  const [alarmVolume, setAlarmVolume] = useState(settings.alarmVolume)
  const [tickingVolume, setTickingVolume] = useState(settings.tickingVolume)

  const handleSave = () => {
    updateSettings({
      workDuration: workDuration * 60000,
      shortBreakDuration: shortBreakDuration * 60000,
      longBreakDuration: longBreakDuration * 60000,
      autoStartBreaks,
      autoStartPomodoros,
      tickingSoundEnabled,
      alarmSoundEnabled,
      alarmVolume,
      tickingVolume,
    })
    onClose()
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
          <CardTitle>Settings</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timer">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>

            <TabsContent value="timer" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="work-duration">Work Duration: {workDuration} minutes</Label>
                  <Slider
                    id="work-duration"
                    min={1}
                    max={60}
                    step={1}
                    value={[workDuration]}
                    onValueChange={(value) => setWorkDuration(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="short-break-duration">Short Break: {shortBreakDuration} minutes</Label>
                  <Slider
                    id="short-break-duration"
                    min={1}
                    max={15}
                    step={1}
                    value={[shortBreakDuration]}
                    onValueChange={(value) => setShortBreakDuration(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="long-break-duration">Long Break: {longBreakDuration} minutes</Label>
                  <Slider
                    id="long-break-duration"
                    min={5}
                    max={30}
                    step={1}
                    value={[longBreakDuration]}
                    onValueChange={(value) => setLongBreakDuration(value[0])}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
                  <Switch id="auto-start-breaks" checked={autoStartBreaks} onCheckedChange={setAutoStartBreaks} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-start-pomodoros">Auto-start pomodoros</Label>
                  <Switch
                    id="auto-start-pomodoros"
                    checked={autoStartPomodoros}
                    onCheckedChange={setAutoStartPomodoros}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ticking-sound-enabled">Ticking sound</Label>
                  <Switch
                    id="ticking-sound-enabled"
                    checked={tickingSoundEnabled}
                    onCheckedChange={setTickingSoundEnabled}
                  />
                </div>

                {tickingSoundEnabled && (
                  <div>
                    <Label htmlFor="ticking-volume">Ticking volume: {tickingVolume}%</Label>
                    <Slider
                      id="ticking-volume"
                      min={0}
                      max={100}
                      step={1}
                      value={[tickingVolume]}
                      onValueChange={(value) => setTickingVolume(value[0])}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="alarm-sound-enabled">Alarm sound</Label>
                  <Switch id="alarm-sound-enabled" checked={alarmSoundEnabled} onCheckedChange={setAlarmSoundEnabled} />
                </div>

                {alarmSoundEnabled && (
                  <div>
                    <Label htmlFor="alarm-volume">Alarm volume: {alarmVolume}%</Label>
                    <Slider
                      id="alarm-volume"
                      min={0}
                      max={100}
                      step={1}
                      value={[alarmVolume]}
                      onValueChange={(value) => setAlarmVolume(value[0])}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
