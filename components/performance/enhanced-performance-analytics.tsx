"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Brain,
  Users,
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus
} from "lucide-react"

interface SubjectPerformance {
  subject: string
  currentScore: number
  previousScore: number
  trend: "up" | "down" | "stable"
  improvement: number
  predictedBoard: number
  confidence: number
  rank: number
  totalStudents: number
  strengths: string[]
  weaknesses: string[]
}

interface TimeSeriesData {
  month: string
  mathematics: number
  physics: number
  chemistry: number
  english: number
  average: number
}

export default function EnhancedPerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedSubject, setSelectedSubject] = useState("all")

  // Load user's performance data
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPerformanceData()
  }, [])

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true)
      // Try to load user's saved data from localStorage
      const keys = Object.keys(localStorage).filter(key => key.startsWith('studentData_'))
      
      if (keys.length > 0) {
        const savedData = localStorage.getItem(keys[0])
        if (savedData) {
          const data = JSON.parse(savedData)
          if (data.subjects) {
            // Convert dashboard data to performance format
            const performanceData: SubjectPerformance[] = data.subjects.map((subject: any) => ({
              subject: subject.name,
              currentScore: subject.current,
              previousScore: Math.max(0, subject.current - Math.random() * 10), // Simulate previous score
              trend: subject.trend,
              improvement: subject.predicted - subject.current,
              predictedBoard: subject.predicted,
              confidence: 85 + Math.random() * 10, // Random confidence between 85-95%
              rank: Math.floor(Math.random() * 50) + 1,
              totalStudents: 120,
              strengths: ["Topic 1", "Topic 2"],
              weaknesses: ["Area for improvement"]
            }))
            setSubjectPerformance(performanceData)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load performance data:', error)
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
              <p className="text-gray-600">Loading performance analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (subjectPerformance.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
              <p className="text-muted-foreground">Track your academic progress and get insights</p>
            </div>
          </div>
          
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-sky" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">No Performance Data Available</h3>
                  <p className="text-gray-600 mt-2 max-w-md">
                    Complete your academic profile first to see detailed performance analytics and AI-powered insights.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-sky hover:bg-sky/90 text-white" onClick={() => window.location.href = '/predictions'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your Academic Data
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }



  // Commented out unused timeSeriesData
  // const timeSeriesData: TimeSeriesData[] = [
  //   { month: "Aug", mathematics: 75, physics: 72, chemistry: 78, english: 80, average: 76.25 },
  //   { month: "Sep", mathematics: 78, physics: 75, chemistry: 80, english: 81, average: 78.5 },
  //   { month: "Oct", mathematics: 82, physics: 78, chemistry: 82, english: 82, average: 81 },
  //   { month: "Nov", mathematics: 85, physics: 80, chemistry: 83, english: 82, average: 82.5 },
  //   { month: "Dec", mathematics: 87, physics: 82, chemistry: 84, english: 82, average: 83.75 },
  //   { month: "Jan", mathematics: 88, physics: 78, chemistry: 85, english: 82, average: 83.25 }
  // ]

  const overallStats = {
    averageScore: 83.25,
    improvement: 7,
    predictedAverage: 86.5,
    overallRank: 28,
    totalStudents: 120,
    studyStreak: 15,
    completedGoals: 8,
    totalGoals: 12
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-600"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "text-green-600 bg-green-100" }
    if (score >= 80) return { level: "Good", color: "text-blue-600 bg-blue-100" }
    if (score >= 70) return { level: "Average", color: "text-yellow-600 bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600 bg-red-100" }
  }

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-800">Sample Analytics</h3>
            <p className="text-sm text-purple-700">
              This shows example performance data. Connect your academic records to see real analytics and AI-powered insights about your progress.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Performance Analytics</h1>
          <p className="text-gray-600">Comprehensive analysis of your academic progress and predictions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Average</p>
                <p className="text-2xl font-bold text-navy">{overallStats.averageScore}%</p>
                <div className="flex items-center space-x-1 text-sm">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{overallStats.improvement}%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-sky" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Predicted Board</p>
                <p className="text-2xl font-bold text-sage">{overallStats.predictedAverage}%</p>
                <div className="flex items-center space-x-1 text-sm">
                  <Target className="h-3 w-3 text-sage" />
                  <span className="text-sage">92% confidence</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-sage" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Class Rank</p>
                <p className="text-2xl font-bold text-teal">#{overallStats.overallRank}</p>
                <div className="text-sm text-gray-600">
                  of {overallStats.totalStudents} students
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-yellow">{overallStats.studyStreak} days</p>
                <div className="text-sm text-gray-600">
                  Keep it up!
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-sky" />
                  <span>Current Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectPerformance.map((subject) => {
                  const performance = getPerformanceLevel(subject.currentScore)
                  return (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-navy">{subject.subject}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={performance.color}>
                            {performance.level}
                          </Badge>
                          <span className="font-semibold">{subject.currentScore}%</span>
                        </div>
                      </div>
                      <Progress value={subject.currentScore} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-sage" />
                  <span>Board Exam Predictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-navy">{subject.subject}</p>
                      <p className="text-sm text-gray-600">{subject.confidence}% confidence</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-sage">{subject.predictedBoard}%</div>
                      <div className="flex items-center space-x-1 text-sm">
                        {getTrendIcon(subject.trend)}
                        <span className={getTrendColor(subject.trend)}>
                          {subject.improvement > 0 ? "+" : ""}{subject.improvement}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-teal" />
                <span>Goals Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {overallStats.completedGoals} of {overallStats.totalGoals} goals completed
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((overallStats.completedGoals / overallStats.totalGoals) * 100)}%
                </span>
              </div>
              <Progress 
                value={(overallStats.completedGoals / overallStats.totalGoals) * 100} 
                className="h-3"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Maintain 85%+ average</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Complete all assignments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Improve Physics by 10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectPerformance.map(subject => (
                  <SelectItem key={subject.subject} value={subject.subject.toLowerCase()}>
                    {subject.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {subjectPerformance.map((subject) => (
              <Card key={subject.subject} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-navy">{subject.subject}</h3>
                      <p className="text-gray-600">Rank #{subject.rank} of {subject.totalStudents}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-navy">{subject.currentScore}%</div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(subject.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(subject.trend)}`}>
                          {subject.improvement > 0 ? "+" : ""}{subject.improvement}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-navy mb-3">Current Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Score</span>
                          <span>{subject.currentScore}%</span>
                        </div>
                        <Progress value={subject.currentScore} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Previous Score</span>
                          <span>{subject.previousScore}%</span>
                        </div>
                        <Progress value={subject.previousScore} className="h-2 opacity-50" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-navy mb-3">Strengths</h4>
                      <div className="space-y-2">
                        {subject.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-navy mb-3">Areas to Improve</h4>
                      <div className="space-y-2">
                        {subject.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                            <span className="text-sm">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-sage/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy">Board Exam Prediction</p>
                        <p className="text-sm text-gray-600">{subject.confidence}% confidence level</p>
                      </div>
                      <div className="text-2xl font-bold text-sage">{subject.predictedBoard}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
              <CardDescription>
                Track your progress across all subjects over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive chart showing performance trends</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mathematics: 75% → 88% (+13%)
                    <br />
                    Physics: 72% → 78% (+6%)
                    <br />
                    Chemistry: 78% → 85% (+7%)
                    <br />
                    English: 80% → 82% (+2%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Months</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">January 2025</span>
                  <Badge className="bg-green-100 text-green-800">88% avg</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">December 2024</span>
                  <Badge className="bg-blue-100 text-blue-800">87% avg</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">November 2024</span>
                  <Badge className="bg-yellow-100 text-yellow-800">85% avg</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Physics</span>
                  <Badge className="bg-red-100 text-red-800">-7% this month</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">English</span>
                  <Badge className="bg-yellow-100 text-yellow-800">No change</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Mathematics</span>
                  <Badge className="bg-green-100 text-green-800">+6% improvement</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-sky/20 bg-sky/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Brain className="h-6 w-6 text-sky mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-2">AI Performance Analysis</h3>
                    <p className="text-gray-700 mb-4">
                      Based on your recent performance data, our AI has identified key patterns and recommendations 
                      to help you achieve your board exam goals.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow mt-0.5" />
                        <span className="text-sm">
                          <strong>Strength:</strong> Your Mathematics performance shows consistent improvement (+13% over 6 months). 
                          Continue focusing on advanced calculus problems.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm">
                          <strong>Concern:</strong> Physics scores dropped 7% this month. Recommend additional 
                          practice in Optics and Modern Physics chapters.
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-sage mt-0.5" />
                        <span className="text-sm">
                          <strong>Opportunity:</strong> With focused effort on Physics, you can achieve 
                          90%+ average and improve your predicted board score to 88%.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-teal" />
                    <span>Peer Comparison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-teal/10 rounded-lg">
                    <div className="text-2xl font-bold text-teal">Top 25%</div>
                    <div className="text-sm text-gray-600">You&apos;re performing better than 75% of your peers</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Average</span>
                      <span className="font-semibold">83.25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Class Average</span>
                      <span>76.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Top Performer</span>
                      <span>94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-yellow" />
                    <span>Study Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow/10 rounded-lg">
                    <p className="font-medium text-navy">This Week&apos;s Focus</p>
                    <p className="text-sm text-gray-600">Physics - Optics and Wave Theory</p>
                  </div>
                  <div className="p-3 bg-sage/10 rounded-lg">
                    <p className="font-medium text-navy">Revision Priority</p>
                    <p className="text-sm text-gray-600">Mathematics - Integration by Parts</p>
                  </div>
                  <div className="p-3 bg-sky/10 rounded-lg">
                    <p className="font-medium text-navy">Practice Tests</p>
                    <p className="text-sm text-gray-600">Chemistry - Organic Reactions Mock</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}