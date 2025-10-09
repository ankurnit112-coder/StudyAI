"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, BookOpen, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export default function ExamInputForm() {
  const [examData, setExamData] = useState({
    subject: "",
    examType: "",
    score: "",
    maxScore: "100",
    examDate: undefined as Date | undefined,
    term: ""
  })

  const [recentExams, setRecentExams] = useState([
    { id: 1, subject: "Mathematics", type: "Unit Test", score: 87, maxScore: 100, date: "2024-01-15", term: "Second Term" },
    { id: 2, subject: "Physics", type: "Mid-term", score: 76, maxScore: 100, date: "2024-01-12", term: "Second Term" },
    { id: 3, subject: "Chemistry", type: "Unit Test", score: 84, maxScore: 100, date: "2024-01-10", term: "Second Term" }
  ])

  const cbseSubjects = [
    "Mathematics",
    "Physics", 
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Computer Science",
    "Physical Education",
    "Economics",
    "Business Studies",
    "Accountancy",
    "Political Science",
    "History",
    "Geography"
  ]

  const examTypes = [
    "Unit Test",
    "Mid-term Exam", 
    "Final Exam",
    "Board Exam",
    "Pre-board Exam",
    "Practice Test"
  ]

  const terms = [
    "First Term",
    "Second Term"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (examData.subject && examData.examType && examData.score && examData.examDate) {
      const newExam = {
        id: recentExams.length + 1,
        subject: examData.subject,
        type: examData.examType,
        score: parseInt(examData.score),
        maxScore: parseInt(examData.maxScore),
        date: format(examData.examDate, "yyyy-MM-dd"),
        term: examData.term
      }
      setRecentExams([newExam, ...recentExams])
      setExamData({
        subject: "",
        examType: "",
        score: "",
        maxScore: "100",
        examDate: undefined,
        term: ""
      })
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 75) return "text-blue-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return { variant: "default" as const, label: "Excellent", color: "bg-green-500" }
    if (percentage >= 75) return { variant: "secondary" as const, label: "Good", color: "bg-blue-500" }
    if (percentage >= 60) return { variant: "outline" as const, label: "Average", color: "bg-yellow-500" }
    return { variant: "destructive" as const, label: "Needs Improvement", color: "bg-red-500" }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Academic Records</h1>
        <p className="text-muted-foreground">Track your exam performance and let AI predict your board exam success</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Exam Result
            </CardTitle>
            <CardDescription>
              Enter your latest exam scores for AI-powered performance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={examData.subject} onValueChange={(value) => setExamData({...examData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {cbseSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select value={examData.examType} onValueChange={(value) => setExamData({...examData, examType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Your Score</Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="85"
                    value={examData.score}
                    onChange={(e) => setExamData({...examData, score: e.target.value})}
                    min="0"
                    max={examData.maxScore}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxScore">Maximum Score</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    placeholder="100"
                    value={examData.maxScore}
                    onChange={(e) => setExamData({...examData, maxScore: e.target.value})}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examData.examDate ? format(examData.examDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={examData.examDate}
                        onSelect={(date) => setExamData({...examData, examDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select value={examData.term} onValueChange={(value) => setExamData({...examData, term: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((term) => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Add Exam Result
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Recent Exam Results
            </CardTitle>
            <CardDescription>
              Your latest academic performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => {
                const badge = getScoreBadge(exam.score, exam.maxScore)
                const percentage = Math.round((exam.score / exam.maxScore) * 100)
                
                return (
                  <div key={exam.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{exam.subject}</h4>
                        <p className="text-sm text-muted-foreground">{exam.type} • {exam.term}</p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getScoreColor(exam.score, exam.maxScore)}`}>
                          {exam.score}/{exam.maxScore}
                        </span>
                        <span className="text-sm text-muted-foreground">({percentage}%)</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{exam.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Overview of your academic performance across subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">82.3%</div>
              <p className="text-sm text-green-700">Average Score</p>
              <p className="text-xs text-green-600 mt-1">Last 10 exams</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">Mathematics</div>
              <p className="text-sm text-blue-700">Strongest Subject</p>
              <p className="text-xs text-blue-600 mt-1">87% average</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">Physics</div>
              <p className="text-sm text-orange-700">Focus Area</p>
              <p className="text-xs text-orange-600 mt-1">Needs improvement</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">AI Insight</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your recent performance, you&apos;re on track to score <strong>89%</strong> in your board exams. 
                  Focus on Physics concepts to potentially improve by 5-7 points.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}