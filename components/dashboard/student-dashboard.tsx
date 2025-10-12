"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import {
  Brain,
  TrendingUp,
  Target,
  Calendar,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  GraduationCap,
  Lightbulb,
  BookMarked,
  Timer,
  Plus,
  Edit
} from "lucide-react"

interface StudentData {
  currentGPA?: number
  predictedBoardScore?: number
  confidence?: number
  subjects?: Array<{
    id: string
    name: string
    current: number
    predicted: number
    trend: string
    color: string
  }>
  recentTests?: Array<{
    subject: string
    score: number
    maxScore: number
    date: string
    type: string
  }>
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState<StudentData>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadStudentData = useCallback(async () => {
    try {
      setIsLoading(true)
      // In a real app, this would fetch from your backend API
      // For now, we'll check if user has any saved data in localStorage
      let savedData = localStorage.getItem(`studentData_${user?.email || user?.name}`)
      
      // Try to find data with different keys if not found
      if (!savedData && user?.name) {
        // Look for data saved with name + class pattern
        for (let i = 1; i <= 12; i++) {
          const key = `studentData_${user.name}_${i}`
          const data = localStorage.getItem(key)
          if (data) {
            savedData = data
            break
          }
        }
      }
      
      if (savedData) {
        setStudentData(JSON.parse(savedData))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load student data:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    // Load user's academic data
    loadStudentData()
  }, [loadStudentData])

  const hasData = studentData.subjects && studentData.subjects.length > 0

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

  const subjects = studentData.subjects || []
  const recentTests = studentData.recentTests || []
  
  // Generate study recommendations based on user's data
  const studyRecommendations = subjects.length > 0 ? subjects
    .filter(subject => subject.current < 80)
    .map(subject => ({
      subject: subject.name,
      topic: "Focus on weak areas",
      priority: subject.current < 70 ? "High" : "Medium",
      estimatedTime: "1-2 hours",
      reason: `Current score: ${subject.current}% - Needs improvement`
    }))
    .slice(0, 3) : []

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">
              {user?.currentClass ? `Class ${user.currentClass}` : 'Student'} • 
              {user?.schoolName || 'CBSE Board'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {hasData ? (
              <Badge variant="secondary" className="px-3 py-1 bg-sage text-white">
                <GraduationCap className="h-4 w-4 mr-2" />
                Profile Complete
              </Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1">
                <Edit className="h-4 w-4 mr-2" />
                Setup Required
              </Badge>
            )}
            <Button className="bg-sky hover:bg-sky/90 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              {hasData ? 'Schedule Study' : 'Get Started'}
            </Button>
          </div>
        </div>

        {/* Key Metrics or Setup Prompt */}
        {!hasData ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-sky" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Complete Your Academic Profile</h3>
                  <p className="text-gray-600 mt-2 max-w-md">
                    Add your subjects and recent test scores to get personalized AI predictions and study recommendations.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-sky hover:bg-sky/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subjects & Scores
                  </Button>
                  <Button variant="outline">
                    Import from School Portal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="professional-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-sky">Current GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">
                  {studentData.currentGPA?.toFixed(1) || '--'}
                </div>
                <p className="text-xs text-gray-600 mt-1">Out of 10.0</p>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-sage">Predicted Board Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">
                  {studentData.predictedBoardScore ? `${studentData.predictedBoardScore}%` : '--'}
                </div>
                <p className="text-xs text-gray-600 mt-1">AI Prediction</p>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal">Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">
                  {studentData.confidence ? `${studentData.confidence}%` : '--'}
                </div>
                <p className="text-xs text-gray-600 mt-1">Prediction Accuracy</p>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow">Days to Board Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy">127</div>
                <p className="text-xs text-gray-600 mt-1">March 2025</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {hasData ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="recommendations">Study Plan</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription>Current vs Predicted Board Scores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{subject.current}%</span>
                          <TrendingUp className={`h-4 w-4 ${subject.trend === 'up' ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className="text-sm font-semibold">{subject.predicted}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Progress value={subject.current} className="flex-1" />
                        <Progress value={subject.predicted} className="flex-1 opacity-60" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookMarked className="h-5 w-5 mr-2" />
                    Recent Test Results
                  </CardTitle>
                  <CardDescription>Your latest assessment scores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{test.subject}</p>
                        <p className="text-sm text-muted-foreground">{test.type} • {test.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{test.score}/{test.maxScore}</p>
                        <p className="text-sm text-muted-foreground">{Math.round((test.score/test.maxScore)*100)}%</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Study Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Study Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions to improve your board exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {studyRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                          {rec.priority} Priority
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Timer className="h-4 w-4 mr-1" />
                          {rec.estimatedTime}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{rec.subject}</h4>
                        <p className="text-sm font-medium text-primary">{rec.topic}</p>
                        <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                      <Button size="sm" className="w-full">
                        Start Studying
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                    </div>
                    <CardDescription>Current Performance Analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Score</span>
                        <span className="font-semibold">{subject.current}%</span>
                      </div>
                      <Progress value={subject.current} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Predicted Board Score</span>
                        <span className="font-semibold text-green-600">{subject.predicted}%</span>
                      </div>
                      <Progress value={subject.predicted} className="opacity-60" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline">
                        {subject.trend === 'up' ? '↗️ Improving' : '➡️ Stable'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Performance Predictions
                </CardTitle>
                <CardDescription>
                  Based on your current performance and 50,000+ CBSE student data points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Board Exam Predictions</h3>
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">Confidence: 94%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{subject.predicted}%</p>
                          <p className="text-xs text-muted-foreground">Expected Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Improvement Opportunities</h3>
                    <div className="space-y-3">
                      <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
                          <span className="font-medium text-orange-800">Physics - Focus Area</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          Electromagnetic Induction needs attention. Potential 6-point improvement possible.
                        </p>
                      </div>
                      <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Target className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">Mathematics - Optimization</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Strong performance. Focus on Integration for 3-point boost.
                        </p>
                      </div>
                      <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Computer Science - Excellent</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Outstanding performance. Maintain current study pattern.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today&apos;s Study Plan</CardTitle>
                    <CardDescription>AI-optimized schedule for maximum learning efficiency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { time: "9:00 AM - 10:30 AM", subject: "Physics", topic: "Electromagnetic Induction", type: "New Concept" },
                      { time: "11:00 AM - 12:00 PM", subject: "Mathematics", topic: "Integration Practice", type: "Problem Solving" },
                      { time: "2:00 PM - 3:00 PM", subject: "Chemistry", topic: "Coordination Compounds", type: "Revision" },
                      { time: "4:00 PM - 5:00 PM", subject: "English", topic: "Essay Writing", type: "Practice" }
                    ].map((session, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{session.subject} - {session.topic}</p>
                            <Badge variant="outline">{session.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{session.time}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Study Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">12</div>
                      <p className="text-sm text-muted-foreground">Days in a row</p>
                      <div className="flex justify-center mt-4">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Study Hours</span>
                        <span>28/35</span>
                      </div>
                      <Progress value={80} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Practice Tests</span>
                        <span>3/5</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revision Sessions</span>
                        <span>4/4</span>
                      </div>
                      <Progress value={100} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your academic progress over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Performance chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Analytics</CardTitle>
                  <CardDescription>Insights into your learning patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">4.2</div>
                      <p className="text-sm text-muted-foreground">Avg Study Hours/Day</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">87%</div>
                      <p className="text-sm text-muted-foreground">Goal Completion</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Most Productive Time</span>
                        <span className="font-medium">9-11 AM</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Strongest Subject</span>
                        <span className="font-medium">Computer Science</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Focus Area</span>
                        <span className="font-medium">Physics</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookMarked className="h-5 w-5 mr-2" />
                  Getting Started Guide
                </CardTitle>
                <CardDescription>Follow these steps to set up your personalized learning dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookMarked className="h-6 w-6 text-sky" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Add Your Subjects</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select the subjects you&apos;re currently studying in your class.
                    </p>
                    <Button size="sm" className="bg-sky hover:bg-sky/90 text-white">
                      Add Subjects
                    </Button>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-sage" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Enter Test Scores</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add your recent test scores to get accurate predictions.
                    </p>
                    <Button size="sm" variant="outline">
                      Add Scores
                    </Button>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-6 w-6 text-teal" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Get AI Insights</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Receive personalized study recommendations and predictions.
                    </p>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Features</CardTitle>
                  <CardDescription>Here&apos;s what you&apos;ll see once you add your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Performance Predictions</p>
                        <p className="text-sm text-gray-600">AI-powered board exam score predictions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Personalized Study Plans</p>
                        <p className="text-sm text-gray-600">Custom recommendations based on your performance</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Progress Tracking</p>
                        <p className="text-sm text-gray-600">Monitor your improvement over time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Start building your academic profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-sky hover:bg-sky/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Complete Academic Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Sample Study Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Learn About AI Predictions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookMarked className="h-4 w-4 mr-2" />
                    Browse Study Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}