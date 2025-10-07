"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Target,
  Brain,
  BookOpen,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Timer,
  Star,
  Award,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react"

interface StudySession {
  id: string
  subject: string
  topic: string
  duration: number
  difficulty: "easy" | "medium" | "hard"
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed" | "skipped"
  aiRecommended: boolean
  estimatedScore?: number
  actualScore?: number
  notes?: string
}

interface StudyPlan {
  date: string
  sessions: StudySession[]
  totalDuration: number
  completed: number
  aiOptimized: boolean
}

export default function SmartStudyPlanner() {
  const [activeTab, setActiveTab] = useState("today")
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [studyPlans, setStudyPlans] = useState<Record<string, StudyPlan>>({})

  // Sample data
  const todaysPlan: StudyPlan = {
    date: "2025-01-19",
    sessions: [
      {
        id: "1",
        subject: "Mathematics",
        topic: "Integration by Parts",
        duration: 45,
        difficulty: "hard",
        priority: "high",
        status: "completed",
        aiRecommended: true,
        estimatedScore: 85,
        actualScore: 88
      },
      {
        id: "2",
        subject: "Physics",
        topic: "Newton's Laws Review",
        duration: 30,
        difficulty: "medium",
        priority: "high",
        status: "in-progress",
        aiRecommended: true,
        estimatedScore: 78
      },
      {
        id: "3",
        subject: "Chemistry",
        topic: "Organic Reactions",
        duration: 60,
        difficulty: "hard",
        priority: "medium",
        status: "pending",
        aiRecommended: true,
        estimatedScore: 82
      },
      {
        id: "4",
        subject: "English",
        topic: "Essay Writing Practice",
        duration: 40,
        difficulty: "medium",
        priority: "low",
        status: "pending",
        aiRecommended: false
      }
    ],
    totalDuration: 175,
    completed: 1,
    aiOptimized: true
  }

  const weeklyGoals = [
    {
      subject: "Mathematics",
      target: "Complete Calculus Chapter",
      progress: 75,
      deadline: "Jan 25",
      priority: "high"
    },
    {
      subject: "Physics",
      target: "Master Mechanics Problems",
      progress: 60,
      deadline: "Jan 27",
      priority: "high"
    },
    {
      subject: "Chemistry",
      target: "Organic Chemistry Revision",
      progress: 40,
      deadline: "Jan 30",
      priority: "medium"
    }
  ]

  const aiRecommendations = [
    {
      type: "focus",
      title: "Focus on Physics Today",
      description: "Your recent test scores suggest spending extra time on mechanics problems.",
      action: "Add 30min Physics session",
      impact: "+5% predicted score"
    },
    {
      type: "timing",
      title: "Optimal Study Time",
      description: "Your performance is 23% better when studying Math between 9-11 AM.",
      action: "Reschedule Math session",
      impact: "Better retention"
    },
    {
      type: "break",
      title: "Take a Break",
      description: "You've been studying for 2 hours. A 15-minute break will improve focus.",
      action: "Start break timer",
      impact: "Maintain productivity"
    }
  ]

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      // Handle session completion
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  const startSession = (session: StudySession) => {
    setCurrentSession(session)
    setTimer(session.duration * 60) // Convert minutes to seconds
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimer(currentSession ? currentSession.duration * 60 : 0)
  }

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(seconds)) // Ensure non-negative integer
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 border-red-600"
      case "medium": return "text-yellow-600 border-yellow-600"
      default: return "text-gray-600 border-gray-600"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "hard": return "text-red-600"
      case "medium": return "text-yellow-600"
      default: return "text-green-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Session Timer */}
      {currentSession && (
        <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy mb-1">
                  {currentSession.subject} - {currentSession.topic}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Duration: {currentSession.duration} min</span>
                  <Badge variant="outline" className={getDifficultyColor(currentSession.difficulty)}>
                    {currentSession.difficulty}
                  </Badge>
                  {currentSession.aiRecommended && (
                    <Badge variant="outline" className="text-sky border-sky">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Recommended
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-navy mb-2">{formatTime(timer)}</div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={pauseTimer}
                    variant={isTimerRunning ? "outline" : "default"}
                  >
                    {isTimerRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Progress 
              value={((currentSession.duration * 60 - timer) / (currentSession.duration * 60)) * 100} 
              className="mt-4"
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-navy">{todaysPlan.sessions.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-sky" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-sage">{todaysPlan.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-sage" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="text-2xl font-bold text-teal">{todaysPlan.totalDuration}m</p>
                  </div>
                  <Timer className="h-8 w-8 text-teal" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {todaysPlan.sessions.map((session) => (
              <Card key={session.id} className={
                session.status === "completed" ? "bg-sage/5 border-sage/20" :
                session.status === "in-progress" ? "bg-sky/5 border-sky/20" :
                "bg-white"
              }>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-navy">{session.subject}</h3>
                        <Badge variant="outline" className={getPriorityColor(session.priority)}>
                          {session.priority}
                        </Badge>
                        {session.aiRecommended && (
                          <Badge variant="outline" className="text-sky border-sky">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        {session.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-sage" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{session.topic}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.duration} min
                        </span>
                        <span className={`font-medium ${getDifficultyColor(session.difficulty)}`}>
                          {session.difficulty}
                        </span>
                        {session.estimatedScore && (
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            Target: {session.estimatedScore}%
                          </span>
                        )}
                        {session.actualScore && (
                          <span className="flex items-center text-sage">
                            <Star className="h-3 w-3 mr-1" />
                            Scored: {session.actualScore}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.status === "pending" && (
                        <Button onClick={() => startSession(session)}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      {session.status === "in-progress" && (
                        <Button variant="outline" onClick={() => startSession(session)}>
                          <Timer className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {session.status === "completed" && (
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <div className="grid gap-4">
            {weeklyGoals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-navy">{goal.subject}</h3>
                      <p className="text-gray-600">{goal.target}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                        Due {goal.deadline}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <Card key={index} className="border-sky/20 bg-sky/5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-sky mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-navy mb-1">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center space-x-3">
                          <Button size="sm" className="bg-sky hover:bg-sky/90">
                            <Zap className="h-3 w-3 mr-1" />
                            {rec.action}
                          </Button>
                          <span className="text-xs text-sage font-medium">{rec.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Study Session</CardTitle>
              <CardDescription>
                Add a new study session to your plan or let AI optimize your schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input type="number" placeholder="45" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input placeholder="e.g., Integration by Parts" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea placeholder="Any specific goals or notes for this session..." />
              </div>
              
              <div className="flex space-x-3">
                <Button className="bg-sky hover:bg-sky/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
                <Button variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Let AI Optimize
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}