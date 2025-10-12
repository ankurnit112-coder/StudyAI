"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Trash2,
  Clock,
  BarChart3
} from "lucide-react"

interface AcademicRecord {
  id: string
  subject: string
  examType: string
  marks: number
  maxMarks: number
  examDate: string
}

interface StudySession {
  id: string
  subject: string
  duration: number
  topics: string[]
  date: string
}

interface StudentProfile {
  name: string
  class: string
  school: string
  subjects: string[]
}

interface AcademicDataFormProps {
  onComplete: (data: {
    profile: StudentProfile
    academicRecords: AcademicRecord[]
    studySessions: StudySession[]
  }) => void
}

export default function AcademicDataForm({ onComplete }: AcademicDataFormProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<StudentProfile>({
    name: "",
    class: "",
    school: "",
    subjects: []
  })
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "English", "Hindi", "Computer Science", "Physical Education",
    "Economics", "Business Studies", "Accountancy", 
    "Political Science", "History", "Geography"
  ]

  const examTypes = [
    "Unit Test", "Mid-term", "Final Exam", "Pre-board", 
    "Practice Test", "Mock Test", "Assignment", "Project"
  ]

  const validateProfile = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!profile.name.trim()) newErrors.name = "Name is required"
    if (!profile.class) newErrors.class = "Class is required"
    if (!profile.school.trim()) newErrors.school = "School name is required"
    if (profile.subjects.length === 0) newErrors.subjects = "Select at least one subject"
    if (profile.subjects.length > 6) newErrors.subjects = "Maximum 6 subjects allowed"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAcademicRecords = () => {
    if (academicRecords.length === 0) {
      setErrors({ records: "Add at least one academic record" })
      return false
    }
    
    // Check if all selected subjects have at least one record
    const recordSubjects = [...new Set(academicRecords.map(r => r.subject))]
    const missingSubjects = profile.subjects.filter(s => !recordSubjects.includes(s))
    
    if (missingSubjects.length > 0) {
      setErrors({ records: `Add records for: ${missingSubjects.join(", ")}` })
      return false
    }
    
    setErrors({})
    return true
  }

  const handleSubjectSelection = (subject: string) => {
    const newSubjects = profile.subjects.includes(subject)
      ? profile.subjects.filter(s => s !== subject)
      : [...profile.subjects, subject]
    
    setProfile({ ...profile, subjects: newSubjects })
    setErrors({})
  }

  const addAcademicRecord = () => {
    const newRecord: AcademicRecord = {
      id: Date.now().toString(),
      subject: profile.subjects[0] || "",
      examType: "Unit Test",
      marks: 0,
      maxMarks: 100,
      examDate: new Date().toISOString().split('T')[0]
    }
    setAcademicRecords([...academicRecords, newRecord])
  }

  const updateAcademicRecord = (id: string, field: keyof AcademicRecord, value: string | number) => {
    setAcademicRecords(records => 
      records.map(record => 
        record.id === id ? { ...record, [field]: value } : record
      )
    )
  }

  const removeAcademicRecord = (id: string) => {
    setAcademicRecords(records => records.filter(r => r.id !== id))
  }

  const addStudySession = () => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: profile.subjects[0] || "",
      duration: 60,
      topics: [],
      date: new Date().toISOString().split('T')[0]
    }
    setStudySessions([...studySessions, newSession])
  }

  const updateStudySession = (id: string, field: keyof StudySession, value: string | number | string[]) => {
    setStudySessions(sessions => 
      sessions.map(session => 
        session.id === id ? { ...session, [field]: value } : session
      )
    )
  }

  const removeStudySession = (id: string) => {
    setStudySessions(sessions => sessions.filter(s => s.id !== id))
  }

  const handleComplete = () => {
    if (!validateProfile() || !validateAcademicRecords()) {
      return
    }
    
    onComplete({
      profile,
      academicRecords,
      studySessions
    })
  }

  const getCompletionPercentage = () => {
    let completed = 0
    const total = 4
    
    if (profile.name && profile.class && profile.school && profile.subjects.length > 0) completed++
    if (academicRecords.length > 0) completed++
    if (studySessions.length > 0) completed++
    completed++ // Always count the final step
    
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">Complete Your Academic Profile</h2>
              <p className="text-gray-600">Add your data to unlock AI-powered insights and predictions</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky">{getCompletionPercentage()}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Academic Records
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Study Sessions
          </TabsTrigger>
          <TabsTrigger value="complete" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Complete
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>Tell us about yourself and your academic focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school">School Name *</Label>
                  <Input
                    id="school"
                    placeholder="Enter your school name"
                    value={profile.school}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    className={errors.school ? "border-red-500" : ""}
                  />
                  {errors.school && <p className="text-sm text-red-500">{errors.school}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Current Class *</Label>
                <Select onValueChange={(value) => setProfile({ ...profile, class: value })}>
                  <SelectTrigger className={errors.class ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your current class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
                {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
              </div>

              <div className="space-y-2">
                <Label>Select Your Subjects * (Choose 3-6 subjects)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {cbseSubjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={profile.subjects.includes(subject) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSubjectSelection(subject)}
                      className="text-xs h-auto py-2 px-3 whitespace-normal text-center"
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Selected: {profile.subjects.length} subjects
                  </p>
                  {profile.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profile.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {errors.subjects && <p className="text-sm text-red-500">{errors.subjects}</p>}
              </div>

              <Button 
                onClick={() => {
                  if (validateProfile()) {
                    setActiveTab("records")
                  }
                }}
                className="w-full"
                disabled={!profile.name || !profile.class || !profile.school || profile.subjects.length === 0}
              >
                Next: Add Academic Records
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Academic Records
                <Button onClick={addAcademicRecord} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </CardTitle>
              <CardDescription>
                Add your recent test scores and exam results for accurate predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {academicRecords.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No academic records added yet</p>
                  <Button onClick={addAcademicRecord}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Record
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {academicRecords.map((record) => (
                    <Card key={record.id} className="border-l-4 border-l-sky">
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-6 gap-4 items-end">
                          <div>
                            <Label className="text-xs">Subject</Label>
                            <Select 
                              value={record.subject} 
                              onValueChange={(value) => updateAcademicRecord(record.id, 'subject', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {profile.subjects.map(subject => (
                                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Exam Type</Label>
                            <Select 
                              value={record.examType} 
                              onValueChange={(value) => updateAcademicRecord(record.id, 'examType', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {examTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Marks Obtained</Label>
                            <Input
                              type="number"
                              min="0"
                              max={record.maxMarks}
                              value={record.marks}
                              onChange={(e) => updateAcademicRecord(record.id, 'marks', parseInt(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Max Marks</Label>
                            <Input
                              type="number"
                              min="1"
                              value={record.maxMarks}
                              onChange={(e) => updateAcademicRecord(record.id, 'maxMarks', parseInt(e.target.value) || 100)}
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Exam Date</Label>
                            <Input
                              type="date"
                              value={record.examDate}
                              onChange={(e) => updateAcademicRecord(record.id, 'examDate', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round((record.marks / record.maxMarks) * 100)}%
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAcademicRecord(record.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {errors.records && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Missing Data</AlertTitle>
                  <AlertDescription>{errors.records}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab("profile")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => {
                    if (validateAcademicRecords()) {
                      setActiveTab("sessions")
                    }
                  }}
                  className="flex-1"
                >
                  Next: Add Study Sessions (Optional)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Study Sessions
                <Button onClick={addStudySession} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </CardTitle>
              <CardDescription>
                Track your study sessions for better insights (Optional but recommended)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studySessions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No study sessions added yet</p>
                  <Button onClick={addStudySession} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Study Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {studySessions.map((session) => (
                    <Card key={session.id} className="border-l-4 border-l-sage">
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-4 gap-4 items-end">
                          <div>
                            <Label className="text-xs">Subject</Label>
                            <Select 
                              value={session.subject} 
                              onValueChange={(value) => updateStudySession(session.id, 'subject', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {profile.subjects.map(subject => (
                                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Duration (minutes)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={session.duration}
                              onChange={(e) => updateStudySession(session.id, 'duration', parseInt(e.target.value) || 60)}
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Date</Label>
                            <Input
                              type="date"
                              value={session.date}
                              onChange={(e) => updateStudySession(session.id, 'date', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(session.duration / 60)}h {session.duration % 60}m
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeStudySession(session.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab("records")} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setActiveTab("complete")} className="flex-1">
                  Review & Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Review Your Data
              </CardTitle>
              <CardDescription>
                Review your information before completing your academic profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Summary */}
              <div className="p-4 bg-sky/10 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Profile Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span> {profile.name}
                  </div>
                  <div>
                    <span className="text-gray-600">Class:</span> {profile.class}
                  </div>
                  <div>
                    <span className="text-gray-600">School:</span> {profile.school}
                  </div>
                  <div>
                    <span className="text-gray-600">Subjects:</span> {profile.subjects.join(", ")}
                  </div>
                </div>
              </div>

              {/* Academic Records Summary */}
              <div className="p-4 bg-sage/10 rounded-lg">
                <h3 className="font-semibold text-navy mb-2">Academic Records ({academicRecords.length})</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {profile.subjects.map(subject => {
                    const subjectRecords = academicRecords.filter(r => r.subject === subject)
                    const avgScore = subjectRecords.length > 0 
                      ? Math.round(subjectRecords.reduce((sum, r) => sum + (r.marks / r.maxMarks * 100), 0) / subjectRecords.length)
                      : 0
                    return (
                      <div key={subject} className="flex justify-between">
                        <span>{subject}:</span>
                        <span className="font-medium">{avgScore}% ({subjectRecords.length} records)</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Study Sessions Summary */}
              {studySessions.length > 0 && (
                <div className="p-4 bg-teal/10 rounded-lg">
                  <h3 className="font-semibold text-navy mb-2">Study Sessions ({studySessions.length})</h3>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Total Study Time:</span>
                      <span className="font-medium">
                        {Math.floor(studySessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h {studySessions.reduce((sum, s) => sum + s.duration, 0) % 60}m
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Ready to Complete!</AlertTitle>
                <AlertDescription>
                  Your academic profile is complete. Click below to save your data and unlock AI-powered insights, 
                  predictions, and personalized study recommendations.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab("sessions")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1 bg-sky hover:bg-sky/90 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Complete Profile & Get Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}