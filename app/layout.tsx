import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import PWAInstall from '@/components/pwa/pwa-install'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyAI - AI-Powered CBSE Board Exam Preparation',
  description: 'Get personalized study plans, accurate performance predictions, and AI-powered insights for CBSE board exam success. Built specifically for Classes 9-12.',
  generator: 'StudyAI',
  keywords: 'CBSE, board exams, AI tutoring, study plan, academic performance, Class 10, Class 12, India education',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StudyAI',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'StudyAI',
    title: 'StudyAI - AI-Powered CBSE Board Exam Preparation',
    description: 'Get personalized study plans, accurate performance predictions, and AI-powered insights for CBSE board exam success.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyAI - AI-Powered CBSE Board Exam Preparation',
    description: 'Get personalized study plans, accurate performance predictions, and AI-powered insights for CBSE board exam success.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <PWAInstall />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
