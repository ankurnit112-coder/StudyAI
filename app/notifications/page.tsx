import NotificationSystem from "@/components/notifications/notification-system"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={true} />
      <MobileNav isAuthenticated={true} />
      
      <div className="container mx-auto py-8 px-4 pb-20 md:pb-8">
        <NotificationSystem />
      </div>
      
      <Footer />
    </div>
  )
}