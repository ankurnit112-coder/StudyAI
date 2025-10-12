"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userDataService, type UserAnalytics } from "@/lib/user-data-service"
import {
  Plus,
  BarChart3,
  Clock,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function AcademicRecordsManager() {
  const [userData, setUserData] = useState<UserAnalytics | null>(null)
  const [activeTab, setActiveTab] = useState("records")
  const [newRecord, setNewRecord] = useState({
    subject: "",
    examType: "Unit Test",
    marks: 0,
    maxMarks: 100,
    examDate: new Date().toISOString().split('T')[0]
  })
  const [newSession, setNewSession] = useState({
    subject: "",
    duration: 60,
    date: new Date().toISOString().split('T')[0]
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const examTypes = [
    "Unit Test", "Mid-term", "Final Exam", "Pre-board", 
    "Practice Test", "Mock Test", "Assignment", "Project"
  ]

  const loadUserData = useCallback(() => {
    const data = userDataService.getUserData()
    setUserData(data)
    
    if (data && data.profile.subjects.length > 0) {
      setNewRecord(prev => ({ ...prev, subject: data.profile.subjects[0] }))
      setNewSession(prev => ({ ...prev, subject: data.profile.subjects[0] }))
    }
  }, [])

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      loadUserData()
    }, 0)
    
    return () => clearTimeout(timer)
  }, [loadUserData])

  const addAcademicRecord = () => {
    try {
      if (!newRecord.subject || newRecord.marks < 0 || newRecord.maxMarks <= 0) {
        setMessage({ type: 'error', text: 'Please fill all fields correctly' })
        return
      }

      userDataService.addAcademicRecord(newRecord)
      loadUserData()
      setNewRecord({
        subject: userData?.profile.subjects[0] || "",
        examType: "Unit Test",
        marks: 0,
        maxMarks: 100,
        examDate: new Date().toISOString().split('T')[0]
      })
      setMessage({ type: 'success', text: 'Academic record added successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to add academic record' })
    }
  }

  const addStudySession = () => {
    try {
      if (!newSession.subject || newSession.duration <= 0) {
        setMessage({ type: 'error', text: 'Please fill all fields correctly' })
        return
      }

      userDataService.addStudySession({
        ...newSession,
        topics: [] // Could be expanded to include topics
      })
      loadUserData()
      setNewSession({
        subject: userData?.profile.subjects[0] || "",
        duration: 60,
        date: new Date().toISOString().split('T')[0]
      })
      setMessage({ type: 'success', text: 'Study session added successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to add study session' })
    }
  }

  const getSubjectStats = (subject: string) => {
    if (!userData) return { avgScore: 0, recordCount: 0, studyTime: 0 }
    
    const records = userData.academicRecords.filter(r => r.subject === subject)
    const sessions = userData.studySessions.filter(s => s.subject === subject)
    
    const avgScore = records.length > 0 
      ? Math.round(records.reduce((sum, r) => sum + (r.marks / r.maxMarks * 100), 0) / records.length)
      : 0
    
    const studyTime = sessions.reduce((sum, s) => sum + s.duration, 0)
    
    return { avgScore, recordCount: records.length, studyTime }
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-sky/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-sky" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">No Academic Profile Found</h3>
                <p className="text-gray-600 mt-2 max-w-md">
                  Complete your academic profile first to manage your records and study sessions.
                </p>
              </div>
              <Button 
                className="bg-sky hover:bg-sky/90 text-white"
                onClick={() => window.location.href = '/dashboard'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Complete Academic Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Academic Records Manager</h1>
        <p className="text-gray-600 text-lg">
          Track your academic progress and study sessions for better insights
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sky">{userData.academicRecords.length}</div>
            <div className="text-sm text-gray-600">Academic Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sage">{userData.studySessions.length}</div>
            <div className="text-sm text-gray-600">Study Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal">{userData.overallStats.averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow">
              {Math.floor(userData.overallStats.totalStudyTime / 60)}h {userData.overallStats.totalStudyTime % 60}m
            </div>
            <div className="text-sm text-gray-600">Total Study Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Academic Records
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Study Sessions
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Subject Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-6">
          {/* Add New Record */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-sky" />
                Add Academic Record
              </CardTitle>
              <CardDescription>
                Add your test scores and exam results to track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <Label className="text-sm">Subject</Label>
                  <Select value={newRecord.subject} onValueChange={(value) => setNewRecord({...newRecord, subject: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userData.profile.subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Exam Type</Label>
                  <Select value={newRecord.examType} onValueChange={(value) => setNewRecord({...newRecord, examType: value})}>
                    <SelectTrigger>
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
                  <Label className="text-sm">Marks Obtained</Label>
                  <Input
                    type="number"
                    min="0"
                    max={newRecord.maxMarks}
                    value={newRecord.marks}
                    onChange={(e) => setNewRecord({...newRecord, marks: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Max Marks</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newRecord.maxMarks}
                    onChange={(e) => setNewRecord({...newRecord, maxMarks: parseInt(e.target.value) || 100})}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Exam Date</Label>
                  <Input
                    type="date"
                    value={newRecord.examDate}
                    onChange={(e) => setNewRecord({...newRecord, examDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Score: {Math.round((newRecord.marks / newRecord.maxMarks) * 100)}%
                </Badge>
                <Button onClick={addAcademicRecord} className="bg-sky hover:bg-sky/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Records */}
          <Card>
            <CardHeader>
              <CardTitle>Your Academic Records ({userData.academicRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.academicRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No academic records yet. Add your first record above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.academicRecords
                    .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())
                    .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-navy">{record.subject}</p>
                          <p className="text-sm text-gray-600">{record.examType} • {record.examDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-sm">
                          {record.marks}/{record.maxMarks}
                        </Badge>
                        <Badge 
                          className={`text-sm ${
                            (record.marks / record.maxMarks * 100) >= 85 ? 'bg-green-100 text-green-800' :
                            (record.marks / record.maxMarks * 100) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {Math.round((record.marks / record.maxMarks) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          {/* Add New Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-sage" />
                Add Study Session
              </CardTitle>
              <CardDescription>
                Track your study time to analyze your learning patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Subject</Label>
                  <Select value={newSession.subject} onValueChange={(value) => setNewSession({...newSession, subject: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userData.profile.subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 60})}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Study Date</Label>
                  <Input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Duration: {Math.floor(newSession.duration / 60)}h {newSession.duration % 60}m
                </Badge>
                <Button onClick={addStudySession} className="bg-sage hover:bg-sage/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Your Study Sessions ({userData.studySessions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.studySessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No study sessions yet. Add your first session above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.studySessions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-navy">{session.subject}</p>
                          <p className="text-sm text-gray-600">{session.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {Math.floor(session.duration / 60)}h {session.duration % 60}m
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {userData.profile.subjects.map((subject) => {
              const stats = getSubjectStats(subject)
              return (
                <Card key={subject}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-navy">{subject}</h3>
                      <Badge 
                        className={`${
                          stats.avgScore >= 85 ? 'bg-green-100 text-green-800' :
                          stats.avgScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {stats.avgScore}% Average
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-sky/10 rounded-lg">
                        <div className="text-2xl font-bold text-sky">{stats.recordCount}</div>
                        <div className="text-sm text-gray-600">Academic Records</div>
                      </div>
                      
                      <div className="text-center p-4 bg-sage/10 rounded-lg">
                        <div className="text-2xl font-bold text-sage">
                          {Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m
                        </div>
                        <div className="text-sm text-gray-600">Study Time</div>
                      </div>
                      
                      <div className="text-center p-4 bg-teal/10 rounded-lg">
                        <div className="text-2xl font-bold text-teal">{stats.avgScore}%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}