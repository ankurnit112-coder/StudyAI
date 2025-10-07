import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"
import DemoNotice from "@/components/ui/demo-notice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  BarChart3, 
  CheckCircle,
  Users,
  Trophy,
  Calendar,
  Brain
} from "lucide-react"

export default function CBSEClassesPage() {
  const classFeatures = [
    {
      class: "Class 9",
      description: "Foundation building with comprehensive subject coverage",
      subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi"],
      features: [
        "Foundation concepts reinforcement",
        "Study habit development",
        "Basic performance tracking",
        "Preparation for Class 10 boards"
      ],
      color: "sky"
    },
    {
      class: "Class 10",
      description: "Board exam preparation with intensive practice",
      subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi"],
      features: [
        "Board exam predictions",
        "Previous year paper analysis",
        "Intensive revision schedules",
        "Stress management techniques"
      ],
      color: "sage",
      popular: true
    },
    {
      class: "Class 11",
      description: "Stream selection and advanced concept introduction",
      subjects: ["Physics", "Chemistry", "Biology/Math", "English", "Optional"],
      features: [
        "Stream-specific guidance",
        "Competitive exam preparation",
        "Advanced concept mastery",
        "Career counseling integration"
      ],
      color: "teal"
    },
    {
      class: "Class 12",
      description: "Final board preparation with career guidance",
      subjects: ["Physics", "Chemistry", "Biology/Math", "English", "Optional"],
      features: [
        "Board exam predictions",
        "College admission guidance",
        "Competitive exam integration",
        "Career pathway recommendations"
      ],
      color: "yellow",
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={false} />
      <MobileNav isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <DemoNotice />
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-sky" />
            <h1 className="text-4xl font-bold text-navy">CBSE Classes 9-12</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive AI-powered support for all CBSE classes. From foundation building in Class 9 
            to board exam mastery in Classes 10 & 12, we've got you covered.
          </p>
          
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-sky mb-2">50K+</div>
                <div className="text-sm text-gray-600">CBSE Students</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-sage mb-2">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-yellow mb-2">15%</div>
                <div className="text-sm text-gray-600">Avg Improvement</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-teal mb-2">200+</div>
                <div className="text-sm text-gray-600">Partner Schools</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Class-wise Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {classFeatures.map((classInfo, index) => (
            <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${classInfo.popular ? 'border-2 border-sky' : ''}`}>
              {classInfo.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-sky text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-10 h-10 ${
                      classInfo.color === 'sky' ? 'bg-sky/20' :
                      classInfo.color === 'sage' ? 'bg-sage/20' :
                      classInfo.color === 'teal' ? 'bg-teal/20' :
                      'bg-yellow/20'
                    } rounded-lg flex items-center justify-center`}>
                      <GraduationCap className={`h-5 w-5 ${
                        classInfo.color === 'sky' ? 'text-sky' :
                        classInfo.color === 'sage' ? 'text-sage' :
                        classInfo.color === 'teal' ? 'text-teal' :
                        'text-yellow'
                      }`} />
                    </div>
                    <span className="text-navy">{classInfo.class}</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    CBSE
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {classInfo.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Subjects */}
                <div>
                  <h4 className="font-semibold text-navy mb-2 text-sm">Core Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {classInfo.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-navy mb-2 text-sm">Key Features:</h4>
                  <div className="space-y-2">
                    {classInfo.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-gray-100">
                  <Link href="/auth/signup">
                    <Button className={`w-full ${
                      classInfo.color === 'sky' ? 'bg-sky hover:bg-sky/90' :
                      classInfo.color === 'sage' ? 'bg-sage hover:bg-sage/90' :
                      classInfo.color === 'teal' ? 'bg-teal hover:bg-teal/90' :
                      'bg-yellow hover:bg-yellow/90'
                    } text-white`}>
                      <Brain className="h-4 w-4 mr-2" />
                      Get Started - {classInfo.class}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-sky" />
                <span>Curriculum Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Complete CBSE syllabus coverage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Updated for 2024-25 academic year</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Chapter-wise breakdown</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Previous year paper analysis</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-sage" />
                <span>Performance Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Real-time progress monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Subject-wise analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Trend analysis and predictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Comparative performance insights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-teal" />
                <span>Exam Preparation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Board exam focused preparation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Competitive exam integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Time management strategies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Revision scheduling</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-sky/10 via-sage/10 to-teal/10 border-sky/20">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-8 w-8 text-yellow" />
              <h2 className="text-3xl font-bold text-navy">Ready to Excel in Your Class?</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
              Join thousands of CBSE students who are already using StudyAI to improve their academic performance. 
              Get personalized AI insights for your specific class and subjects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-sky hover:bg-sky/90 text-white px-8">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8">
                  <Brain className="h-5 w-5 mr-2" />
                  Try Demo First
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}