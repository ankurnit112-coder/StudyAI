"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Lightbulb, 
  Target, 
  BookOpen, 
  CheckCircle, 
  Star,
  TrendingUp,
  Calendar,
  Timer,
  Brain,
  Award,
  AlertTriangle,
  ArrowLeft,
  Plus
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserData {
  subjects: string[]
  recentScores: Record<string, number>
  academicRecords: any[]
  studySessions: any[]
}

interface StudyRecommendation {
  id: string
  subject: string
  topic: string
  priority: "High" | "Medium" | "Low"
  estimatedTime: string
  difficulty: "Easy" | "Medium" | "Hard"
  reason: string
  chapters: string[]
  resources: string[]
  expectedImprovement: string
  dueDate: string
}

export default function StudyRecommendations() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([])
  const [completedRecommendations, setCompletedRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Try to load user data from localStorage or API
      const savedUserData = localStorage.getItem('userData')
      const savedAcademicRecords = localStorage.getItem('academicRecords')
      const savedStudySessions = localStorage.getItem('studySessions')
      
      if (savedUserData || savedAcademicRecords || savedStudySessions) {
        const userData: UserData = {
          subjects: savedUserData ? JSON.parse(savedUserData).subjects || [] : [],
          recentScores: savedUserData ? JSON.parse(savedUserData).recentScores || {} : {},
          academicRecords: savedAcademicRecords ? JSON.parse(savedAcademicRecords) : [],
          studySessions: savedStudySessions ? JSON.parse(savedStudySessions) : []
        }
        
        setUserData(userData)
        generateRecommendations(userData)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecommendations = (userData: UserData) => {
    if (!userData.subjects.length && !userData.academicRecords.length) {
      setRecommendations([])
      return
    }

    const generatedRecommendations: StudyRecommendation[] = []

    // Generate recommendations based on user's academic records
    userData.subjects.forEach((subject, index) => {
      const recentScore = userData.recentScores[subject] || 0
      const hasLowScore = recentScore < 75
      
      if (hasLowScore || userData.academicRecords.length > 0) {
        const recommendation: StudyRecommendation = {
          id: `rec-${index}`,
          subject,
          topic: getWeakTopic(subject, recentScore),
          priority: hasLowScore ? "High" : "Medium",
          estimatedTime: hasLowScore ? "2-3 hours" : "1-2 hours",
          difficulty: getDifficultyLevel(recentScore),
          reason: `Based on your recent performance (${recentScore}%), this topic needs attention.`,
          chapters: getRelevantChapters(subject),
          resources: getRecommendedResources(subject),
          expectedImprovement: `+${Math.max(5, Math.floor((85 - recentScore) * 0.3))} marks`,
          dueDate: getRecommendedDueDate(hasLowScore)
        }
        generatedRecommendations.push(recommendation)
      }
    })

    setRecommendations(generatedRecommendations)
  }

  const getWeakTopic = (subject: string, score: number): string => {
    const topics: Record<string, string[]> = {
      "Physics": ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
      "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Coordination Compounds"],
      "Mathematics": ["Calculus", "Algebra", "Trigonometry", "Coordinate Geometry", "Statistics"],
      "Biology": ["Cell Biology", "Genetics", "Ecology", "Human Physiology", "Plant Biology"],
      "English": ["Grammar", "Literature", "Essay Writing", "Comprehension", "Poetry Analysis"]
    }
    
    const subjectTopics = topics[subject] || ["General Concepts"]
    return subjectTopics[Math.floor(Math.random() * subjectTopics.length)]
  }

  const getDifficultyLevel = (score: number): "Easy" | "Medium" | "Hard" => {
    if (score < 60) return "Hard"
    if (score < 75) return "Medium"
    return "Easy"
  }

  const getRelevantChapters = (subject: string): string[] => {
    const chapters: Record<string, string[]> = {
      "Physics": ["Chapter 1", "Chapter 2", "Chapter 3"],
      "Chemistry": ["Organic Reactions", "Chemical Bonding", "Thermodynamics"],
      "Mathematics": ["Differentiation", "Integration", "Probability"],
      "Biology": ["Cell Structure", "Genetics", "Evolution"],
      "English": ["Grammar Rules", "Essay Structure", "Literary Devices"]
    }
    
    return chapters[subject] || ["Key Concepts"]
  }

  const getRecommendedResources = (subject: string): string[] => {
    return [
      "NCERT Textbook",
      "Previous Year Questions",
      "Online Practice Tests",
      "Video Lectures"
    ]
  }

  const getRecommendedDueDate = (isHighPriority: boolean): string => {
    const days = isHighPriority ? 3 : 7
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + days)
    return dueDate.toISOString().split('T')[0]
  }

  const handleCompleteRecommendation = (id: string) => {
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study recommendations...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no user data
  if (!userData || (!userData.subjects.length && !userData.academicRecords.length)) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-sky hover:text-sky/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Study Recommendations</h1>
          <p className="text-muted-foreground">Personalized study plan based on your performance analysis</p>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-sky" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Study Data Available</h3>
            <p className="text-gray-600 mb-8">
              To get personalized AI study recommendations, you need to add your academic records and performance data first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/academic-records">
                <Button className="bg-sky hover:bg-sky/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Academic Records
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-sky hover:text-sky/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

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
                    <Badge variant={getPriorityColor(rec.priority) as "default" | "secondary" | "destructive" | "outline"}>
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
                Study Schedule
              </CardTitle>
              <CardDescription>
                Create a personalized study schedule based on your recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your {recommendations.length} active recommendations, here's a suggested schedule:
                  </p>
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-muted-foreground min-w-[100px]">
                          Day {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{rec.subject} - {rec.topic}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {rec.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Link href="/study-plan">
                      <Button className="w-full bg-sky hover:bg-sky/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Detailed Study Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No study schedule available yet.</p>
                  <p className="text-sm text-gray-500">Add academic records to generate a personalized study plan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Study Goals
              </CardTitle>
              <CardDescription>Set and track your academic objectives</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.subjects.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your subjects: {userData.subjects.join(", ")}
                  </p>
                  {userData.subjects.slice(0, 3).map((subject, index) => {
                    const score = userData.recentScores[subject] || 0
                    const targetScore = Math.min(95, score + 15)
                    const progress = Math.floor((score / targetScore) * 100)
                    
                    return (
                      <div key={subject} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Improve {subject} to {targetScore}%</span>
                          <span className="text-sm text-muted-foreground">
                            {score}%/{targetScore}%
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )
                  })}
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Set Custom Goals
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No study goals set yet.</p>
                  <p className="text-sm text-gray-500">Add your subjects and scores to create personalized goals.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Insights
              </CardTitle>
              <CardDescription>Performance analysis based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.subjects.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Subject Analysis</h4>
                        <p className="text-sm text-blue-700">
                          You're studying {userData.subjects.length} subjects. Focus on your weakest areas for maximum improvement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {Object.keys(userData.recentScores).length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">Performance Insight</h4>
                          <p className="text-sm text-green-700">
                            Your average score is {Math.round(Object.values(userData.recentScores).reduce((a, b) => a + b, 0) / Object.values(userData.recentScores).length)}%. 
                            Keep practicing to reach your target scores.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800 mb-1">Recommendation</h4>
                        <p className="text-sm text-orange-700">
                          Add more academic records and take practice tests to get more detailed AI insights and predictions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No insights available yet.</p>
                  <p className="text-sm text-gray-500">Add your academic data to get AI-powered insights and recommendations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}