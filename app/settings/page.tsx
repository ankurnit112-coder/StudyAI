import SettingsPage from "@/components/settings/settings-page"
import MainNav from "@/components/navigation/main-nav"
import MobileNav from "@/components/mobile/mobile-nav"
import Footer from "@/components/layout/footer"

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav isAuthenticated={false} />
      <MobileNav isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <SettingsPage />
      </div>
      
      <Footer />
    </div>
  )
}