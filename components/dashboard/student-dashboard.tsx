"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Timer
} from "lucide-react"

export default function StudentDashboard() {
  const selectedSubject = "mathematics"

  // Mock data for demonstration
  const studentData = {
    name: "Arjun Sharma",
    class: "12",
    board: "CBSE",
    currentGPA: 8.2,
    predictedBoardScore: 89,
    confidence: 94
  }

  const subjects = [
    { id: "mathematics", name: "Mathematics", current: 85, predicted: 92, trend: "up", color: "bg-blue-500" },
    { id: "physics", name: "Physics", current: 78, predicted: 84, trend: "up", color: "bg-green-500" },
    { id: "chemistry", name: "Chemistry", current: 82, predicted: 88, trend: "up", color: "bg-purple-500" },
    { id: "english", name: "English", current: 88, predicted: 90, trend: "stable", color: "bg-orange-500" },
    { id: "computer", name: "Computer Science", current: 92, predicted: 95, trend: "up", color: "bg-cyan-500" }
  ]

  const recentTests = [
    { subject: "Mathematics", score: 87, maxScore: 100, date: "2024-01-15", type: "Unit Test" },
    { subject: "Physics", score: 76, maxScore: 100, date: "2024-01-12", type: "Mid-term" },
    { subject: "Chemistry", score: 84, maxScore: 100, date: "2024-01-10", type: "Unit Test" }
  ]

  const studyRecommendations = [
    {
      subject: "Physics",
      topic: "Electromagnetic Induction",
      priority: "High",
      estimatedTime: "2 hours",
      reason: "Low performance in recent tests"
    },
    {
      subject: "Mathematics",
      topic: "Integration Applications",
      priority: "Medium",
      estimatedTime: "1.5 hours",
      reason: "Board exam weightage: 8 marks"
    },
    {
      subject: "Chemistry",
      topic: "Coordination Compounds",
      priority: "Medium",
      estimatedTime: "1 hour",
      reason: "Revision needed for board prep"
    }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {studentData.name}!</h1>
            <p className="text-muted-foreground">Class {studentData.class} • {studentData.board} Board</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1 bg-sage text-white">
              <GraduationCap className="h-4 w-4 mr-2" />
              Board Exam Ready
            </Badge>
            <Button className="bg-sky hover:bg-sky/90 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Study
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="professional-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sky">Current GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy">{studentData.currentGPA}</div>
              <p className="text-xs text-gray-600 mt-1">Out of 10.0</p>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sage">Predicted Board Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy">{studentData.predictedBoardScore}%</div>
              <p className="text-xs text-gray-600 mt-1">AI Prediction</p>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal">Confidence Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy">{studentData.confidence}%</div>
              <p className="text-xs text-gray-600 mt-1">Prediction Accuracy</p>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow">Days to Board Exam</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy">127</div>
              <p className="text-xs text-gray-600 mt-1">March 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
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
      </div>
    </div>
  )
}