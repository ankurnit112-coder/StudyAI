"use client"

import { useState } from "react"
import { authService } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

import { Brain, Mail, Lock, User, ArrowLeft, GraduationCap, Eye, EyeOff, CheckCircle, Shield, Smartphone, Star } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Save email for future convenience
      authService.saveRememberedEmail(formData.email)
      
      // Create account using auth service
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'student'
      })
      
      // Redirect to dashboard after successful signup
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Calculate password strength
    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength += 25
      if (/[A-Z]/.test(value)) strength += 25
      if (/[0-9]/.test(value)) strength += 25
      if (/[^A-Za-z0-9]/.test(value)) strength += 25
      setPasswordStrength(strength)
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-yellow-500"
    if (passwordStrength <= 75) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/10 via-white to-sage/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-sky hover:opacity-80 transition-opacity mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-sky" />
              <span className="text-2xl font-bold text-navy">StudyAI</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-navy">Create your account</h2>
          <p className="mt-2 text-gray-600">Get started with AI-powered CBSE exam preparation</p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Join StudyAI</CardTitle>
            <CardDescription className="text-base">
              Start your AI-powered CBSE exam preparation journey
            </CardDescription>
            <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow fill-current" />
                <span>50K+ Students</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free Trial</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex-shrink-0"></div>
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-sky focus:ring-sky"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-sky focus:ring-sky"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-sky focus:ring-sky"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength <= 25 ? "text-red-600" :
                        passwordStrength <= 50 ? "text-yellow-600" :
                        passwordStrength <= 75 ? "text-blue-600" : "text-green-600"
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-sky focus:ring-sky"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">I am a:</Label>
                <RadioGroup value={formData.role} onValueChange={handleRoleChange}>
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-sky transition-colors">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="w-8 h-8 bg-sky/20 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-sky" />
                      </div>
                      <div>
                        <div className="font-medium">Student</div>
                        <div className="text-xs text-gray-600">Classes 9-12 CBSE</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-sky hover:text-sky/80 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-sky hover:text-sky/80 font-medium">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-sky hover:bg-sky/90 text-white h-12 text-base font-medium"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full h-12 text-base">
                    Sign in instead
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Smartphone className="h-3 w-3" />
                  <span>Mobile Ready</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Free Trial</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}