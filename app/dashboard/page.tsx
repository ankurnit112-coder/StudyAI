import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import EnhancedDashboard from "@/components/dashboard/enhanced-dashboard"
import Footer from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={true} />
      <MobileNav isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <ErrorBoundary>
          <EnhancedDashboard />
        </ErrorBoundary>
      </div>
      
      <Footer />
    </div>
  )
}