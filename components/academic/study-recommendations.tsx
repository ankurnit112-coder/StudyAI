"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Lightbulb, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle, 
  Star,
  TrendingUp,
  Calendar,
  Timer,
  Brain,
  Award,
  AlertTriangle
} from "lucide-react"

export default function StudyRecommendations() {
  const [completedRecommendations, setCompletedRecommendations] = useState<number[]>([])

  const recommendations = [
    {
      id: 1,
      subject: "Physics",
      topic: "Electromagnetic Induction",
      priority: "High",
      estimatedTime: "2 hours",
      difficulty: "Medium",
      reason: "Low performance in recent tests (65%). Board exam weightage: 8 marks",
      chapters: ["Faraday's Law", "Lenz's Law", "Self and Mutual Inductance"],
      resources: ["NCERT Chapter 6", "Previous Year Questions", "Video Lectures"],
      expectedImprovement: "+6 marks",
      dueDate: "2024-01-20"
    },
    {
      id: 2,
      subject: "Mathematics",
      topic: "Integration Applications",
      priority: "Medium",
      estimatedTime: "1.5 hours",
      difficulty: "Hard",
      reason: "Strong foundation but needs practice. Board exam weightage: 10 marks",
      chapters: ["Area under curves", "Differential equations"],
      resources: ["RD Sharma", "Sample Papers", "Practice Problems"],
      expectedImprovement: "+4 marks",
      dueDate: "2024-01-22"
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Coordination Compounds",
      priority: "Medium",
      estimatedTime: "1 hour",
      difficulty: "Easy",
      reason: "Revision needed for board preparation. Board exam weightage: 5 marks",
      chapters: ["Nomenclature", "Isomerism", "Bonding"],
      resources: ["NCERT Chapter 9", "Quick Revision Notes"],
      expectedImprovement: "+3 marks",
      dueDate: "2024-01-25"
    },
    {
      id: 4,
      subject: "English",
      topic: "Essay Writing Techniques",
      priority: "Low",
      estimatedTime: "45 minutes",
      difficulty: "Easy",
      reason: "Good performance but can be optimized. Board exam weightage: 6 marks",
      chapters: ["Argumentative Essays", "Descriptive Writing"],
      resources: ["Writing Samples", "Grammar Guide"],
      expectedImprovement: "+2 marks",
      dueDate: "2024-01-28"
    }
  ]

  const studyPlan = [
    {
      day: "Monday",
      sessions: [
        { time: "9:00 AM - 11:00 AM", subject: "Physics", topic: "Electromagnetic Induction", type: "New Learning" },
        { time: "2:00 PM - 3:30 PM", subject: "Mathematics", topic: "Integration Practice", type: "Problem Solving" },
        { time: "7:00 PM - 8:00 PM", subject: "English", topic: "Reading Comprehension", type: "Practice" }
      ]
    },
    {
      day: "Tuesday", 
      sessions: [
        { time: "9:00 AM - 10:00 AM", subject: "Chemistry", topic: "Coordination Compounds", type: "Revision" },
        { time: "10:30 AM - 12:00 PM", subject: "Physics", topic: "Electromagnetic Induction", type: "Problem Solving" },
        { time: "3:00 PM - 4:00 PM", subject: "Mathematics", topic: "Previous Year Questions", type: "Practice" }
      ]
    },
    {
      day: "Wednesday",
      sessions: [
        { time: "9:00 AM - 10:30 AM", subject: "Mathematics", topic: "Integration Applications", type: "New Learning" },
        { time: "2:00 PM - 3:00 PM", subject: "Physics", topic: "Revision", type: "Review" },
        { time: "7:00 PM - 7:45 PM", subject: "English", topic: "Essay Writing", type: "Practice" }
      ]
    }
  ]

  const weeklyGoals = [
    { goal: "Complete Physics Electromagnetic Induction", progress: 60, target: 100 },
    { goal: "Solve 20 Integration Problems", progress: 12, target: 20 },
    { goal: "Revise Chemistry Coordination Compounds", progress: 80, target: 100 },
    { goal: "Write 3 Practice Essays", progress: 1, target: 3 }
  ]

  const handleCompleteRecommendation = (id: number) => {
    setCompletedRecommendations([...completedRecommendations, id])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Hard": return "text-red-600"
      case "Medium": return "text-yellow-600"
      case "Easy": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Study Recommendations</h1>
        <p className="text-muted-foreground">Personalized study plan based on your performance analysis</p>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
          <TabsTrigger value="goals">Weekly Goals</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className={`hover:shadow-lg transition-shadow ${completedRecommendations.includes(rec.id) ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.subject}</CardTitle>
                    <Badge variant={getPriorityColor(rec.priority) as any}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-primary">
                    {rec.topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{rec.estimatedTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className={getDifficultyColor(rec.difficulty)}>{rec.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Due: {rec.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-green-600 font-medium">{rec.expectedImprovement}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Key Chapters:</h4>
                    <div className="flex flex-wrap gap-1">
                      {rec.chapters.map((chapter, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {chapter}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Recommended Resources:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec.resources.map((resource, index) => (
                        <li key={index} className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-2" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    {completedRecommendations.includes(rec.id) ? (
                      <Button disabled className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    ) : (
                      <>
                        <Button 
                          className="flex-1"
                          onClick={() => handleCompleteRecommendation(rec.id)}
                        >
                          Start Studying
                        </Button>
                        <Button variant="outline" size="sm">
                          <Lightbulb className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="study-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Study Schedule
              </CardTitle>
              <CardDescription>
                AI-optimized schedule based on your learning patterns and exam dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studyPlan.map((day, dayIndex) => (
                  <div key={dayIndex} className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{day.day}</h3>
                    <div className="grid gap-3">
                      {day.sessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium text-muted-foreground min-w-[120px]">
                              {session.time}
                            </div>
                            <div>
                              <p className="font-medium">{session.subject} - {session.topic}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {session.type}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Start Session
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Weekly Goals Progress
                </CardTitle>
                <CardDescription>Track your study objectives for this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal.goal}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.progress}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Study Achievements
                </CardTitle>
                <CardDescription>Your recent accomplishments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-green-800">7-Day Study Streak</p>
                    <p className="text-sm text-green-600">Keep it up!</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-800">Completed Physics Chapter</p>
                    <p className="text-sm text-blue-600">Electromagnetic Induction mastered</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-purple-800">Score Improvement</p>
                    <p className="text-sm text-purple-600">+12% in Mathematics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Performance Analysis
                </CardTitle>
                <CardDescription>Insights based on your study patterns and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Study Pattern Insight</h4>
                      <p className="text-sm text-blue-700">
                        You perform best during 9-11 AM sessions. Consider scheduling difficult topics during this time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Improvement Trend</h4>
                      <p className="text-sm text-green-700">
                        Your Mathematics scores have improved by 15% over the last month. Keep up the consistent practice!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-1">Focus Area Alert</h4>
                      <p className="text-sm text-orange-700">
                        Physics concepts need more attention. Consider increasing study time by 30 minutes daily.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Board Exam Prediction</CardTitle>
                <CardDescription>AI forecast based on current performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">89%</div>
                  <p className="text-sm text-muted-foreground mb-4">Predicted Board Exam Score</p>
                  <Badge variant="secondary">94% Confidence</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mathematics</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">English</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chemistry</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Physics</span>
                    <span className="font-semibold text-orange-600">84%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Computer Science</span>
                    <span className="font-semibold">95%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Recommendation:</strong> Focus on Physics to potentially improve overall score to 92-94%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}