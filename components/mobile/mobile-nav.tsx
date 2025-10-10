"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Home,
  BarChart3,
  BookOpen,
  Calendar,
  User,
  Settings,
  Bell,
  Trophy,
  Target,
  Brain,
  Menu,
  X,

} from "lucide-react"

interface MobileNavProps {
  isAuthenticated?: boolean
}

export default function MobileNav({ isAuthenticated = false }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes - using a callback approach
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      badge: null,
      authenticated: true
    },
    {
      name: "Study Plan",
      href: "/study-plan",
      icon: BookOpen,
      badge: "3",
      authenticated: true
    },
    {
      name: "Performance",
      href: "/performance",
      icon: BarChart3,
      badge: null,
      authenticated: true
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
      badge: "2",
      authenticated: true
    },
    {
      name: "AI Insights",
      href: "/insights",
      icon: Brain,
      badge: "New",
      authenticated: true
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: Trophy,
      badge: null,
      authenticated: true
    }
  ]

  const publicItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      badge: null,
      authenticated: false
    },
    {
      name: "Demo",
      href: "/demo",
      icon: Target,
      badge: null,
      authenticated: false
    },
    {
      name: "Sign In",
      href: "/auth/signin",
      icon: User,
      badge: null,
      authenticated: false
    }
  ]

  const items = isAuthenticated ? navigationItems : publicItems

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 md:hidden shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {items.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive(item.href)
                    ? "text-sky bg-sky/10"
                    : "text-gray-600 hover:text-sky"
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          {/* More Menu */}
          <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-sky">
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] z-[70]">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  StudyAI Menu
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </SheetTitle>
                <SheetDescription>
                  Access all features and settings
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-2">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-sky/10 text-sky border border-sky/20"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-200 my-4" />
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    
                    <Link
                      href="/notifications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5" />
                        <span className="font-medium">Notifications</span>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        5
                      </Badge>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  )
}