import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MainNav from "@/components/navigation/main-nav"
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-sky/20 mb-4">404</div>
            <h1 className="text-3xl font-bold text-navy mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Search className="h-5 w-5 text-sky" />
                <span>What are you looking for?</span>
              </CardTitle>
              <CardDescription>
                Here are some helpful links to get you back on track
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
                
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Get Started with StudyAI
                  </Button>
                </Link>
                
                <Link href="/demo">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
                
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-sky hover:bg-sky/90 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-sm text-gray-500">
            <p>Still can't find what you're looking for?</p>
            <p>
              <Link href="/auth/signup" className="text-sky hover:text-sky/80 transition-colors">
                Get started with StudyAI
              </Link>
              {" "}to access all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}