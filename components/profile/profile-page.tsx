"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Settings,
  Bell,
  Shield,
  Camera,
  Edit,
  Save,
  X,
  CheckCircle,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Users,
  Star,
} from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  class: string
  school: string
  board: string
  subjects: string[]
  parentName: string
  parentEmail: string
  parentPhone: string
  profileImage?: string
}

interface NotificationSettings {
  studyReminders: boolean
  examAlerts: boolean
  progressReports: boolean
  achievements: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showPerformance: boolean
  showProgress: boolean
  dataSharing: boolean
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    class: "",
    school: "",
    board: "CBSE",
    subjects: [],
    parentName: "",
    parentEmail: "",
    parentPhone: ""
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    studyReminders: true,
    examAlerts: true,
    progressReports: true,
    achievements: true,
    emailNotifications: true,
    smsNotifications: false
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "private",
    showPerformance: true,
    showProgress: true,
    dataSharing: false
  })

  const cbseSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
    "Computer Science", "Physical Education", "Economics", "Business Studies",
    "Accountancy", "Political Science", "History", "Geography"
  ]

  const achievements = profile.name ? [
    {
      title: "Study Streak Champion",
      description: "Maintained 30-day study streak",
      icon: Award,
      color: "text-yellow",
      date: "2025-01-15"
    },
    {
      title: "Top Performer",
      description: "Scored 95%+ in Mathematics",
      icon: Star,
      color: "text-sky",
      date: "2025-01-10"
    },
    {
      title: "Consistent Learner",
      description: "Completed 100 study sessions",
      icon: BookOpen,
      color: "text-sage",
      date: "2025-01-05"
    }
  ] : []

  const stats = {
    totalStudyHours: profile.name ? 245 : 0,
    averageScore: profile.name ? 87.5 : 0,
    studyStreak: profile.name ? 15 : 0,
    completedGoals: profile.name ? 23 : 0,
    rank: profile.name ? 5 : 0,
    totalStudents: 120
  }

  const handleSave = () => {
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data here if needed
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-sky hover:bg-sky/90 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-sky" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} className="bg-sky hover:bg-sky/90 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profile.profileImage} />
                    <AvatarFallback className="text-2xl bg-sky/20 text-sky">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Study Hours</span>
                    <span className="font-semibold">{stats.totalStudyHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-semibold">{stats.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Study Streak</span>
                    <span className="font-semibold">{stats.studyStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Class Rank</span>
                    <span className="font-semibold">#{stats.rank}/{stats.totalStudents}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-sage" />
                  <span>Academic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="class">Current Class</Label>
                    <Select
                      value={profile.class}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, class: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Select
                      value={profile.board}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, board: value }))}
                      disabled={!isEditing}
                    >
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
                  <Label htmlFor="school">School Name</Label>
                  <Input
                    id="school"
                    value={profile.school}
                    onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Subjects</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {cbseSubjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={subject}
                          checked={profile.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile(prev => ({
                                ...prev,
                                subjects: [...prev.subjects, subject]
                              }))
                            } else {
                              setProfile(prev => ({
                                ...prev,
                                subjects: prev.subjects.filter(s => s !== subject)
                              }))
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={subject} className="text-sm">{subject}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal" />
                  <span>Parent/Guardian Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parentName">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
                    value={profile.parentName}
                    onChange={(e) => setProfile(prev => ({ ...prev, parentName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Parent Email</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={profile.parentEmail}
                    onChange={(e) => setProfile(prev => ({ ...prev, parentEmail: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    value={profile.parentPhone}
                    onChange={(e) => setProfile(prev => ({ ...prev, parentPhone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-navy">Study Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="studyReminders">Study Reminders</Label>
                    <p className="text-sm text-gray-600">Get notified about scheduled study sessions</p>
                  </div>
                  <Switch
                    id="studyReminders"
                    checked={notifications.studyReminders}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, studyReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="examAlerts">Exam Alerts</Label>
                    <p className="text-sm text-gray-600">Important exam and test reminders</p>
                  </div>
                  <Switch
                    id="examAlerts"
                    checked={notifications.examAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, examAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="progressReports">Progress Reports</Label>
                    <p className="text-sm text-gray-600">Weekly progress and performance updates</p>
                  </div>
                  <Switch
                    id="progressReports"
                    checked={notifications.progressReports}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, progressReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievements">Achievement Notifications</Label>
                    <p className="text-sm text-gray-600">Celebrate your milestones and achievements</p>
                  </div>
                  <Switch
                    id="achievements"
                    checked={notifications.achievements}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, achievements: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-navy">Delivery Methods</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value: "public" | "private" | "friends") =>
                    setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Control who can see your profile information
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showPerformance">Show Performance Data</Label>
                    <p className="text-sm text-gray-600">Allow others to see your academic performance</p>
                  </div>
                  <Switch
                    id="showPerformance"
                    checked={privacy.showPerformance}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, showPerformance: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showProgress">Show Progress Updates</Label>
                    <p className="text-sm text-gray-600">Share your study progress with others</p>
                  </div>
                  <Switch
                    id="showProgress"
                    checked={privacy.showProgress}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, showProgress: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSharing">Anonymous Data Sharing</Label>
                    <p className="text-sm text-gray-600">Help improve StudyAI by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    id="dataSharing"
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-navy mb-4">Account Security</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-white ${achievement.color}`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-sage" />
                  <span>Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-sage/10 rounded-lg">
                  <div className="text-3xl font-bold text-sage mb-2">{stats.completedGoals}</div>
                  <div className="text-sm text-gray-600">Goals Completed</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Study Consistency</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance Trend</span>
                    <Badge className="bg-blue-100 text-blue-800">Improving</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Goal Achievement</span>
                    <Badge className="bg-yellow-100 text-yellow-800">On Track</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Set New Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}