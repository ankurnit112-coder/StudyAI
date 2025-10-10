"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Bell,
  BellRing,
  Clock,
  BookOpen,
  Trophy,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  Smartphone,
  Brain,
} from "lucide-react"

interface Notification {
  id: string
  type: "study_reminder" | "break_reminder" | "exam_alert" | "achievement" | "ai_insight"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
  actionText?: string
}

interface NotificationSettings {
  studyReminders: boolean
  breakReminders: boolean
  examAlerts: boolean
  achievements: boolean
  aiInsights: boolean
  dailyGoals: boolean
  weeklyReports: boolean
  pushNotifications: boolean
  emailNotifications: boolean
  reminderTime: string
  breakInterval: number
}

// Sample notifications data
const getSampleNotifications = (): Notification[] => [
  {
    id: "1",
    type: "study_reminder",
    title: "Time to Study Mathematics!",
    message: "Your scheduled Math session starts in 15 minutes. Topic: Integration by Parts",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "high",
    actionUrl: "/study-plan",
    actionText: "Start Session"
  },
  {
    id: "2",
    type: "ai_insight",
    title: "AI Recommendation",
    message: "Focus on Physics mechanics today. Your recent scores suggest 30 minutes of practice could improve your board exam prediction by 5%.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: "medium",
    actionUrl: "/insights",
    actionText: "View Details"
  },
  {
    id: "3",
    type: "achievement",
    title: "Study Streak Achievement!",
    message: "Congratulations! You&apos;ve maintained a 14-day study streak. Keep it up!",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: "low",
    actionUrl: "/achievements",
    actionText: "View Achievements"
  },
  {
    id: "4",
    type: "exam_alert",
    title: "Physics Unit Test Tomorrow",
    message: "Don&apos;t forget your Physics unit test tomorrow at 10:00 AM. Review mechanics problems.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    actionUrl: "/schedule",
    actionText: "View Schedule"
  },
  {
    id: "5",
    type: "break_reminder",
    title: "Take a Break",
    message: "You&apos;ve been studying for 45 minutes. Take a 10-minute break to maintain focus.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
    priority: "medium"
  }
]

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(getSampleNotifications)
  const [settings, setSettings] = useState<NotificationSettings>({
    studyReminders: true,
    breakReminders: true,
    examAlerts: true,
    achievements: true,
    aiInsights: true,
    dailyGoals: true,
    weeklyReports: false,
    pushNotifications: true,
    emailNotifications: false,
    reminderTime: "09:00",
    breakInterval: 45
  })
  const [activeTab, setActiveTab] = useState("notifications")

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        toast.success("Notifications enabled successfully!")
        setSettings(prev => ({ ...prev, pushNotifications: true }))
      } else {
        toast.error("Notification permission denied")
        setSettings(prev => ({ ...prev, pushNotifications: false }))
      }
    }
  }

  // Send test notification
  const sendTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("StudyAI Test", {
        body: "This is a test notification from StudyAI!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "test-notification"
      })
      toast.success("Test notification sent!")
    } else {
      toast.error("Notifications not enabled")
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "study_reminder": return <BookOpen className="h-4 w-4" />
      case "break_reminder": return <Clock className="h-4 w-4" />
      case "exam_alert": return <AlertCircle className="h-4 w-4" />
      case "achievement": return <Trophy className="h-4 w-4" />
      case "ai_insight": return <Brain className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50"
      case "medium": return "border-yellow-200 bg-yellow-50"
      default: return "border-gray-200 bg-gray-50"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BellRing className="h-6 w-6 text-sky" />
          <h2 className="text-2xl font-bold text-navy">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={sendTestNotification}>
            Test Notification
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
                <p className="text-gray-500">You&apos;re all caught up! New notifications will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.read ? getPriorityColor(notification.priority) : "bg-white"
                } transition-all duration-200`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${
                        notification.type === "study_reminder" ? "bg-sky/20 text-sky" :
                        notification.type === "break_reminder" ? "bg-teal/20 text-teal" :
                        notification.type === "exam_alert" ? "bg-red/20 text-red-600" :
                        notification.type === "achievement" ? "bg-yellow/20 text-yellow-600" :
                        notification.type === "ai_insight" ? "bg-sage/20 text-sage" :
                        "bg-gray/20 text-gray-600"
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-navy">{notification.title}</h3>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-sky rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Button size="sm" variant="outline" className="text-xs">
                                {notification.actionText || "View"}
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-navy">Study Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="study-reminders">Study Session Reminders</Label>
                    <p className="text-sm text-gray-600">Get notified before scheduled study sessions</p>
                  </div>
                  <Switch
                    id="study-reminders"
                    checked={settings.studyReminders}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, studyReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="break-reminders">Break Reminders</Label>
                    <p className="text-sm text-gray-600">Reminders to take breaks during study sessions</p>
                  </div>
                  <Switch
                    id="break-reminders"
                    checked={settings.breakReminders}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, breakReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-goals">Daily Goal Reminders</Label>
                    <p className="text-sm text-gray-600">Daily reminders about your study goals</p>
                  </div>
                  <Switch
                    id="daily-goals"
                    checked={settings.dailyGoals}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, dailyGoals: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-navy">Academic Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="exam-alerts">Exam Alerts</Label>
                    <p className="text-sm text-gray-600">Important exam and test reminders</p>
                  </div>
                  <Switch
                    id="exam-alerts"
                    checked={settings.examAlerts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, examAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-insights">AI Insights</Label>
                    <p className="text-sm text-gray-600">Personalized AI recommendations and insights</p>
                  </div>
                  <Switch
                    id="ai-insights"
                    checked={settings.aiInsights}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, aiInsights: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievements">Achievements</Label>
                    <p className="text-sm text-gray-600">Celebrate your study milestones and achievements</p>
                  </div>
                  <Switch
                    id="achievements"
                    checked={settings.achievements}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, achievements: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-navy">Delivery Methods</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications on this device</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => {
                        if (checked && typeof window !== "undefined" && Notification.permission !== "granted") {
                          requestNotificationPermission()
                        } else {
                          setSettings(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      }}
                    />
                    {typeof window !== "undefined" && Notification.permission !== "granted" && (
                      <Button size="sm" variant="outline" onClick={requestNotificationPermission}>
                        Enable
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-navy">Timing Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                    <Select
                      value={settings.reminderTime}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, reminderTime: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="break-interval">Break Reminder Interval</Label>
                    <Select
                      value={settings.breakInterval.toString()}
                      onValueChange={(value) =>
                        setSettings(prev => ({ ...prev, breakInterval: parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}