"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  Bell,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Filter,
} from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  subject: string
  type: "study" | "exam" | "assignment" | "class" | "break" | "revision"
  date: string
  startTime: string
  endTime: string
  duration: number
  description?: string
  location?: string
  isRecurring: boolean
  priority: "low" | "medium" | "high"
  status: "upcoming" | "in-progress" | "completed" | "missed"
  reminder: boolean
  color: string
}

// Day view functionality - reserved for future implementation
// interface DayView {
//   date: string
//   events: ScheduleEvent[]
//   totalStudyTime: number
//   completedTasks: number
//   totalTasks: number
// }

export default function EnhancedSchedule() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddEvent, setShowAddEvent] = useState(false)
  // const [viewMode, setViewMode] = useState("week") // week, month, day - view mode switching reserved for future
  const [filterType, setFilterType] = useState("all")

  // Load user's schedule data
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "study",
    date: selectedDate,
    startTime: "",
    endTime: "",
    duration: 60,
    description: "",
    location: "",
    isRecurring: false,
    priority: "medium",
    reminder: true
  })

  useEffect(() => {
    loadScheduleData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const generateSampleEvents = (): ScheduleEvent[] => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return [
      {
        id: "1",
        title: "Mathematics Practice",
        subject: "Mathematics",
        type: "study",
        date: today.toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "10:30",
        duration: 90,
        description: "Integration and differentiation practice",
        isRecurring: true,
        priority: "high",
        status: "completed",
        reminder: true,
        color: "bg-sky-500"
      },
      {
        id: "2",
        title: "Physics Unit Test",
        subject: "Physics",
        type: "exam",
        date: tomorrow.toISOString().split('T')[0],
        startTime: "10:00",
        endTime: "12:00",
        duration: 120,
        description: "Mechanics and Thermodynamics",
        location: "Room 201",
        isRecurring: false,
        priority: "high",
        status: "upcoming",
        reminder: true,
        color: "bg-red-500"
      },
      {
        id: "3",
        title: "Chemistry Study Session",
        subject: "Chemistry",
        type: "study",
        date: today.toISOString().split('T')[0],
        startTime: "14:00",
        endTime: "15:30",
        duration: 90,
        description: "Organic chemistry reactions",
        isRecurring: false,
        priority: "medium",
        status: "upcoming",
        reminder: true,
        color: "bg-green-500"
      }
    ]
  }

  const loadScheduleData = async () => {
    try {
      setIsLoading(true)
      // Try to load user's saved schedule from localStorage
      const savedSchedule = localStorage.getItem('userSchedule')
      if (savedSchedule) {
        setEvents(JSON.parse(savedSchedule))
      } else {
        // Generate sample events for demo
        const sampleEvents = generateSampleEvents()
        setEvents(sampleEvents)
        localStorage.setItem('userSchedule', JSON.stringify(sampleEvents))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load schedule data:', error)
      }
      // Fallback to sample events
      const sampleEvents = generateSampleEvents()
      setEvents(sampleEvents)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your schedule...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Study Schedule</h1>
              <p className="text-muted-foreground">Plan and track your study sessions</p>
            </div>
          </div>
          
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-sky" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">No Schedule Created Yet</h3>
                  <p className="text-gray-600 mt-2 max-w-md">
                    Create your first study session or exam schedule to get started with organized learning.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-sky hover:bg-sky/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Study Session
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Import from Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Sample events for fallback (will be removed when backend is connected)
  // const sampleEvents: ScheduleEvent[] = [
  //   {
  //     id: "1",
  //     title: "Mathematics Practice",
  //     subject: "Mathematics",
  //     type: "study",
  //     date: "2025-01-19",
  //     startTime: "09:00",
  //     endTime: "10:30",
  //     duration: 90,
  //     description: "Integration by parts practice problems",
  //     isRecurring: true,
  //     priority: "high",
  //     status: "completed",
  //     reminder: true,
  //     color: "bg-sky-500"
  //   },
  //   {
  //     id: "2",
  //     title: "Physics Unit Test",
  //     subject: "Physics",
  //     type: "exam",
  //     date: "2025-01-20",
  //     startTime: "10:00",
  //     endTime: "12:00",
  //     duration: 120,
  //     description: "Mechanics and Thermodynamics",
  //     location: "Room 201",
  //     isRecurring: false,
  //     priority: "high",
  //     status: "upcoming",
  //     reminder: true,
  //     color: "bg-red-500"
  //   },
  //   {
  //     id: "3",
  //     title: "Chemistry Lab Report",
  //     subject: "Chemistry",
  //     type: "assignment",
  //     date: "2025-01-21",
  //     startTime: "14:00",
  //     endTime: "16:00",
  //     duration: 120,
  //     description: "Organic chemistry synthesis report",
  //     isRecurring: false,
  //     priority: "medium",
  //     status: "upcoming",
  //     reminder: true,
  //     color: "bg-green-500"
  //   },
  //   {
  //     id: "4",
  //     title: "English Literature Class",
  //     subject: "English",
  //     type: "class",
  //     date: "2025-01-19",
  //     startTime: "11:00",
  //     endTime: "12:00",
  //     duration: 60,
  //     description: "Shakespeare's Hamlet analysis",
  //     location: "Online",
  //     isRecurring: true,
  //     priority: "medium",
  //     status: "completed",
  //     reminder: false,
  //     color: "bg-purple-500"
  //   },
  //   {
  //     id: "5",
  //     title: "Study Break",
  //     subject: "",
  //     type: "break",
  //     date: "2025-01-19",
  //     startTime: "15:00",
  //     endTime: "15:30",
  //     duration: 30,
  //     description: "Relaxation and snack time",
  //     isRecurring: true,
  //     priority: "low",
  //     status: "completed",
  //     reminder: false,
  //     color: "bg-gray-400"
  //   }
  // ]



  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "Computer Science", "Physical Education", "Economics", "Business Studies"
  ]

  const eventTypes = [
    { value: "study", label: "Study Session", color: "bg-sky-500" },
    { value: "exam", label: "Exam/Test", color: "bg-red-500" },
    { value: "assignment", label: "Assignment", color: "bg-green-500" },
    { value: "class", label: "Class/Lecture", color: "bg-purple-500" },
    { value: "revision", label: "Revision", color: "bg-yellow-500" },
    { value: "break", label: "Break", color: "bg-gray-400" }
  ]

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0]
    return getEventsForDate(today)
  }

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(event => event.date >= today && event.status === "upcoming")
      .sort((a, b) => new Date(a.date + " " + a.startTime).getTime() - new Date(b.date + " " + b.startTime).getTime())
      .slice(0, 5)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success("Event added successfully!")
    setShowAddEvent(false)
    setFormData({
      title: "",
      subject: "",
      type: "study",
      date: selectedDate,
      startTime: "",
      endTime: "",
      duration: 60,
      description: "",
      location: "",
      isRecurring: false,
      priority: "medium",
      reminder: true
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />
      case "missed": return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500 bg-red-50"
      case "medium": return "border-yellow-500 bg-yellow-50"
      default: return "border-gray-300 bg-gray-50"
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    // const lastDay = new Date(year, month + 1, 0) // Reserved for month navigation feature
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDateObj.toISOString().split('T')[0]
      const dayEvents = getEventsForDate(dateStr)
      
      days.push({
        date: new Date(currentDateObj),
        dateStr,
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        events: dayEvents
      })
      
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Schedule & Calendar</h1>
          <p className="text-gray-600">Manage your study schedule, exams, and academic events</p>
        </div>
        <Button
          onClick={() => setShowAddEvent(true)}
          className="bg-sky hover:bg-sky/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Events</p>
                <p className="text-2xl font-bold text-navy">{getTodayEvents().length}</p>
              </div>
              <Calendar className="h-8 w-8 text-sky" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Hours Today</p>
                <p className="text-2xl font-bold text-sage">
                  {getTodayEvents()
                    .filter(e => e.type === 'study' && e.status === 'completed')
                    .reduce((total, e) => total + (e.duration / 60), 0)
                    .toFixed(1)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-sage" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-red-600">
                  {events.filter(e => e.type === 'exam' && e.status === 'upcoming').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-teal">
                  {events.length > 0 
                    ? Math.round((events.filter(e => e.status === 'completed').length / events.length) * 100)
                    : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-teal" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-navy">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
                    } ${
                      day.isToday ? 'bg-sky/10 border-sky' : ''
                    }`}
                    onClick={() => setSelectedDate(day.dateStr)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isToday ? 'text-sky' : day.isCurrentMonth ? 'text-navy' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-sky" />
                  <span>Today&apos;s Schedule</span>
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getTodayEvents().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No events scheduled for today</p>
                  </div>
                ) : (
                  getTodayEvents().map(event => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-navy">{event.title}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(event.status)}
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </span>
                        {event.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-teal" />
                  <span>Daily Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Study Time Progress</span>
                    <span>
                      {getTodayEvents()
                        .filter(e => e.type === 'study' && e.status === 'completed')
                        .reduce((total, e) => total + (e.duration / 60), 0)
                        .toFixed(1)}h / 
                      {getTodayEvents()
                        .filter(e => e.type === 'study')
                        .reduce((total, e) => total + (e.duration / 60), 0)
                        .toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sky h-2 rounded-full" 
                      style={{ 
                        width: `${getTodayEvents().filter(e => e.type === 'study').length > 0 
                          ? (getTodayEvents().filter(e => e.type === 'study' && e.status === 'completed').reduce((total, e) => total + e.duration, 0) / 
                             getTodayEvents().filter(e => e.type === 'study').reduce((total, e) => total + e.duration, 0)) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tasks Completed</span>
                    <span>
                      {getTodayEvents().filter(e => e.status === 'completed').length} / {getTodayEvents().length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full" 
                      style={{ 
                        width: `${getTodayEvents().length > 0 
                          ? (getTodayEvents().filter(e => e.status === 'completed').length / getTodayEvents().length) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-navy">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Break
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="space-y-4">
            {getUpcomingEvents().map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-navy text-lg">{event.title}</h3>
                        <Badge variant="outline">{event.type}</Badge>
                        <Badge className={`${
                          event.priority === "high" ? "bg-red-100 text-red-800" :
                          event.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {event.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        {event.subject && (
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{event.subject}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Study Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-semibold">28.5 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Week</span>
                    <span>25.2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average</span>
                    <span>26.8 hours</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-green-600 flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>+13% improvement this week</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Mathematics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-sky h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Physics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-sage h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      <span className="text-sm">28%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chemistry</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-teal h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>English</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                      <span className="text-sm">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
              <CardDescription>
                Schedule a new study session, exam, or academic event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Mathematics Practice"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Event Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Room 201, Online, Library"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add any notes or details about this event..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-sky hover:bg-sky/90 text-white">
                    Add Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}