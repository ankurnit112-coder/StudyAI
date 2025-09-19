"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Brain,
  Menu,
  BookOpen,
  BarChart3,
  Target,
  Calendar,
  User,
  Settings,
  LogOut,
  GraduationCap,
  TrendingUp,
  Lightbulb
} from "lucide-react"


interface MainNavProps {
  isAuthenticated?: boolean
  userRole?: "student" | "parent" | "admin"
}

export default function MainNav({ isAuthenticated = false, userRole = "student" }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle scroll lock when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      description: "View your academic performance and AI predictions",
      icon: BarChart3,
      requiresAuth: true
    },
    {
      title: "Academic Records",
      href: "/academic-records",
      description: "Input and manage your exam scores",
      icon: BookOpen,
      requiresAuth: true
    },
    {
      title: "Study Plan",
      href: "/study-plan",
      description: "AI-generated personalized study recommendations",
      icon: Target,
      requiresAuth: true
    },
    {
      title: "Performance",
      href: "/performance",
      description: "Detailed analytics and performance insights",
      icon: TrendingUp,
      requiresAuth: true
    },
    {
      title: "Predictions",
      href: "/predictions",
      description: "AI-powered board exam score predictions",
      icon: Brain,
      requiresAuth: true
    },
    {
      title: "Features",
      href: "#features",
      description: "Explore StudyAI capabilities",
      icon: Lightbulb,
      requiresAuth: false
    },
    {
      title: "How It Works",
      href: "#how-it-works",
      description: "Learn about our AI-powered approach",
      icon: Brain,
      requiresAuth: false
    }
  ]

  const filteredItems = navigationItems.filter(item => 
    isAuthenticated ? true : !item.requiresAuth
  )

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 group">
          <Brain className="h-8 w-8 text-sky group-hover:scale-105 transition-transform duration-200" />
          <span className="text-xl font-bold text-navy">StudyAI</span>
          <Badge variant="secondary" className="text-xs bg-sky text-white shadow-sm">
            CBSE
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 text-foreground hover:text-sky transition-colors duration-200 font-medium px-3 py-2 rounded-md">
                <span>Academic Tools</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-[520px] bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] min-h-[350px]">
                <div className="p-6">
                  <div className="grid gap-4 grid-cols-2">
                    {/* Featured Dashboard Link */}
                    <div className="col-span-1 row-span-2">
                      <Link
                        href="/dashboard"
                        className="flex h-full w-full select-none flex-col justify-between rounded-lg bg-gradient-to-br from-sky/10 via-sky/5 to-sage/10 p-6 no-underline outline-none hover:shadow-lg transition-all duration-200 border border-sky/20 min-h-[200px]"
                      >
                        <div>
                          <BarChart3 className="h-8 w-8 text-sky mb-3" />
                          <div className="text-lg font-semibold text-navy mb-2">
                            Dashboard
                          </div>
                          <p className="text-sm leading-relaxed text-gray-600">
                            Your complete academic performance overview with AI insights and predictions
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-sky font-medium mt-4">
                          <span>View Dashboard</span>
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Other Navigation Items */}
                    <div className="col-span-1 space-y-2">
                      {filteredItems.slice(1, 5).map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block select-none rounded-lg p-4 no-underline outline-none transition-all duration-200 hover:bg-sky/10 hover:shadow-md border border-transparent hover:border-sky/20"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-1.5 rounded-md bg-sky/10">
                              <item.icon className="h-4 w-4 text-sky" />
                            </div>
                            <div className="text-sm font-semibold text-navy">{item.title}</div>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-600 ml-8">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Need help? Contact support</span>
                      <Link href="/help" className="text-sky hover:text-sky/80 font-medium">
                        Help Center →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => {
                  const element = document.querySelector('#features')
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="text-foreground hover:text-sky transition-colors duration-200 font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => {
                  const element = document.querySelector('#how-it-works')
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="text-foreground hover:text-sky transition-colors duration-200 font-medium relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => {
                  const element = document.querySelector('#testimonials')
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="text-foreground hover:text-sky transition-colors duration-200 font-medium relative group"
              >
                Success Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky transition-all duration-200 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => {
                  const element = document.querySelector('#cbse-support')
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="text-foreground hover:text-sky transition-colors duration-200 font-medium relative group"
              >
                CBSE Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky transition-all duration-200 group-hover:w-full"></span>
              </button>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Add logout logic here
                  console.log("Logging out...")
                  // For now, just redirect to home
                  window.location.href = "/"
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-foreground hover:text-sky transition-all duration-200 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-sky hover:bg-sky/90 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
              <SheetHeader className="pb-6">
                <SheetTitle className="flex items-center space-x-2 text-left">
                  <Brain className="h-6 w-6 text-sky" />
                  <span className="text-navy">StudyAI</span>
                  <Badge className="text-xs bg-sky text-white">CBSE</Badge>
                </SheetTitle>
                <SheetDescription className="text-left">
                  {isAuthenticated 
                    ? `Welcome back! Access your academic tools below.`
                    : "AI-powered CBSE board exam preparation platform"
                  }
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div key={item.title}>
                    {item.href.startsWith('#') ? (
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          const element = document.querySelector(item.href)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-sky/10 transition-all duration-200 w-full text-left border border-transparent hover:border-sky/20"
                      >
                        <div className="p-2 rounded-md bg-sky/10">
                          <item.icon className="h-5 w-5 text-sky" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-navy">{item.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 p-4 rounded-lg hover:bg-sky/10 transition-all duration-200 border border-transparent hover:border-sky/20"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-2 rounded-md bg-sky/10">
                          <item.icon className="h-5 w-5 text-sky" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-navy">{item.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
                
                {!isAuthenticated && (
                  <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
                    <Link href="/auth/signup">
                      <Button className="w-full bg-sky hover:bg-sky/90 text-white h-12" onClick={() => setIsOpen(false)}>
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/auth/signin">
                      <Button variant="outline" className="w-full h-12" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start h-12" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="outline" className="w-full justify-start h-12" onClick={() => setIsOpen(false)}>
                        <Settings className="h-4 w-4 mr-3" />
                        App Settings
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => {
                        setIsOpen(false)
                        // Add logout logic here
                        console.log("Logging out...")
                        window.location.href = "/"
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}