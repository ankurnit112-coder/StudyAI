"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  Headphones,
  Globe,
  Building,
  Calendar,
  ExternalLink,
  Star,
  Heart,
  Award,
  Target,
  Zap,
  Shield,
  Upload,
  X,
  FileText,
  Image,
} from "lucide-react"

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  category: string
  priority: string
  message: string
}

interface AttachedFile {
  name: string
  size: number
  type: string
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact")
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    priority: "medium",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileUploadError, setFileUploadError] = useState<string>("")

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const errors: Partial<ContactForm> = {}
    
    if (!formData.name.trim()) errors.name = "Name is required"
    else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters"
    
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format"
    
    if (formData.phone && !/^[\+]?[1-9][\d]{9,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = "Invalid phone number format (10-15 digits required)"
    }
    
    if (!formData.category) errors.category = "Please select a category"
    if (!formData.subject.trim()) errors.subject = "Subject is required"
    else if (formData.subject.trim().length < 5) errors.subject = "Subject must be at least 5 characters"
    
    if (!formData.message.trim()) errors.message = "Message is required"
    else if (formData.message.length < 10) errors.message = "Message must be at least 10 characters"
    else if (formData.message.length > 1000) errors.message = "Message must be less than 1000 characters"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.1) {
        setSubmitStatus('success')
        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          category: "",
          priority: "medium",
          message: ""
        })
        setFormErrors({})
        setAttachedFiles([])
        setFileUploadError("")
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    setFileUploadError("")
    const newFiles: AttachedFile[] = []
    const errors: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} is too large (max 10MB)`)
        continue
      }
      
      // Check file type
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.txt']
      const fileExtension = file.name.lastIndexOf('.') !== -1 
        ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
        : ''
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        errors.push(`${file.name} is not a supported file type`)
        continue
      }
      
      // Check if we already have this file
      if (attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name} is already attached`)
        continue
      }
      
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type
      })
    }
    
    // Check total file limit
    const totalFiles = attachedFiles.length + newFiles.length
    if (totalFiles > 5) {
      const allowedNewFiles = 5 - attachedFiles.length
      if (allowedNewFiles > 0) {
        setAttachedFiles(prev => [...prev, ...newFiles.slice(0, allowedNewFiles)])
        errors.push(`Only ${allowedNewFiles} more files can be added (max 5 total)`)
      } else {
        errors.push("Maximum 5 files allowed")
      }
    } else {
      setAttachedFiles(prev => [...prev, ...newFiles])
    }
    
    if (errors.length > 0) {
      setFileUploadError(errors.join(', '))
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      detail: "Available 24/7 for urgent issues",
      action: "Start Chat",
      status: "Online",
      statusColor: "bg-green-100 text-green-800",
      bgColor: "bg-sky/20",
      iconColor: "text-sky"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      detail: "support@studyai.com",
      action: "Send Email",
      status: "Response in 24h",
      statusColor: "bg-blue-100 text-blue-800",
      bgColor: "bg-sage/20",
      iconColor: "text-sage"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      detail: "+91 1800-123-4567",
      action: "Call Now",
      status: "Mon-Fri 9AM-6PM",
      statusColor: "bg-purple-100 text-purple-800",
      bgColor: "bg-teal/20",
      iconColor: "text-teal"
    },
    {
      icon: Calendar,
      title: "Schedule a Call",
      description: "Book a personalized demo",
      detail: "30-minute consultation",
      action: "Book Meeting",
      status: "Free",
      statusColor: "bg-orange-100 text-orange-800",
      bgColor: "bg-navy/20",
      iconColor: "text-navy"
    }
  ]

  const officeLocations = [
    {
      city: "Mumbai",
      address: "WeWork, Bandra Kurla Complex, Mumbai 400051",
      phone: "+91 22 1234 5678",
      email: "mumbai@studyai.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      isHeadquarters: true
    },
    {
      city: "Delhi",
      address: "Cyber Hub, DLF Phase 2, Gurugram 122002",
      phone: "+91 11 1234 5678",
      email: "delhi@studyai.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      isHeadquarters: false
    },
    {
      city: "Bangalore",
      address: "Koramangala, Bangalore 560034",
      phone: "+91 80 1234 5678",
      email: "bangalore@studyai.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      isHeadquarters: false
    }
  ]

  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Customer Success Manager",
      email: "priya@studyai.com",
      speciality: "Student Onboarding & Success",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Rahul Gupta",
      role: "Technical Support Lead",
      email: "rahul@studyai.com",
      speciality: "Technical Issues & Integration",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Anita Patel",
      role: "Academic Advisor",
      email: "anita@studyai.com",
      speciality: "CBSE Curriculum & Study Plans",
      image: "/api/placeholder/80/80"
    }
  ]

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "Live chat: Instant, Email: Within 24 hours, Phone: Immediate during business hours"
    },
    {
      question: "Do you offer phone support in regional languages?",
      answer: "Yes! We provide support in Hindi, English, and major regional languages"
    },
    {
      question: "Can I schedule a demo for my school?",
      answer: "Absolutely! We offer free demos for schools and educational institutions"
    },
    {
      question: "Is there a dedicated support for parents?",
      answer: "Yes, we have specialized parent support to help with account setup and monitoring"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Headphones className="h-8 w-8 text-sky" />
          <h1 className="text-4xl font-bold text-navy">Contact Us</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          We're here to help you succeed! Get in touch with our team for support, 
          questions, or to learn more about how StudyAI can transform your CBSE board exam preparation.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky">24/7</div>
            <div className="text-sm text-gray-600">Live Chat Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sage">&lt; 24h</div>
            <div className="text-sm text-gray-600">Email Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal">98%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">3</div>
            <div className="text-sm text-gray-600">Office Locations</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="contact">Contact Methods</TabsTrigger>
          <TabsTrigger value="form">Send Message</TabsTrigger>
          <TabsTrigger value="offices">Our Offices</TabsTrigger>
          <TabsTrigger value="team">Meet Our Team</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-8">
          {/* Contact Methods */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${method.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                        <method.icon className={`h-6 w-6 ${method.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-navy">{method.title}</h3>
                          <Badge className={method.statusColor}>
                            {method.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        <p className="text-sm font-medium text-gray-800 mb-4">{method.detail}</p>
                        <Button 
                          size="sm" 
                          className="bg-sky hover:bg-sky/90 text-white"
                          onClick={() => {
                            if (method.title === "Live Chat Support") {
                              // Open chat widget or redirect to chat
                              window.open('https://tawk.to/chat', '_blank')
                            } else if (method.title === "Email Support") {
                              window.location.href = `mailto:${method.detail}?subject=StudyAI Support Request`
                            } else if (method.title === "Phone Support") {
                              window.location.href = `tel:${method.detail}`
                            } else if (method.title === "Schedule a Call") {
                              window.open('https://calendly.com/studyai-demo', '_blank')
                            }
                          }}
                        >
                          {method.action}
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Hours */}
          <Card className="bg-gradient-to-r from-sky/10 to-sage/10 border-sky/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-sky" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Support Hours</h3>
                    <p className="text-gray-600">We're here when you need us most</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="font-medium">Live Chat: 24/7</div>
                  <div>Phone: Mon-Fri 9AM-6PM IST</div>
                  <div>Email: Always open</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Quick Answers</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/help">
                <Button variant="outline">
                  View All FAQs
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="form" className="space-y-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-6 text-center">Send us a Message</h2>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange("name", e.target.value)
                          if (formErrors.name) {
                            setFormErrors(prev => ({ ...prev, name: undefined }))
                          }
                        }}
                        className={formErrors.name ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => {
                          handleInputChange("email", e.target.value)
                          if (formErrors.email) {
                            setFormErrors(prev => ({ ...prev, email: undefined }))
                          }
                        }}
                        className={formErrors.email ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        handleInputChange("phone", e.target.value)
                        if (formErrors.phone) {
                          setFormErrors(prev => ({ ...prev, phone: undefined }))
                        }
                      }}
                      className={formErrors.phone ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.phone}
                      </p>
                    )}
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                        Category *
                      </Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => {
                          handleInputChange("category", value)
                          if (formErrors.category) {
                            setFormErrors(prev => ({ ...prev, category: undefined }))
                          }
                        }}
                      >
                        <SelectTrigger className={formErrors.category ? "border-red-500 focus:border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Pricing</SelectItem>
                          <SelectItem value="academic">Academic Questions</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.category && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.category}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium text-gray-700 mb-2 block">
                        Priority
                      </Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => {
                        handleInputChange("subject", e.target.value)
                        if (formErrors.subject) {
                          setFormErrors(prev => ({ ...prev, subject: undefined }))
                        }
                      }}
                      className={formErrors.subject ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {formErrors.subject && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your question or issue..."
                      className={`min-h-[120px] resize-none ${formErrors.message ? "border-red-500 focus:border-red-500" : ""}`}
                      value={formData.message}
                      onChange={(e) => {
                        handleInputChange("message", e.target.value)
                        if (formErrors.message) {
                          setFormErrors(prev => ({ ...prev, message: undefined }))
                        }
                      }}
                      maxLength={1000}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      {formErrors.message ? (
                        <p className="text-red-500 text-xs flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.message}
                        </p>
                      ) : (
                        <div></div>
                      )}
                      <p className="text-xs text-gray-500">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Attachments (Optional)
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver 
                          ? 'border-sky bg-sky/5' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragOver(true)
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragOver(true)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Only set to false if we're leaving the drop zone entirely
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setIsDragOver(false)
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsDragOver(false)
                        handleFileUpload(e.dataTransfer.files)
                      }}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or{' '}
                        <label className="text-sky hover:text-sky/80 cursor-pointer font-medium">
                          browse
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={(e) => {
                              handleFileUpload(e.target.files)
                              // Reset the input so the same file can be selected again
                              e.target.value = ''
                            }}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">
                        Max 5 files, 10MB each. Supported: JPG, PNG, PDF, DOC, TXT
                      </p>
                    </div>

                    {/* File Upload Error */}
                    {fileUploadError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          {fileUploadError}
                        </p>
                      </div>
                    )}

                    {/* Attached Files */}
                    {attachedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              {file.type.startsWith('image/') ? (
                                <Image className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-500" />
                              )}
                              <span className="text-sm text-gray-700 truncate flex-1 min-w-0">{file.name}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                removeFile(index)
                                setFileUploadError("")
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                              title="Remove file"
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-800">Message Sent Successfully!</h4>
                          <p className="text-sm text-green-700">
                            Thank you for contacting us. We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-800">Failed to Send Message</h4>
                          <p className="text-sm text-red-700">
                            Please try again or contact us directly at support@studyai.com
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-sky hover:bg-sky/90 text-white h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    We typically respond within 24 hours. For urgent issues, please use live chat or call us directly.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offices" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Our Office Locations</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {officeLocations.map((office, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-navy text-lg">{office.city}</h3>
                      {office.isHeadquarters && (
                        <Badge className="bg-sky/20 text-sky">
                          <Building className="h-3 w-3 mr-1" />
                          HQ
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600">{office.phone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600">{office.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600">{office.hours}</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        const address = encodeURIComponent(office.address)
                        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-sky/20 to-sage/20 relative rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-16 w-16 text-sky mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-navy mb-2">Interactive Office Map</h3>
                    <p className="text-gray-600">Find our offices across India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Meet Our Support Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky/20 to-sage/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-sky" />
                    </div>
                    <h3 className="font-semibold text-navy mb-1">{member.name}</h3>
                    <p className="text-sm text-sky mb-2">{member.role}</p>
                    <p className="text-xs text-gray-600 mb-4">{member.speciality}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        window.location.href = `mailto:${member.email}?subject=StudyAI Support - ${member.speciality}`
                      }}
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      Contact {member.name.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-sky mx-auto mb-2" />
                <div className="text-2xl font-bold text-navy">50+</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-sage mx-auto mb-2" />
                <div className="text-2xl font-bold text-navy">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-teal mx-auto mb-2" />
                <div className="text-2xl font-bold text-navy">&lt; 2min</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-navy">24/7</div>
                <div className="text-sm text-gray-600">Always Here</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-sky to-sage text-white">
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-2">Still Have Questions?</h2>
          <p className="mb-6 opacity-90">
            Our team is standing by to help you succeed with StudyAI. 
            Don't hesitate to reach out - we're here for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-sky hover:bg-gray-50"
              onClick={() => window.open('https://tawk.to/chat', '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Help Center
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}