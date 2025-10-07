import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoNotice() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-blue-800">
          <strong>Demo Mode:</strong> This page shows sample data for demonstration purposes. 
          Sign up to access real personalized features with your academic data.
        </div>
        <div className="flex space-x-2 ml-4">
          <Link href="/auth/signup">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <ExternalLink className="h-3 w-3 mr-1" />
              Sign Up
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  )
}