"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { LoadingSpinner } from "./loading-spinner"

interface NavigationButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  href?: string
  children: React.ReactNode
  external?: boolean
  scroll?: boolean
  onClick?: () => void
}

export default function NavigationButton({ 
  href, 
  children, 
  external = false, 
  scroll = true, 
  onClick,
  disabled,
  ...props 
}: NavigationButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    // Prevent double clicks
    if (isLoading || disabled) return
    
    try {
      setIsLoading(true)
      
      // If custom onClick is provided, use it
      if (onClick) {
        await onClick()
        return
      }
      
      // If no href is provided, do nothing
      if (!href) return
      
      // Handle anchor links (scroll to section)
      if (href.startsWith('#')) {
        if (typeof document !== 'undefined') {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ 
              behavior: scroll ? 'smooth' : 'auto',
              block: 'start'
            })
          }
        }
        return
      }
      
      // Handle external links
      if (external || href.startsWith('http')) {
        if (typeof window !== 'undefined') {
          window.open(href, '_blank', 'noopener,noreferrer')
        }
        return
      }
      
      // Handle internal navigation
      router.push(href)
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Navigation error:', error)
      }
      // Handle navigation errors gracefully
      if (href) {
        // Fallback to window.location for critical navigation
        window.location.href = href
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button 
      onClick={handleClick} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}