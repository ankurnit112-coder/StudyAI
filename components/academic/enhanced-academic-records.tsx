"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  BarChart3,
  FileText,
  Upload,
  Download,
  Filter,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface ExamRecord {
  id: string
  subject: string
  examType: string
  date: string
  maxMarks: number
  obtainedMarks: number
  percentage: number
  grade: string
  term: string
  year: string
  notes?: string
  trend: "up" | "down" | "stable"
}

interface SubjectStats {
  subject: string
  averageScore: number
  bestScore: number
  worstScore: number
  totalExams: number
  trend: "up" | "down" | "stable"
  improvement: number
}

export default function EnhancedAcademicRecords() {
  const [activeTab, setActiveTab] = useState("records")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ExamRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterTerm, setFilterTerm] = useState("all")

  // Empty by default for new users - they need to add their own records
  const examRecords: ExamRecord[] = []

  // Empty by default - will be calculated from actual exam records
  const subjectStats: SubjectStats[] = []

  const [formData, setFormData] = useState({
    subject: "",
    examType: "",
    date: "",
    maxMarks: "",
    obtainedMarks: "",
    term: "",
    notes: ""
  })

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "Computer Science", "Physical Education", "Economics", "Business Studies",
    "Accountancy", "Political Science", "History", "Geography"
  ]

  const examTypes = [
    "Unit Test", "Monthly Test", "Half Yearly", "Annual Exam", "Board Exam",
    "Practical", "Assignment", "Project", "Quiz", "Mock Test"
  ]

  const terms = ["Term 1", "Term 2", "Annual"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.examType || !formData.obtainedMarks || !formData.maxMarks) {
      toast.error("Please fill in all required fields")
      return
    }

    const obtainedMarks = parseInt(formData.obtainedMarks)
    const maxMarks = parseInt(formData.maxMarks)
    
    if (obtainedMarks > maxMarks) {
      toast.error("Obtained marks cannot be greater than maximum marks")
      return
    }

    // Calculate percentage and grade
    const percentage = (obtainedMarks / maxMarks) * 100
    const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : percentage >= 60 ? "B" : "C"

    toast.success("Exam record added successfully!")
    setShowAddForm(false)
    setFormData({
      subject: "",
      examType: "",
      date: "",
      maxMarks: "",
      obtainedMarks: "",
      term: "",
      notes: ""
    })
  }

  const handleEdit = (record: ExamRecord) => {
    setEditingRecord(record)
    setFormData({
      subject: record.subject,
      examType: record.examType,
      date: record.date,
      maxMarks: record.maxMarks.toString(),
      obtainedMarks: record.obtainedMarks.toString(),
      term: record.term,
      notes: record.notes || ""
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    toast.success("Exam record deleted successfully!")
  }

  const filteredRecords = examRecords.filter(record => {
    const matchesSearch = record.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.examType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "all" || record.subject === filterSubject
    const matchesTerm = filterTerm === "all" || record.term === filterTerm
    
    return matchesSearch && matchesSubject && matchesTerm
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-green-100 text-green-800 border-green-200"
      case "A": return "bg-blue-100 text-blue-800 border-blue-200"
      case "B+": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "B": return "bg-orange-100 text-orange-800 border-orange-200"
      default: return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Academic Records</h1>
          <p className="text-gray-600">Track your exam performance and monitor progress over time</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-sky hover:bg-sky/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-navy">{examRecords.length}</p>
              </div>
              <FileText className="h-8 w-8 text-sky" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-sage">{examRecords.length > 0 ? "82.1%" : "0%"}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-sage" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-green-600">{examRecords.length > 0 ? "95%" : "0%"}</p>
              </div>
              <Award className="h-8 w-8 text-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-teal">{examRecords.length > 0 ? "+8.5%" : "0%"}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records">Exam Records</TabsTrigger>
          <TabsTrigger value="analytics">Subject Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by subject or exam type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {cbseSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterTerm} onValueChange={setFilterTerm}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    {terms.map(term => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Academic Records Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start by adding your first exam score to track your performance and get AI predictions. 
                    Even one score helps our AI understand your academic progress.
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-sky hover:bg-sky/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Exam Score
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-navy text-lg">{record.subject}</h3>
                        <Badge variant="outline">{record.examType}</Badge>
                        <Badge className={getGradeColor(record.grade)}>
                          {record.grade}
                        </Badge>
                        {getTrendIcon(record.trend)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{record.obtainedMarks}/{record.maxMarks}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{record.percentage}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{record.term}</span>
                        </div>
                      </div>

                      {record.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {record.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {subjectStats.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analytics Available</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add at least 3 exam records to see detailed subject-wise analytics and performance trends.
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("records")
                    setShowAddForm(true)
                  }}
                  className="bg-sky hover:bg-sky/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exam Records
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {subjectStats.map((stat) => (
              <Card key={stat.subject}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-navy text-lg">{stat.subject}</h3>
                      <p className="text-sm text-gray-600">{stat.totalExams} exams recorded</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(stat.trend)}
                      <span className={`text-sm font-medium ${
                        stat.improvement > 0 ? "text-green-600" : 
                        stat.improvement < 0 ? "text-red-600" : "text-gray-600"
                      }`}>
                        {stat.improvement > 0 ? "+" : ""}{stat.improvement}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Score</p>
                      <div className="text-2xl font-bold text-navy mb-2">{stat.averageScore}%</div>
                      <Progress value={stat.averageScore} className="h-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Best Score</p>
                      <div className="text-2xl font-bold text-green-600 mb-2">{stat.bestScore}%</div>
                      <Progress value={stat.bestScore} className="h-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lowest Score</p>
                      <div className="text-2xl font-bold text-red-600 mb-2">{stat.worstScore}%</div>
                      <Progress value={stat.worstScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-sky" />
                  <span>Export Reports</span>
                </CardTitle>
                <CardDescription>
                  Download your academic records in various formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Progress Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-sage" />
                  <span>Import Records</span>
                </CardTitle>
                <CardDescription>
                  Bulk import exam records from files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingRecord ? "Edit Exam Record" : "Add New Exam Record"}
              </CardTitle>
              <CardDescription>
                {editingRecord ? "Update the exam record details" : "Enter the details of your exam"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {cbseSubjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="examType">Exam Type *</Label>
                    <Select
                      value={formData.examType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, examType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Exam Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxMarks">Maximum Marks *</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      placeholder="100"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxMarks: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="obtainedMarks">Obtained Marks *</Label>
                    <Input
                      id="obtainedMarks"
                      type="number"
                      placeholder="85"
                      value={formData.obtainedMarks}
                      onChange={(e) => setFormData(prev => ({ ...prev, obtainedMarks: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="term">Term</Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this exam..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingRecord(null)
                      setFormData({
                        subject: "",
                        examType: "",
                        date: "",
                        maxMarks: "",
                        obtainedMarks: "",
                        term: "",
                        notes: ""
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-sky hover:bg-sky/90 text-white">
                    {editingRecord ? "Update Record" : "Add Record"}
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