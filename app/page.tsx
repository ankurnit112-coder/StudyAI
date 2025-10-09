import { Button } from "@/components/ui/button"
import NavigationButton from "@/components/ui/navigation-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainNav from "@/components/navigation/main-nav"
import Footer from "@/components/layout/footer"
import { SafeImage } from "@/components/ui/safe-image"
import { studyAIImages } from "@/lib/image-utils"
import Link from "next/link"
import {
  Brain,
  TrendingUp,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  BarChart3,
  Target,
  GraduationCap,
  Calendar,
  Trophy,
  Smartphone,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <MainNav isAuthenticated={false} />

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 bg-section-light">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-3 sm:mb-4 lg:mb-6 bg-sky text-white text-xs sm:text-sm px-3 py-1">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {"Designed for CBSE Classes 9-12 Students"}
          </Badge>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-heading leading-tight px-2">
            Predict Your Board Exam Success with{" "}
            <span className="text-sky">
              AI-Powered Insights
            </span>
          </h1>
          <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-content mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-3">
            {
              "Get personalized study strategies, accurate performance predictions, and CBSE board exam guidance that adapts to your learning style. Perfect for Classes 9, 10, 11, and 12."
            }
          </p>
          <div className="flex flex-col gap-3 justify-center mb-6 sm:mb-8 lg:mb-12 px-3 sm:px-4">
            <NavigationButton
              href="/auth/signup"
              size="lg"
              className="bg-sky hover:bg-sky/90 text-white font-semibold px-6 py-4 text-base w-full sm:w-auto min-h-[48px] rounded-lg"
            >
              Get Started Now
            </NavigationButton>
            <NavigationButton
              href="/demo"
              size="lg"
              variant="outline"
              className="border-sky text-sky hover:bg-sky hover:text-white w-full sm:w-auto min-h-[48px] rounded-lg"
            >
              Watch Demo (2 min)
            </NavigationButton>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-content mb-6 sm:mb-8 lg:mb-12 px-1 sm:px-2">
            <div className="flex flex-col items-center professional-card p-2 sm:p-3 lg:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-sky mb-1">50K+</div>
              <div className="font-medium text-center text-xs sm:text-sm">CBSE Students</div>
            </div>
            <div className="flex flex-col items-center professional-card p-2 sm:p-3 lg:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-sage mb-1">95%</div>
              <div className="font-medium text-center text-xs sm:text-sm">Accuracy Rate</div>
            </div>
            <div className="flex flex-col items-center professional-card p-2 sm:p-3 lg:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow mb-1">15%</div>
              <div className="font-medium text-center text-xs sm:text-sm">Avg Score Boost</div>
            </div>
            <div className="flex flex-col items-center professional-card p-2 sm:p-3 lg:p-4 rounded-lg min-h-[80px] sm:min-h-[100px]">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-teal mb-1">4.8★</div>
              <div className="font-medium text-center text-xs sm:text-sm">Student Rating</div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-12 px-1 sm:px-2">
            <div className="relative max-w-full">
              <SafeImage
                src={studyAIImages.heroDashboard}
                alt="Modern dashboard interface showing student performance analytics, grade predictions, and study recommendations for CBSE board exam preparation"
                className="rounded-lg shadow-lg mx-auto w-full h-auto bg-white dark:bg-slate-800 p-1 sm:p-2 lg:p-4 border border-gray-200 dark:border-slate-700"
                loading="lazy"
                fallbackSrc="/images/hero-dashboard.svg"
                width={1200}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CBSE-Specific Features Section */}
      <section id="cbse-support" className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 bg-section-gray">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading px-2">
              {"Built Specifically for CBSE Board Exams"}
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-3 leading-relaxed">
              {
                "Our AI understands CBSE marking schemes, question patterns, and syllabus changes to give you the most accurate guidance."
              }
            </p>
            <div className="mb-8 sm:mb-12 px-2 sm:px-0">
              <div className="relative">
                <SafeImage
                  src={studyAIImages.cbseFeatures}
                  alt="CBSE textbooks and study materials showcasing updated 2024-25 syllabus, mobile learning apps, and bilingual educational resources for Classes 9-12"
                  className="rounded-lg shadow-lg mx-auto w-full h-auto bg-white dark:bg-slate-800 p-2 sm:p-4 border border-gray-200 dark:border-slate-700"
                  loading="lazy"
                  fallbackSrc="/images/cbse-features.svg"
                  width={1200}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="professional-card professional-hover">
              <CardHeader className="pb-3 sm:pb-4">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-sky mb-2 sm:mb-3" />
                <CardTitle className="text-navy dark:text-slate-200 text-base sm:text-lg">2024-25 Syllabus</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                  {"Updated with latest CBSE syllabus changes and reduced curriculum for all subjects."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="pb-3 sm:pb-4">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow mb-2 sm:mb-3" />
                <CardTitle className="text-card-title text-base sm:text-lg">Board Exam Prep</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-card-description">
                  {"Specialized preparation for Class 10 and 12 board exams with previous year analysis."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="pb-3 sm:pb-4">
                <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-sage mb-2 sm:mb-3" />
                <CardTitle className="text-card-title text-base sm:text-lg">Mobile-First Design</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-card-description">
                  {"Optimized for Indian students who primarily study on mobile devices."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="pb-3 sm:pb-4">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-teal mb-2 sm:mb-3" />
                <CardTitle className="text-card-title text-base sm:text-lg">Hindi & English</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-card-description">
                  {"Support for both Hindi and English medium students with bilingual interface."}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-sky/5 via-sage/5 to-teal/5 dark:from-sky-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading">
              {"Try StudyAI Features Now"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto px-2 leading-relaxed">
              {"Experience our AI-powered tools instantly. Click any feature below to explore how StudyAI can transform your CBSE board exam preparation."}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-12">
            <Link href="/study-plan">
              <Button variant="outline" className="h-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center space-y-2 sm:space-y-3 w-full hover:bg-sky/10 hover:border-sky transition-all duration-200 hover:scale-105 min-h-[100px] sm:min-h-[120px]">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-sky" />
                <span className="text-xs sm:text-sm font-medium text-center">AI Study Plans</span>
                <span className="text-xs text-gray-500 text-center hidden sm:block">Personalized study schedules</span>
              </Button>
            </Link>
            <Link href="/board-predictions">
              <Button variant="outline" className="h-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center space-y-2 sm:space-y-3 w-full hover:bg-sage/10 hover:border-sage transition-all duration-200 hover:scale-105 min-h-[100px] sm:min-h-[120px]">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-sage" />
                <span className="text-xs sm:text-sm font-medium text-center">Board Predictions</span>
                <span className="text-xs text-gray-500 text-center hidden sm:block">94%+ accurate predictions</span>
              </Button>
            </Link>
            <Link href="/performance">
              <Button variant="outline" className="h-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center space-y-2 sm:space-y-3 w-full hover:bg-teal/10 hover:border-teal transition-all duration-200 hover:scale-105 min-h-[100px] sm:min-h-[120px]">
                <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-teal" />
                <span className="text-xs sm:text-sm font-medium text-center">Analytics</span>
                <span className="text-xs text-gray-500 text-center hidden sm:block">Performance insights</span>
              </Button>
            </Link>
            <Link href="/cbse-classes">
              <Button variant="outline" className="h-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center space-y-2 sm:space-y-3 w-full hover:bg-yellow/10 hover:border-yellow transition-all duration-200 hover:scale-105 min-h-[100px] sm:min-h-[120px]">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-yellow" />
                <span className="text-xs sm:text-sm font-medium text-center">CBSE Classes</span>
                <span className="text-xs text-gray-500 text-center hidden sm:block">Classes 9-12 support</span>
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {"✨ All features work with demo data - no signup required to explore!"}
            </p>
            <Link href="/auth/signup">
              <Button className="bg-sky hover:bg-sky/90 text-white">
                <GraduationCap className="h-4 w-4 mr-2" />
                Sign Up for Real Data
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-section-light">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading">
              {"AI-Powered Features for Academic Excellence"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto px-2 leading-relaxed">
              {"Advanced AI analyzes your performance against 10 years of CBSE data to provide personalized insights."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-sky mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Board Exam Prediction</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {
                    "Get accurate predictions for your Class 10/12 board exam scores based on current performance and CBSE trends."
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-sage mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Subject-Wise Study Plans</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {
                    "Customized study schedules for Physics, Chemistry, Math, Biology, and other CBSE subjects with chapter-wise breakdown."
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-yellow mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Performance Analytics</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {"Real-time tracking of your progress with detailed insights into strengths and improvement areas."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-teal mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Competitive Exam Prep</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {"Integrated preparation for JEE, NEET, and other competitive exams alongside board exam prep."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-sky mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Parent Dashboard</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {"Parents receive weekly progress reports and can monitor study habits and performance trends."}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="professional-card professional-hover">
              <CardHeader className="p-4 sm:p-6">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-sage mb-3 sm:mb-4" />
                <CardTitle className="text-card-title text-base sm:text-lg">Smart Revision</CardTitle>
                <CardDescription className="text-card-description text-sm sm:text-base">
                  {"AI-powered revision schedules that adapt based on your retention patterns and exam dates."}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 bg-section-gray">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading">
              {"How StudyAI Works"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto px-2 leading-relaxed">
              {"Simple 3-step process to unlock your academic potential with AI-powered insights."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative">
            <div className="hidden lg:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-sky/30"></div>
            <div className="hidden lg:block absolute top-8 right-1/3 w-1/3 h-0.5 bg-sky/30"></div>

            <div className="text-center">
              <div className="bg-sky text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-heading">{"Quick Assessment"}</h3>
              <p className="text-sm sm:text-base text-content mb-4 sm:mb-6 px-2">
                {
                  "Take a 15-minute assessment covering your current class subjects. Input your recent test scores and study preferences."
                }
              </p>
              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border">
                <SafeImage
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
                  alt="Indian student taking CBSE assessment on laptop with study materials, showcasing the initial evaluation process for personalized AI recommendations"
                  className="rounded-lg mx-auto w-full max-w-xs object-cover h-32 sm:h-40 lg:h-48"
                  loading="lazy"
                  fallbackSrc="/images/student-studying.svg"
                  width={400}
                  height={300}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="bg-sage text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-heading">{"AI Analysis"}</h3>
              <p className="text-sm sm:text-base text-content mb-4 sm:mb-6 px-2">
                {
                  "Our AI compares your data with CBSE board patterns and 50,000+ student records to predict your performance."
                }
              </p>
              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border">
                <SafeImage
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
                  alt="AI and machine learning visualization showing data analysis, neural networks processing CBSE student performance patterns and generating predictive insights"
                  className="rounded-lg mx-auto w-full max-w-xs object-cover h-32 sm:h-40 lg:h-48"
                  loading="lazy"
                  fallbackSrc="/images/ai-brain-analysis.svg"
                  width={400}
                  height={300}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="bg-teal text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-heading">{"Personalized Plan"}</h3>
              <p className="text-sm sm:text-base text-content mb-4 sm:mb-6 px-2">
                {"Receive your customized study plan with daily tasks, revision schedules, and progress tracking."}
              </p>
              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border">
                <SafeImage
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
                  alt="Organized study schedule and planner showing personalized CBSE study plan with daily tasks, revision timetable, and progress tracking for board exam preparation"
                  className="rounded-lg mx-auto w-full max-w-xs object-cover h-32 sm:h-40 lg:h-48"
                  loading="lazy"
                  fallbackSrc="/images/personalized-study-plan.svg"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 bg-section-light">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading">
              {"Success Stories from CBSE Students"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto px-2 leading-relaxed">
              {"Real results from students across India who improved their board exam performance."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="professional-card professional-hover">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow fill-current"
                    />
                  ))}
                </div>
                <p className="text-strong mb-3 sm:mb-4 text-sm sm:text-base">
                  {
                    "StudyAI predicted my Physics board exam score within 2 marks! The chapter-wise study plan helped me go from 65% to 89% in Class 12."
                  }
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky rounded-full flex items-center justify-center text-white font-semibold mr-2 sm:mr-3 text-sm sm:text-base">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-sm sm:text-base">Arjun Sharma</p>
                    <p className="text-xs sm:text-sm text-muted">Class 12, Delhi - 89% in Boards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card professional-hover">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow fill-current"
                    />
                  ))}
                </div>
                <p className="text-strong mb-3 sm:mb-4 text-sm sm:text-base">
                  {
                    "The parent dashboard helped me track my daughter's progress. She scored 95% in Class 10 boards - exactly as StudyAI predicted!"
                  }
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage rounded-full flex items-center justify-center text-white font-semibold mr-2 sm:mr-3 text-sm sm:text-base">
                    P
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-sm sm:text-base">Priya Patel</p>
                    <p className="text-xs sm:text-sm text-muted">Parent, Mumbai - Daughter scored 95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card professional-hover sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow fill-current"
                    />
                  ))}
                </div>
                <p className="text-strong mb-3 sm:mb-4 text-sm sm:text-base">
                  {
                    "The CBSE-specific guidance helped me understand marking schemes. My English writing improved from 12/20 to 18/20 in boards!"
                  }
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal rounded-full flex items-center justify-center text-white font-semibold mr-2 sm:mr-3 text-sm sm:text-base">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-heading text-sm sm:text-base">Sneha Gupta</p>
                    <p className="text-xs sm:text-sm text-muted">Class 10, Bangalore - 92% in Boards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-section-gray">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-heading">
              {"Experience StudyAI Interface"}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-content max-w-2xl mx-auto px-2 leading-relaxed">
              {"Take a closer look at our intuitive dashboard and powerful features designed specifically for CBSE students."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                <SafeImage
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center&auto=format&q=80"
                  alt="StudyAI main dashboard showing performance overview, upcoming exams, and AI recommendations for CBSE students"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-heading mb-1 sm:mb-2 text-sm sm:text-base">Main Dashboard</h3>
                  <p className="text-xs sm:text-sm text-muted">Your academic command center with AI insights</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                <SafeImage
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center&auto=format&q=80"
                  alt="Performance analytics page showing detailed charts, grade trends, and subject-wise analysis for CBSE board exam preparation"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-heading mb-1 sm:mb-2 text-sm sm:text-base">Performance Analytics</h3>
                  <p className="text-xs sm:text-sm text-muted">Detailed insights into your academic progress</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
                <SafeImage
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&crop=center&auto=format&q=80"
                  alt="Personalized study planner interface showing daily schedules, revision timetables, and task management for CBSE exam preparation"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-heading mb-1 sm:mb-2 text-sm sm:text-base">Study Planner</h3>
                  <p className="text-xs sm:text-sm text-muted">AI-generated personalized study schedules</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <NavigationButton
              href="/demo"
              size="lg"
              className="bg-sky hover:bg-sky/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
            >
              Explore All Features
            </NavigationButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-navy dark:bg-slate-950">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white dark:text-slate-100">
            {"Ready to Ace Your Board Exams?"}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            {
              "Join 50,000+ CBSE students who are already using AI to improve their board exam scores. Get started today."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0">
            <NavigationButton
              href="/auth/signup"
              size="lg"
              className="bg-yellow hover:bg-yellow/90 text-navy font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started - Classes 9-12
            </NavigationButton>
            <NavigationButton
              href="/demo"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-navy w-full sm:w-auto"
            >
              Watch Demo
            </NavigationButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky mr-1 sm:mr-2" />
              {"Quick setup"}
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky mr-1 sm:mr-2" />
              {"Full access"}
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-sky mr-1 sm:mr-2" />
              {"Start immediately"}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
