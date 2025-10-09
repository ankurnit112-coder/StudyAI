"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BookOpen,
  TrendingUp,
  Target,
  Upload,
  Plus,
  ArrowRight,
  GraduationCap,
  BarChart3,
  Calendar,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react"

interface EmptyStateDashboardProps {
  userName?: string
  onStartSetup?: () => void
}

export default function EmptyStateDashboard({ userName = "Student", onStartSetup }: EmptyStateDashboardProps) {
  const quickActions = [
    {
      title: "Add Your First Exam Score",
      description: "Start by adding your recent test scores to get AI predictions",
      icon: BookOpen,
      href: "/academic-records",
      color: "bg-sky text-white",
      priority: "high"
    },
    {
      title: "Complete Your Profile",
      description: "Add your academic information for personalized recommendations",
      icon: GraduationCap,
      href: "/profile",
      color: "bg-sage text-white",
      priority: "high"
    },
    {
      title: "Set Study Goals",
      description: "Define your target scores and study schedule",
      icon: Target,
      href: "/study-plan",
      color: "bg-teal text-white",
      priority: "medium"
    },
    {
      title: "Explore AI Predictions",
      description: "See how our AI can predict your board exam performance",
      icon: TrendingUp,
      href: "/predictions",
      color: "bg-yellow text-white",
      priority: "medium"
    }
  ]

  const features = [
    {
      title: "AI-Powered Predictions",
      description: "Get accurate board exam score predictions with 94%+ accuracy",
      icon: Zap,
      available: false
    },
    {
      title: "Personalized Study Plans",
      description: "Receive customized study schedules based on your performance",
      icon: Calendar,
      available: false
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed insights and trends",
      icon: BarChart3,
      available: false
    },
    {
      title: "Smart Recommendations",
      description: "Get AI-powered suggestions to improve your weak areas",
      icon: Star,
      available: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <GraduationCap className="h-8 w-8 text-sky" />
          <h1 className="text-3xl font-bold text-navy">Welcome to StudyAI, {userName}!</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Let&apos;s get you started with AI-powered CBSE board exam preparation. 
          Add your academic information to unlock personalized insights.
        </p>
        <Badge className="bg-sky text-white mb-8">
          New Account - Let&apos;s Set You Up!
        </Badge>
      </div>

      {/* Quick Setup Card */}
      <Card className="bg-gradient-to-r from-sky/10 via-sage/10 to-teal/10 border-sky/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Upload className="h-6 w-6 text-sky" />
            <h2 className="text-2xl font-bold text-navy">Quick Setup</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Complete your profile setup to start getting AI predictions and personalized study recommendations. 
            It only takes 2 minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onStartSetup ? (
              <Button onClick={onStartSetup} size="lg" className="bg-sky hover:bg-sky/90 text-white">
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Profile Setup
              </Button>
            ) : (
              <Link href="/profile">
                <Button size="lg" className="bg-sky hover:bg-sky/90 text-white">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Profile Setup
                </Button>
              </Link>
            )}
            <Link href="/academic-records">
              <Button size="lg" variant="outline">
                <Plus className="h-5 w-5 mr-2" />
                Add First Exam Score
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-navy mb-6">Get Started</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-navy">{action.title}</h3>
                      {action.priority === "high" && (
                        <Badge variant="outline" className="text-xs text-red-600 border-red-600">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <Link href={action.href}>
                      <Button variant="outline" size="sm" className="group-hover:bg-sky group-hover:text-white transition-colors">
                        Get Started
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div>
        <h2 className="text-2xl font-bold text-navy mb-6">What You&apos;ll Unlock</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="opacity-60">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <feature.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-600">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs text-gray-500">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            These features will be available once you add your academic information
          </p>
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-sage" />
            <span>Need Help Getting Started?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-sky" />
              </div>
              <h4 className="font-semibold text-navy mb-2">Add Academic Records</h4>
              <p className="text-sm text-gray-600">
                Start by adding your recent exam scores. Even one score helps our AI understand your performance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-sage" />
              </div>
              <h4 className="font-semibold text-navy mb-2">Set Your Goals</h4>
              <p className="text-sm text-gray-600">
                Define your target board exam scores and study schedule to get personalized recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-teal" />
              </div>
              <h4 className="font-semibold text-navy mb-2">Get AI Predictions</h4>
              <p className="text-sm text-gray-600">
                Once you have some data, our AI will provide accurate board exam predictions and study insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}