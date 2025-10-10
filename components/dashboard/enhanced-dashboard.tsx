"use client"

import { useState, useEffect } from "react"
import EmptyStateDashboard from "./empty-state-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Target,
  Calendar,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Star,
  Timer,
  BookMarked,
  Plus
} from "lucide-react"

interface SubjectPerformance {
  subject: string
  current: number
  predicted: number
  trend: "up" | "down" | "stable"
  confidence: number
  lastUpdated: string
}

interface StudySession {
  subject: string
  duration: number
  completed: boolean
  date: string
  score?: number
}

interface SavedSubjectData {
  name: string
  current: number
  predicted: number
  trend: "up" | "down" | "stable"
}

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [studyStreak] = useState(0) // Default to 0 for new users
  const [todayProgress] = useState(0) // Default to 0 for new users
  const [isNewUser, setIsNewUser] = useState(true) // Check if user is new
  const [hasAcademicData, setHasAcademicData] = useState(false)
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      // Try to load user's saved data from localStorage
      const keys = Object.keys(localStorage).filter(key => key.startsWith('studentData_'))
      
      if (keys.length > 0) {
        const savedData = localStorage.getItem(keys[0])
        if (savedData) {
          const data = JSON.parse(savedData)
          if (data.subjects && data.subjects.length > 0) {
            setHasAcademicData(true)
            setSubjectPerformance(data.subjects.map((subject: SavedSubjectData) => ({
              subject: subject.name,
              current: subject.current,
              predicted: subject.predicted,
              trend: subject.trend,
              confidence: 85 + Math.random() * 10, // Random confidence
              lastUpdated: "Recently"
            })))
          }
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
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
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty state for users without academic data
  if (!hasAcademicData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Enhanced Dashboard</h1>
              <p className="text-muted-foreground">Your comprehensive academic overview</p>
            </div>
          </div>
          
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-sky" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Complete Your Academic Profile</h3>
                  <p className="text-gray-600 mt-2 max-w-md">
                    Add your academic data to unlock advanced analytics, AI predictions, and personalized insights.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-sky hover:bg-sky/90 text-white" onClick={() => window.location.href = '/predictions'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Academic Data
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Go to Basic Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }



  const recentSessions: StudySession[] = hasAcademicData ? [
    {
      subject: "Mathematics",
      duration: 45,
      completed: true,
      date: "Today",
      score: 88
    },
    {
      subject: "Physics",
      duration: 30,
      completed: true,
      date: "Today",
      score: 82
    },
    {
      subject: "Chemistry",
      duration: 60,
      completed: false,
      date: "Today"
    }
  ] : []

  const aiInsights = [
    {
      type: "urgent",
      title: "Physics Mechanics Needs Attention",
      description: "Your recent test scores show a 15% drop in mechanics problems. Focus on Newton&apos;s laws.",
      action: "Start Practice",
      priority: "high"
    },
    {
      type: "opportunity",
      title: "Mathematics Streak Building",
      description: "You&apos;ve improved 12% in calculus over the past week. Keep the momentum!",
      action: "Continue Practice",
      priority: "medium"
    },
    {
      type: "reminder",
      title: "Chemistry Revision Due",
      description: "It&apos;s been 3 days since your last organic chemistry session.",
      action: "Schedule Review",
      priority: "low"
    }
  ]

  const upcomingTasks = [
    {
      task: "Complete Physics Assignment",
      subject: "Physics",
      due: "Tomorrow",
      priority: "high",
      estimated: "2 hours"
    },
    {
      task: "Math Practice Test",
      subject: "Mathematics",
      due: "2 days",
      priority: "medium",
      estimated: "1.5 hours"
    },
    {
      task: "Chemistry Lab Report",
      subject: "Chemistry",
      due: "3 days",
      priority: "medium",
      estimated: "1 hour"
    }
  ]

  // Show empty state for new users
  if (isNewUser && !hasAcademicData) {
    return <EmptyStateDashboard userName="Student" onStartSetup={() => setIsNewUser(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Real-time Progress Banner */}
      <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy mb-2">Today&apos;s Progress</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-sky" />
                  <span className="text-sm">2h 15m studied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow" />
                  <span className="text-sm">{studyStreak} day streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-sage" />
                  <span className="text-sm">3/5 goals completed</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-navy">{todayProgress}%</div>
              <Progress value={todayProgress} className="w-32 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
                <BarChart3 className="h-4 w-4 text-sky" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">81.6%</div>
                <div className="flex items-center text-xs text-sage">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +3.2% this week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Board Prediction</CardTitle>
                <TrendingUp className="h-4 w-4 text-sage" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">85.6%</div>
                <div className="flex items-center text-xs text-sky">
                  <Star className="h-3 w-3 mr-1" />
                  92% confidence
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-teal" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">4.2h</div>
                <div className="text-xs text-gray-600">Daily average</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rank</CardTitle>
                <Award className="h-4 w-4 text-yellow" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">#23</div>
                <div className="text-xs text-gray-600">In your class</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookMarked className="h-5 w-5 text-sky" />
                  <span>Recent Study Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-navy">{session.subject}</p>
                      <p className="text-sm text-gray-600">{session.duration} min • {session.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.completed ? (
                        <>
                          <Badge variant="outline" className="text-sage border-sage">
                            {session.score}%
                          </Badge>
                          <CheckCircle className="h-4 w-4 text-sage" />
                        </>
                      ) : (
                        <Clock className="h-4 w-4 text-yellow" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-teal" />
                  <span>Upcoming Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-navy">{task.task}</p>
                      <p className="text-sm text-gray-600">{task.subject} • Due {task.due}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={
                          task.priority === "high" ? "text-red-600 border-red-600" :
                          task.priority === "medium" ? "text-yellow-600 border-yellow-600" :
                          "text-gray-600 border-gray-600"
                        }
                      >
                        {task.estimated}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4">
            {subjectPerformance.map((subject, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-navy">{subject.subject}</h3>
                      <p className="text-sm text-gray-600">Updated {subject.lastUpdated}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {subject.trend === "up" && <ArrowUp className="h-4 w-4 text-sage" />}
                      {subject.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                      {subject.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                      <Badge variant="outline">{subject.confidence}% confidence</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Score</p>
                      <div className="text-2xl font-bold text-navy">{subject.current}%</div>
                      <Progress value={subject.current} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Predicted Board Score</p>
                      <div className="text-2xl font-bold text-sky">{subject.predicted}%</div>
                      <Progress value={subject.predicted} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className={
                insight.priority === "high" ? "border-red-200 bg-red-50/50" :
                insight.priority === "medium" ? "border-yellow-200 bg-yellow-50/50" :
                "border-gray-200 bg-gray-50/50"
              }>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {insight.type === "urgent" && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                      {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-sage mt-0.5" />}
                      {insight.type === "reminder" && <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />}
                      <div>
                        <h3 className="font-semibold text-navy mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <Button 
                          size="sm" 
                          variant={insight.priority === "high" ? "default" : "outline"}
                          className={insight.priority === "high" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      insight.priority === "high" ? "text-red-600 border-red-600" :
                      insight.priority === "medium" ? "text-yellow-600 border-yellow-600" :
                      "text-gray-600 border-gray-600"
                    }>
                      {insight.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-sky" />
                  <span>Today&apos;s Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sky/10 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">Mathematics Practice</p>
                    <p className="text-sm text-gray-600">9:00 AM - 10:30 AM</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-sage" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-sage/10 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">Physics Revision</p>
                    <p className="text-sm text-gray-600">11:00 AM - 12:00 PM</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-sage" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow/10 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">Chemistry Lab Work</p>
                    <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
                  </div>
                  <Clock className="h-4 w-4 text-yellow" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">English Essay Writing</p>
                    <p className="text-sm text-gray-600">4:00 PM - 5:00 PM</p>
                  </div>
                  <div className="h-4 w-4 bg-gray-400 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow" />
                  <span>Weekly Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Study 25 hours</span>
                    <span className="text-sm text-gray-600">18/25 hours</span>
                  </div>
                  <Progress value={72} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Complete 5 practice tests</span>
                    <span className="text-sm text-gray-600">3/5 tests</span>
                  </div>
                  <Progress value={60} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Review all subjects</span>
                    <span className="text-sm text-gray-600">4/6 subjects</span>
                  </div>
                  <Progress value={67} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Maintain study streak</span>
                    <span className="text-sm text-gray-600">{studyStreak} days</span>
                  </div>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}