import PredictionForm from "@/components/ui/prediction-form"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"
import DemoNotice from "@/components/ui/demo-notice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Target, BarChart3, CheckCircle } from "lucide-react"

export default function BoardPredictionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={false} />
      <MobileNav isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <DemoNotice />
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-sky" />
            <h1 className="text-3xl font-bold text-navy">CBSE Board Exam Predictions</h1>
            <Badge className="bg-sky text-white">AI-Powered</Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate predictions for your Class 10/12 board exam scores with 94%+ accuracy. 
            Our AI analyzes your performance against 10 years of CBSE data to provide personalized insights.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky">94%+</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sage">15</div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow">50K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">10</div>
              <div className="text-sm text-gray-600">Years Data</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Prediction Form */}
          <div className="lg:col-span-2">
            <PredictionForm />
          </div>

          {/* Sidebar with Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-sky" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sky text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm">Input Your Scores</h4>
                    <p className="text-xs text-gray-600">Enter your recent exam scores and academic details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm">AI Analysis</h4>
                    <p className="text-xs text-gray-600">Our AI compares with 50,000+ student records</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm">Get Predictions</h4>
                    <p className="text-xs text-gray-600">Receive accurate board exam score predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sky/10 to-sage/10 border-sky/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-sky" />
                  <span>Prediction Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mathematics</span>
                    <span className="text-sm font-semibold text-sky">96.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Physics</span>
                    <span className="text-sm font-semibold text-sage">95.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Chemistry</span>
                    <span className="text-sm font-semibold text-teal">95.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">English</span>
                    <span className="text-sm font-semibold text-yellow">94.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-sage" />
                  <span>What You Get</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Subject-wise score predictions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Confidence level indicators</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Grade predictions (A+, A, B+, etc.)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Improvement recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Study focus areas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}