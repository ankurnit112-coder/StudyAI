"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PredictionForm from "@/components/ui/prediction-form"
import Link from "next/link"
import {
  Brain,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Users,
  Clock,
} from "lucide-react"

interface PredictionResult {
  subject: string
  currentScore: number
  predictedScore: number
  confidence: number
  improvement: number
  recommendations: string[]
}

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  // const [isLoading, setIsLoading] = useState(false)

  // Sample prediction results
  const samplePredictions: PredictionResult[] = [
    {
      subject: "Mathematics",
      currentScore: 85,
      predictedScore: 92,
      confidence: 94,
      improvement: 7,
      recommendations: [
        "Focus on integration by parts problems",
        "Practice coordinate geometry daily",
        "Review calculus fundamentals"
      ]
    },
    {
      subject: "Physics",
      currentScore: 78,
      predictedScore: 84,
      confidence: 89,
      improvement: 6,
      recommendations: [
        "Strengthen mechanics concepts",
        "Practice numerical problems",
        "Review wave theory"
      ]
    },
    {
      subject: "Chemistry",
      currentScore: 82,
      predictedScore: 87,
      confidence: 91,
      improvement: 5,
      recommendations: [
        "Focus on organic chemistry reactions",
        "Practice inorganic chemistry",
        "Review physical chemistry formulas"
      ]
    }
  ]

  const handlePredictionComplete = () => {
    setPredictions(samplePredictions)
    setActiveTab("results")
  }

  const overallStats = {
    averagePredicted: 87.7,
    averageConfidence: 91.3,
    totalImprovement: 18,
    strongestSubject: "Mathematics",
    focusArea: "Physics"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="h-8 w-8 text-sky" />
          <h1 className="text-3xl font-bold text-navy">AI Board Exam Predictions</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get accurate CBSE board exam score predictions powered by advanced AI models trained on 
          thousands of student performance data points.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          <div className="text-center p-4 bg-sky/10 rounded-lg">
            <div className="text-2xl font-bold text-sky">94%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center p-4 bg-sage/10 rounded-lg">
            <div className="text-2xl font-bold text-sage">50K+</div>
            <div className="text-sm text-gray-600">Predictions Made</div>
          </div>
          <div className="text-center p-4 bg-yellow/10 rounded-lg">
            <div className="text-2xl font-bold text-yellow">15%</div>
            <div className="text-sm text-gray-600">Avg Improvement</div>
          </div>
          <div className="text-center p-4 bg-teal/10 rounded-lg">
            <div className="text-2xl font-bold text-teal">2 min</div>
            <div className="text-sm text-gray-600">Quick Results</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="generate">Generate Predictions</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
          <TabsTrigger value="history">Prediction History</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-sky" />
                    <span>AI Prediction Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Enter your academic information to get personalized board exam predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionForm onComplete={handlePredictionComplete} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-sage" />
                    <span>How It Works</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-sky/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sky font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy">Input Data</h4>
                      <p className="text-sm text-gray-600">Provide your recent test scores and academic information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sage font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy">AI Analysis</h4>
                      <p className="text-sm text-gray-600">Our ML models analyze patterns and trends in your performance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-teal/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-teal font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy">Get Predictions</h4>
                      <p className="text-sm text-gray-600">Receive accurate board exam predictions with confidence scores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="h-6 w-6 text-yellow" />
                    <h3 className="font-semibold text-navy">Proven Accuracy</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI models have been trained on data from over 50,000 CBSE students and 
                    consistently achieve 94%+ accuracy in board exam predictions.
                  </p>
                  <div className="flex items-center text-xs text-sky font-medium">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Validated by educational experts</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {predictions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Predictions Yet</h3>
                <p className="text-gray-500 mb-6">
                  Generate your first AI prediction to see detailed board exam forecasts
                </p>
                <Button 
                  onClick={() => setActiveTab("generate")}
                  className="bg-sky hover:bg-sky/90 text-white"
                >
                  Generate Predictions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Summary */}
              <Card className="bg-gradient-to-r from-sky/10 via-sage/10 to-teal/10 border-sky/20">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-navy">{overallStats.averagePredicted}%</div>
                      <div className="text-sm text-gray-600">Predicted Average</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-sage">{overallStats.averageConfidence}%</div>
                      <div className="text-sm text-gray-600">Confidence Level</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow">+{overallStats.totalImprovement}%</div>
                      <div className="text-sm text-gray-600">Total Improvement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal">{overallStats.strongestSubject}</div>
                      <div className="text-sm text-gray-600">Strongest Subject</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject-wise Predictions */}
              <div className="grid gap-6">
                {predictions.map((prediction, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-navy">{prediction.subject}</h3>
                          <p className="text-gray-600">Board Exam Prediction</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-sky">{prediction.predictedScore}%</div>
                          <div className="text-sm text-gray-600">{prediction.confidence}% confidence</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-navy mb-3">Current vs Predicted</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Current Score</span>
                                <span>{prediction.currentScore}%</span>
                              </div>
                              <Progress value={prediction.currentScore} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Predicted Score</span>
                                <span className="text-sky font-semibold">{prediction.predictedScore}%</span>
                              </div>
                              <Progress value={prediction.predictedScore} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-navy mb-3">Improvement Potential</h4>
                          <div className="text-center p-4 bg-sage/10 rounded-lg">
                            <div className="text-2xl font-bold text-sage">+{prediction.improvement}%</div>
                            <div className="text-sm text-gray-600">Expected Improvement</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-navy mb-3">AI Recommendations</h4>
                          <div className="space-y-2">
                            {prediction.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <CheckCircle className="h-3 w-3 text-sage mt-1 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/study-plan">
                  <Button className="bg-sky hover:bg-sky/90 text-white">
                    <Target className="h-4 w-4 mr-2" />
                    Create Study Plan
                  </Button>
                </Link>
                <Link href="/performance">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Performance Analytics
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab("generate")}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate New Predictions
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal" />
                <span>Prediction History</span>
              </CardTitle>
              <CardDescription>
                Track your prediction accuracy and progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No History Available</h3>
                <p className="text-gray-500 mb-6">
                  Your prediction history will appear here as you generate more predictions
                </p>
                <Button 
                  onClick={() => setActiveTab("generate")}
                  variant="outline"
                >
                  Generate Your First Prediction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-sky" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-sky/10 rounded-lg border border-sky/20">
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-sky mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-navy">Performance Pattern</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Students with similar profiles typically improve by 12-18% with focused study plans.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sage/10 rounded-lg border border-sage/20">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-sage mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-navy">Improvement Opportunity</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Your strongest improvement potential is in Mathematics and Physics concepts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow/10 rounded-lg border border-yellow/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-navy">Focus Areas</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Concentrate on problem-solving techniques and time management for optimal results.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal" />
                  <span>Peer Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-teal/10 rounded-lg">
                  <div className="text-2xl font-bold text-teal">Top 15%</div>
                  <div className="text-sm text-gray-600">Your predicted rank in class</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your Predicted Average</span>
                    <span className="font-semibold">87.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Class Average</span>
                    <span>76.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Performer</span>
                    <span>94.5%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    You&apos;re predicted to perform better than 85% of students in your class.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}