"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Target, BookOpen, TrendingUp } from "lucide-react"

interface WelcomeWizardProps {
  onComplete: (data: any) => void
}

export default function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    board: "CBSE",
    subjects: [] as string[],
    goals: [] as string[],
    studyHours: "",
    examDate: ""
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "Computer Science", "Physical Education", "Economics", "Business Studies",
    "Accountancy", "Political Science", "History", "Geography"
  ]

  const studyGoals = [
    "Score 90%+ in Board Exams",
    "Prepare for JEE/NEET",
    "Improve weak subjects",
    "Build consistent study habits",
    "Reduce exam anxiety",
    "Time management skills"
  ]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSubject = (subject: string) => {
    const newSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject]
    updateFormData("subjects", newSubjects)
  }

  const toggleGoal = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter(g => g !== goal)
      : [...formData.goals, goal]
    updateFormData("goals", newGoals)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-navy">Welcome to StudyAI</h2>
          <Badge variant="outline">{step} of {totalSteps}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            {step === 1 && <GraduationCap className="h-6 w-6 text-sky" />}
            {step === 2 && <BookOpen className="h-6 w-6 text-sage" />}
            {step === 3 && <Target className="h-6 w-6 text-teal" />}
            {step === 4 && <TrendingUp className="h-6 w-6 text-yellow" />}
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Your Subjects"}
              {step === 3 && "Study Goals"}
              {step === 4 && "Study Preferences"}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 1 && "Tell us about yourself to personalize your experience"}
            {step === 2 && "Select the subjects you're currently studying"}
            {step === 3 && "What do you want to achieve this academic year?"}
            {step === 4 && "Help us create the perfect study plan for you"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="class">Current Class</Label>
                <Select value={formData.class} onValueChange={(value) => updateFormData("class", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
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
                <Label htmlFor="examDate">Next Board Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => updateFormData("examDate", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select all subjects you're currently studying:</p>
              <div className="grid grid-cols-2 gap-3">
                {cbseSubjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <Label htmlFor={subject} className="text-sm">{subject}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">What are your main academic goals? (Select all that apply)</p>
              <div className="space-y-3">
                {studyGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={() => toggleGoal(goal)}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="studyHours">How many hours can you study daily?</Label>
                <Select value={formData.studyHours} onValueChange={(value) => updateFormData("studyHours", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 hours</SelectItem>
                    <SelectItem value="3-4">3-4 hours</SelectItem>
                    <SelectItem value="5-6">5-6 hours</SelectItem>
                    <SelectItem value="7+">7+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-sky/10 p-4 rounded-lg">
                <h4 className="font-semibold text-navy mb-2">Your Profile Summary:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Name: {formData.name || "Not provided"}</li>
                  <li>• Class: {formData.class || "Not selected"}</li>
                  <li>• Subjects: {formData.subjects.length} selected</li>
                  <li>• Goals: {formData.goals.length} selected</li>
                  <li>• Study Hours: {formData.studyHours || "Not specified"}</li>
                </ul>
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
              disabled={
                (step === 1 && (!formData.name || !formData.class)) ||
                (step === 2 && formData.subjects.length === 0) ||
                (step === 3 && formData.goals.length === 0) ||
                (step === 4 && !formData.studyHours)
              }
            >
              {step === totalSteps ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}