import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import Image from "next/image"
import { 
  Play, 
  ArrowLeft, 
  BarChart3, 
  BookOpen, 
  Target, 
  TrendingUp,
  Brain,
  GraduationCap,
  Users,
  Award,
  Clock,
  CheckCircle,
  Star,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Shield,

} from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={false} />
      <MobileNav isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 text-sky hover:opacity-80 transition-opacity mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-sky" />
            <h1 className="text-4xl font-bold text-navy">StudyAI Demo</h1>
            <Badge className="bg-sky text-white">Live</Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how AI-powered insights can transform your CBSE board exam preparation. 
            See real features, get instant predictions, and explore personalized study plans.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky">50K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sage">95%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow">15%</div>
              <div className="text-sm text-gray-600">Score Boost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">4.8★</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-black">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Overview</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Features</TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Success Stories</TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Interactive Demo Video */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-sky/20 to-sage/20 relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&crop=center&auto=format&q=80"
                      alt="StudyAI dashboard demo showing student performance analytics, AI predictions, and personalized study recommendations for CBSE board exams"
                      className="w-full h-full object-cover"
                      width={800}
                      height={450}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-sky/90 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-sky transition-all duration-300 cursor-pointer hover:scale-110">
                          <Play className="h-10 w-10 ml-1" />
                        </div>
                        <p className="font-semibold text-lg">Interactive Demo</p>
                        <p className="text-sm text-gray-200">Experience StudyAI in 2 minutes</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-600 text-white animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        LIVE
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-navy mb-2">Try StudyAI Now</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Get instant access to AI predictions, personalized study plans, and performance analytics.
                    </p>
                    <div className="flex space-x-3">
                      <Link href="/auth/signup" className="flex-1">
                        <Button className="w-full bg-sky hover:bg-sky/90 text-white">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Start Free Trial
                        </Button>
                      </Link>
                      <Link href="/study-plan">
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Try Demo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow" />
                      <span>Why Choose StudyAI?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-sky/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-sky" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">AI-Powered Predictions</h4>
                        <p className="text-sm text-gray-600">94%+ accuracy in board exam score predictions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-sage" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">CBSE Specialized</h4>
                        <p className="text-sm text-gray-600">Built specifically for Classes 9-12 CBSE curriculum</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-teal" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">Parent Dashboard</h4>
                        <p className="text-sm text-gray-600">Keep parents informed with progress reports</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-4 w-4 text-yellow" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">Mobile First</h4>
                        <p className="text-sm text-gray-600">Optimized for Indian students who study on mobile</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Award className="h-6 w-6 text-yellow" />
                      <h3 className="font-semibold text-navy">Proven Results</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-sky">15%</div>
                        <div className="text-xs text-gray-600">Average Score Improvement</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-sage">92%</div>
                        <div className="text-xs text-gray-600">Students Recommend Us</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            {/* Feature Showcase */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-sky/20 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-sky" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Performance Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Real-time tracking with detailed insights into your academic progress and improvement areas.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Mathematics</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>Physics</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-sage/20 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-sage" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">AI Predictions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get accurate board exam score predictions with 94%+ accuracy based on your performance.
                  </p>
                  <div className="bg-sage/10 p-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage">87%</div>
                      <div className="text-xs text-gray-600">Predicted Board Score</div>
                      <div className="text-xs text-sage mt-1">94% Confidence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal/20 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Smart Study Plans</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Personalized study schedules that adapt to your learning style and exam dates.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Math Practice
                      </span>
                      <Badge variant="outline" className="text-xs">45 min</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Physics Review
                      </span>
                      <Badge variant="outline" className="text-xs">30 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-yellow/20 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-yellow" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Mobile Optimized</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Perfect mobile experience designed for Indian students who primarily study on phones.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Smartphone className="h-8 w-8 text-yellow" />
                    <Tablet className="h-8 w-8 text-gray-400" />
                    <Monitor className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Parent Dashboard</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Keep parents informed with weekly progress reports and performance insights.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Weekly Reports</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">Secure & Private</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your academic data is encrypted and secure. We never share personal information.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span>256-bit Encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "                    &quot;StudyAI predicted my Physics board exam score within 2 marks! The personalized study plan helped me improve from 65% to 89%.&quot;"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-sky rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Arjun Sharma</p>
                      <p className="text-sm text-gray-600">Class 12, Delhi - 89% in Boards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "                    &quot;The parent dashboard helped me track my daughter&apos;s progress. She scored 95% in Class 10 boards - exactly as StudyAI predicted!&quot;"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      P
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Priya Patel</p>
                      <p className="text-sm text-gray-600">Parent, Mumbai - Daughter scored 95%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">
                    "                    &quot;The mobile app is perfect for studying on the go. AI recommendations helped me focus on weak areas and improve my Chemistry score by 20%.&quot;"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Sneha Gupta</p>
                      <p className="text-sm text-gray-600">Class 11, Bangalore - 92% in Chemistry</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Start free and upgrade as you grow</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center">Free</CardTitle>
                  <CardDescription className="text-center">Perfect for trying out StudyAI</CardDescription>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-navy">₹0</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic performance tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">5 AI predictions per month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic study recommendations</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-sky border-2 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-sky text-white">Most Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-center">Student</CardTitle>
                  <CardDescription className="text-center">Complete CBSE exam preparation</CardDescription>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-navy">₹299</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited AI predictions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Personalized study plans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Performance analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mobile app access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email support</span>
                  </div>
                  <Button className="w-full mt-4 bg-sky hover:bg-sky/90 text-white">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center">Family</CardTitle>
                  <CardDescription className="text-center">For parents and multiple students</CardDescription>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-navy">₹499</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Student plan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Parent dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 3 students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Weekly progress reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Choose Family Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-sky/10 via-sage/10 to-teal/10 border-sky/20 mt-12">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-sky" />
              <h2 className="text-3xl font-bold text-navy">Ready to Transform Your Studies?</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
              Join 50,000+ CBSE students who are already using StudyAI to improve their board exam performance. 
              Start your free trial today and experience the power of AI-driven learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-sky hover:bg-sky/90 text-white px-8">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/study-plan">
                <Button size="lg" variant="outline" className="px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Try Demo Now
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}