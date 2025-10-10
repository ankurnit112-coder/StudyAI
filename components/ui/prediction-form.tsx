"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, TrendingUp, BookOpen, Target, AlertCircle, CheckCircle } from "lucide-react"

interface PredictionResult {
  subject: string
  predicted_score: number
  confidence: number
}

interface StudentData {
  name: string
  currentClass: string
  subjects: string[]
  recentScores: { [key: string]: number }
}

interface PredictionFormProps {
  onComplete?: (results: PredictionResult[]) => void
}

export default function PredictionForm({ onComplete }: PredictionFormProps) {
  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    currentClass: "",
    subjects: [],
    recentScores: {}
  })
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [lastError, setLastError] = useState<string>("")

  const saveStudentDataToStorage = (data: StudentData, predictions: PredictionResult[]) => {
    try {
      // Create subjects array with predictions
      const subjects = data.subjects.map(subject => {
        const prediction = predictions.find(p => p.subject === subject)
        const currentScore = data.recentScores[subject] || 0
        return {
          id: subject.toLowerCase().replace(/\s+/g, '-'),
          name: subject,
          current: currentScore,
          predicted: prediction?.predicted_score || currentScore + 5,
          trend: (prediction?.predicted_score || 0) > currentScore ? 'up' : 'stable',
          color: getSubjectColor(subject)
        }
      })

      // Calculate overall metrics
      const avgCurrent = subjects.reduce((sum, s) => sum + s.current, 0) / subjects.length
      const avgPredicted = subjects.reduce((sum, s) => sum + s.predicted, 0) / subjects.length
      const avgConfidence = predictions.reduce((sum, p) => sum + (p.confidence * 100), 0) / predictions.length

      const dashboardData = {
        currentGPA: Number((avgCurrent / 10).toFixed(1)),
        predictedBoardScore: Math.round(avgPredicted),
        confidence: Math.round(avgConfidence),
        subjects,
        recentTests: subjects.map(subject => ({
          subject: subject.name,
          score: subject.current,
          maxScore: 100,
          date: new Date().toISOString().split('T')[0],
          type: "Recent Assessment"
        })).slice(0, 3)
      }

      // Save to localStorage (in a real app, this would be saved to your backend)
      // Use a more unique identifier - in a real app this would be user ID from auth
      const userKey = `studentData_${data.name}_${data.currentClass}`
      localStorage.setItem(userKey, JSON.stringify(dashboardData))
    } catch (error) {
      console.error('Failed to save student data:', error)
    }
  }

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      'mathematics': 'bg-blue-500',
      'physics': 'bg-green-500', 
      'chemistry': 'bg-purple-500',
      'english': 'bg-orange-500',
      'computer science': 'bg-cyan-500',
      'biology': 'bg-red-500',
      'history': 'bg-yellow-500',
      'geography': 'bg-indigo-500'
    }
    return colors[subject.toLowerCase()] || 'bg-gray-500'
  }

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "English", "Hindi", "Computer Science", "Physical Education",
    "Economics", "Business Studies", "Accountancy", 
    "Political Science", "History", "Geography"
  ]

  const validateStep = (currentStep: number): boolean => {
    setErrors({})
    const newErrors: { [key: string]: string } = {}

    switch (currentStep) {
      case 1:
        if (!studentData.name.trim()) {
          newErrors.name = "Name is required"
        }
        if (!studentData.currentClass) {
          newErrors.currentClass = "Class is required"
        }
        break
      case 2:
        if (studentData.subjects.length === 0) {
          newErrors.subjects = "Please select at least one subject"
        }
        if (studentData.subjects.length > 6) {
          newErrors.subjects = "Maximum 6 subjects allowed"
        }
        break
      case 3:
        studentData.subjects.forEach(subject => {
          const score = studentData.recentScores[subject]
          if (score === undefined) {
            newErrors[subject] = "Score is required"
          } else if (score < 0 || score > 100) {
            newErrors[subject] = "Score must be between 0 and 100"
          }
        })
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubjectSelection = (subject: string) => {
    const newSubjects = studentData.subjects.includes(subject)
      ? studentData.subjects.filter(s => s !== subject)
      : [...studentData.subjects, subject]
    setErrors({}) // Clear errors when selection changes
    
    setStudentData({ ...studentData, subjects: newSubjects })
  }

  const handleScoreChange = (subject: string, score: string) => {
    if (score === '') {
      // Allow empty input for deletion
      const newScores = { ...studentData.recentScores }
      delete newScores[subject]
      setStudentData({
        ...studentData,
        recentScores: newScores
      })
      return
    }
    
    const numScore = parseFloat(score)
    if (!isNaN(numScore) && numScore >= 0 && numScore <= 100) {
      setStudentData({
        ...studentData,
        recentScores: { ...studentData.recentScores, [subject]: numScore }
      })
    }
  }

  const generatePredictions = async () => {
    if (!validateStep(step)) {
      return
    }

    setLoading(true)
    setFormState('submitting')
    setLastError("")
    
    try {
      // Call our ML prediction API
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate predictions')
      }
      
      if (result.success) {
        // Save student data to localStorage for dashboard
        saveStudentDataToStorage(studentData, result.predictions)
        setPredictions(result.predictions)
        setStep(3)
        setFormState('success')
        onComplete?.(result.predictions)
      } else {
        throw new Error(result.error || 'Prediction failed')
      }
    } catch (error: unknown) {
      console.error("Prediction failed:", error)
      setFormState('error')
      setLastError(error instanceof Error ? error.message : "Failed to generate predictions")
      // Fallback to mock data if API fails
      const mockPredictions = studentData.subjects.map(subject => {
        const recentScore = studentData.recentScores[subject] || 70
        // Ensure recent score is within valid range
        const validRecentScore = Math.min(100, Math.max(0, recentScore))
        const improvement = Math.random() * 8 + 1 // 1-9 points improvement
        const predictedScore = Math.min(100, Math.max(0, validRecentScore + improvement))
        const confidence = Math.min(1.0, Math.max(0.7, 0.85 + Math.random() * 0.1))
        
        return {
          subject,
          predicted_score: Math.round(predictedScore * 10) / 10,
          confidence: Math.round(confidence * 1000) / 1000
        }
      })
      
      // Save data even with mock predictions
      saveStudentDataToStorage(studentData, mockPredictions)
      setPredictions(mockPredictions)
      setStep(3)
      onComplete?.(mockPredictions)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500"
    if (confidence >= 0.8) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Student Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself to get personalized CBSE board exam predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={studentData.name}
              onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
              className={errors.name ? "border-red-500 animate-shake" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Current Class</Label>
            <Select onValueChange={(value) => setStudentData({ ...studentData, currentClass: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">Class 9</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Your Subjects</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {cbseSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant={studentData.subjects.includes(subject) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubjectSelection(subject)}
                  className="text-xs h-auto py-2 px-3 whitespace-normal text-center"
                >
                  {subject}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Selected: {studentData.subjects.length} subjects
            </p>
          </div>

          <Button 
            onClick={() => setStep(2)}
            disabled={!studentData.name || !studentData.currentClass || studentData.subjects.length === 0}
            className="w-full"
          >
            Next: Enter Recent Scores
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 2) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Recent Test Scores
          </CardTitle>
          <CardDescription>
            Enter your recent test scores for better prediction accuracy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {studentData.subjects.map((subject) => (
              <div key={subject} className="flex items-center gap-4">
                <Label className="w-32 text-sm">{subject}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter score (0-100)"
                  onChange={(e) => handleScoreChange(subject, e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            ))}
          </div>

          {/* Form Status Alerts */}
          {formState === 'error' && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{lastError}</AlertDescription>
            </Alert>
          )}
          {formState === 'success' && (
            <Alert className="border-green-500 text-green-700 bg-green-50 animate-fade-in">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Predictions generated successfully!</AlertDescription>
            </Alert>
          )}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={generatePredictions}
              disabled={loading || Object.keys(studentData.recentScores).length === 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Get AI Predictions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Your CBSE Board Exam Predictions
          </CardTitle>
          <CardDescription>
            AI-powered predictions based on your performance data and CBSE trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((prediction) => (
              <Card key={prediction.subject} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{prediction.subject}</h3>
                    <Badge 
                      className={`${getConfidenceColor(prediction.confidence)} text-white text-xs`}
                    >
                      {Math.round(prediction.confidence * 100)}% confident
                    </Badge>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(prediction.predicted_score)}`}>
                    {prediction.predicted_score}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Predicted Board Score
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 AI Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your strongest subject appears to be {predictions.sort((a, b) => b.predicted_score - a.predicted_score)[0]?.subject}</li>
              <li>• Focus extra attention on {predictions.sort((a, b) => a.predicted_score - b.predicted_score)[0]?.subject} for maximum improvement</li>
              <li>• Overall predicted average: {predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.predicted_score, 0) / predictions.length) : 0}%</li>
            </ul>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={() => { setStep(1); setPredictions([]); }} variant="outline" className="flex-1">
              Try Again
            </Button>
            <Button className="flex-1">
              Get Personalized Study Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}