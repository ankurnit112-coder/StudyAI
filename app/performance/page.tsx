import EnhancedPerformanceAnalytics from "@/components/performance/enhanced-performance-analytics"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={true} />
      <MobileNav isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <EnhancedPerformanceAnalytics />
      </div>
      
      <Footer />
    </div>
  )
}