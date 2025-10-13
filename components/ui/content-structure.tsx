"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface ContentSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'section' | 'article' | 'div'
}

interface SectionHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

interface ContentBlockProps {
  children: React.ReactNode
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

interface TextBlockProps {
  children: React.ReactNode
  className?: string
  variant?: 'paragraph' | 'lead' | 'small' | 'caption'
}

// Content Section Component - Provides proper semantic structure
export function ContentSection({ 
  children, 
  className, 
  id, 
  as: Component = 'section' 
}: ContentSectionProps) {
  return (
    <Component 
      id={id}
      className={cn(
        "content-section",
        "py-8 sm:py-12 lg:py-16",
        "px-4 sm:px-6 lg:px-8",
        "space-y-6 sm:space-y-8 lg:space-y-12",
        className
      )}
    >
      {children}
    </Component>
  )
}

// Section Heading Component - Provides proper heading hierarchy
export function SectionHeading({ 
  level, 
  children, 
  className, 
  id 
}: SectionHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
  
  const baseStyles = "font-bold text-heading leading-tight"
  const sizeStyles = {
    1: "text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6",
    2: "text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4",
    3: "text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3",
    4: "text-lg sm:text-xl lg:text-2xl mb-2",
    5: "text-base sm:text-lg lg:text-xl mb-1 sm:mb-2",
    6: "text-sm sm:text-base lg:text-lg mb-1"
  }
  
  return (
    <HeadingTag 
      id={id}
      className={cn(
        baseStyles,
        sizeStyles[level],
        "section-heading",
        className
      )}
    >
      {children}
    </HeadingTag>
  )
}

// Content Block Component - Provides proper content spacing
export function ContentBlock({ 
  children, 
  className, 
  spacing = 'normal' 
}: ContentBlockProps) {
  const spacingStyles = {
    tight: "space-y-2 sm:space-y-3",
    normal: "space-y-4 sm:space-y-6",
    loose: "space-y-6 sm:space-y-8 lg:space-y-12"
  }
  
  return (
    <div 
      className={cn(
        "content-block",
        spacingStyles[spacing],
        className
      )}
    >
      {children}
    </div>
  )
}

// Text Block Component - Provides proper text formatting
export function TextBlock({ 
  children, 
  className, 
  variant = 'paragraph' 
}: TextBlockProps) {
  const variantStyles = {
    paragraph: "text-base sm:text-lg text-content leading-relaxed mb-4 sm:mb-6",
    lead: "text-lg sm:text-xl lg:text-2xl text-content leading-relaxed mb-4 sm:mb-6 font-medium",
    small: "text-sm sm:text-base text-content leading-relaxed mb-2 sm:mb-3",
    caption: "text-xs sm:text-sm text-muted leading-normal mb-1 sm:mb-2"
  }
  
  return (
    <p 
      className={cn(
        "text-block",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </p>
  )
}

// Content Grid Component - Provides structured grid layouts
interface ContentGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  className?: string
}

export function ContentGrid({ 
  children, 
  columns = 3, 
  gap = 'medium', 
  className 
}: ContentGridProps) {
  const columnStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }
  
  const gapStyles = {
    small: "gap-3 sm:gap-4",
    medium: "gap-4 sm:gap-6",
    large: "gap-6 sm:gap-8 lg:gap-12"
  }
  
  return (
    <div 
      className={cn(
        "content-grid grid",
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

// Content Container Component - Provides proper content width and centering
interface ContentContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

export function ContentContainer({ 
  children, 
  maxWidth = 'lg', 
  className 
}: ContentContainerProps) {
  const maxWidthStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    '2xl': "max-w-screen-2xl",
    full: "max-w-full"
  }
  
  return (
    <div 
      className={cn(
        "content-container mx-auto px-4 sm:px-6 lg:px-8",
        maxWidthStyles[maxWidth],
        className
      )}
    >
      {children}
    </div>
  )
}

// Article Component - Provides proper article structure
interface ArticleProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function Article({ 
  children, 
  className, 
  title, 
  subtitle 
}: ArticleProps) {
  return (
    <article 
      className={cn(
        "article prose prose-lg max-w-none",
        "prose-headings:text-heading prose-p:text-content",
        "prose-a:text-sky prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-heading prose-code:text-sky",
        className
      )}
    >
      {title && (
        <header className="article-header mb-8">
          <SectionHeading level={1}>{title}</SectionHeading>
          {subtitle && (
            <TextBlock variant="lead" className="text-muted">
              {subtitle}
            </TextBlock>
          )}
        </header>
      )}
      <div className="article-content space-y-6">
        {children}
      </div>
    </article>
  )
}

// List Component - Provides proper list structure
interface ListProps {
  children: React.ReactNode
  ordered?: boolean
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}

export function List({ 
  children, 
  ordered = false, 
  className, 
  spacing = 'normal' 
}: ListProps) {
  const Component = ordered ? 'ol' : 'ul'
  const spacingStyles = {
    tight: "space-y-1",
    normal: "space-y-2 sm:space-y-3",
    loose: "space-y-4 sm:space-y-6"
  }
  
  return (
    <Component 
      className={cn(
        "list",
        ordered ? "list-decimal" : "list-disc",
        "list-inside",
        spacingStyles[spacing],
        "text-content leading-relaxed",
        className
      )}
    >
      {children}
    </Component>
  )
}

// List Item Component
interface ListItemProps {
  children: React.ReactNode
  className?: string
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn("list-item", className)}>
      {children}
    </li>
  )
}