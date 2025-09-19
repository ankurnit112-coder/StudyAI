import StudyRecommendations from "@/components/academic/study-recommendations"
import PredictionForm from "@/components/ui/prediction-form"
import SmartStudyPlanner from "@/components/study/smart-study-planner"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudyPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={true} userRole="student" />
      <MobileNav isAuthenticated={true} />
      
      <div className="container mx-auto py-8 px-4 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-4">AI-Powered Study Planning</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized CBSE board exam predictions, smart study schedules, and AI-powered recommendations
          </p>
        </div>
        
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="planner">Smart Planner</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Study Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="space-y-6">
            <SmartStudyPlanner />
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6">
            <PredictionForm />
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            <StudyRecommendations />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  )
}