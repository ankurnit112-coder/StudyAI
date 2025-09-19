"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  GraduationCap,
  User,
  BookOpen,
  Target,
  CheckCircle,
  ArrowRight,
  Upload,
  FileText,
  Calendar,
  Award,
} from "lucide-react"

interface SetupData {
  // Personal Info
  name: string
  class: string
  school: string
  board: string
  
  // Subjects
  subjects: string[]
  
  // Goals
  targetScore: string
  examDate: string
  studyHoursPerDay: string
  
  // Optional data upload
  hasExistingRecords: boolean
  uploadMethod: "manual" | "file" | "skip"
}

interface NewUserSetupProps {
  onComplete: (data: SetupData) => void
  onSkip: () => void
}

export default function NewUserSetup({ onComplete, onSkip }: NewUserSetupProps) {
  const [step, setStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    name: "",
    class: "",
    school: "",
    board: "CBSE",
    subjects: [],
    targetScore: "",
    examDate: "",
    studyHoursPerDay: "",
    hasExistingRecords: false,
    uploadMethod: "skip"
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "Computer Science", "Physical Education", "Economics", "Business Studies",
    "Accountancy", "Political Science", "History", "Geography"
  ]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(setupData)
      toast.success("Welcome to StudyAI! Your account is ready.")
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkipSetup = () => {
    onSkip()
    toast.info("You can complete your profile setup anytime from Settings.")
  }

  const updateSetupData = (field: keyof SetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSubject = (subject: string) => {
    const newSubjects = setupData.subjects.includes(subject)
      ? setupData.subjects.filter(s => s !== subject)
      : [...setupData.subjects, subject]
    updateSetupData("subjects", newSubjects)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return setupData.name && setupData.class && setupData.school
      case 2:
        return setupData.subjects.length > 0
      case 3:
        return setupData.targetScore && setupData.studyHoursPerDay
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 via-white to-sage/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-sky" />
            <h1 className="text-3xl font-bold text-navy">Welcome to StudyAI!</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Let's set up your profile to provide personalized AI-powered study recommendations
          </p>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Step {step} of {totalSteps}</Badge>
            <Button variant="ghost" onClick={handleSkipSetup} className="text-gray-500">
              Skip Setup
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {step === 1 && <User className="h-6 w-6 text-sky" />}
              {step === 2 && <BookOpen className="h-6 w-6 text-sage" />}
              {step === 3 && <Target className="h-6 w-6 text-teal" />}
              {step === 4 && <Upload className="h-6 w-6 text-yellow" />}
              <span>
                {step === 1 && "Basic Information"}
                {step === 2 && "Your Subjects"}
                {step === 3 && "Study Goals"}
                {step === 4 && "Academic Records"}
              </span>
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself and your academic background"}
              {step === 2 && "Select the subjects you're currently studying"}
              {step === 3 && "Set your academic goals and study preferences"}
              {step === 4 && "Add your existing academic records (optional)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={setupData.name}
                    onChange={(e) => updateSetupData("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="class">Current Class *</Label>
                    <Select value={setupData.class} onValueChange={(value) => updateSetupData("class", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">Class 9</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="board">Board</Label>
                    <Select value={setupData.board} onValueChange={(value) => updateSetupData("board", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="school">School Name *</Label>
                  <Input
                    id="school"
                    value={setupData.school}
                    onChange={(e) => updateSetupData("school", e.target.value)}
                    placeholder="Enter your school name"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select all subjects you're currently studying:</p>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {cbseSubjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={setupData.subjects.includes(subject)}
                        onCheckedChange={() => toggleSubject(subject)}
                      />
                      <Label htmlFor={subject} className="text-sm cursor-pointer">{subject}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Selected: {setupData.subjects.length} subjects
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetScore">Target Board Exam Score *</Label>
                  <Select value={setupData.targetScore} onValueChange={(value) => updateSetupData("targetScore", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60-70">60-70%</SelectItem>
                      <SelectItem value="70-80">70-80%</SelectItem>
                      <SelectItem value="80-90">80-90%</SelectItem>
                      <SelectItem value="90+">90%+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="examDate">Next Board Exam Date</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={setupData.examDate}
                    onChange={(e) => updateSetupData("examDate", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="studyHours">Daily Study Hours *</Label>
                  <Select value={setupData.studyHoursPerDay} onValueChange={(value) => updateSetupData("studyHoursPerDay", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many hours can you study daily?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 hours</SelectItem>
                      <SelectItem value="3-4">3-4 hours</SelectItem>
                      <SelectItem value="5-6">5-6 hours</SelectItem>
                      <SelectItem value="7+">7+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy mb-2">Add Your Academic Records</h3>
                  <p className="text-gray-600 mb-6">
                    Adding your past exam scores helps our AI provide more accurate predictions. 
                    This step is optional - you can add records later.
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="hasRecords"
                    checked={setupData.hasExistingRecords}
                    onCheckedChange={(checked) => updateSetupData("hasExistingRecords", checked)}
                  />
                  <Label htmlFor="hasRecords">I have existing academic records to add</Label>
                </div>

                {setupData.hasExistingRecords && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-navy">How would you like to add your records?</p>
                    
                    <div className="grid gap-3">
                      <Button
                        variant={setupData.uploadMethod === "manual" ? "default" : "outline"}
                        onClick={() => updateSetupData("uploadMethod", "manual")}
                        className="justify-start h-auto p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Enter Manually</div>
                            <div className="text-sm opacity-80">Add scores one by one</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant={setupData.uploadMethod === "file" ? "default" : "outline"}
                        onClick={() => updateSetupData("uploadMethod", "file")}
                        className="justify-start h-auto p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Upload className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Upload File</div>
                            <div className="text-sm opacity-80">Import from Excel/CSV</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant={setupData.uploadMethod === "skip" ? "default" : "outline"}
                        onClick={() => updateSetupData("uploadMethod", "skip")}
                        className="justify-start h-auto p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Add Later</div>
                            <div className="text-sm opacity-80">Start fresh and add as you go</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-sky/10 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-sky mt-0.5" />
                    <div>
                      <h4 className="font-medium text-navy">Don't worry!</h4>
                      <p className="text-sm text-gray-600">
                        You can always add your academic records later from the Academic Records page. 
                        StudyAI will work with whatever data you provide and improve over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-sky hover:bg-sky/90 text-white"
                disabled={!isStepValid()}
              >
                {step === totalSteps ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}