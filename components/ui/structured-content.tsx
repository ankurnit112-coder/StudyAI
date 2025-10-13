"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { extractStructuredContent, cleanTextContent } from '@/lib/content-utils'

interface StructuredContentProps {
  content: string
  className?: string
  showTitle?: boolean
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Component that takes raw text content and renders it with proper HTML structure
 * Fixes issues where content appears as a single text block
 */
export function StructuredContent({ 
  content, 
  className, 
  showTitle = true,
  headingLevel = 2
}: StructuredContentProps) {
  if (!content || typeof content !== 'string') {
    return null
  }

  const structured = extractStructuredContent(cleanTextContent(content))
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements

  return (
    <div className={cn("structured-content space-y-6", className)}>
      {showTitle && structured.title && (
        <header className="content-header">
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-4">
            {structured.title}
          </h1>
        </header>
      )}
      
      {structured.sections.map((section, index) => (
        <section key={index} className="content-section space-y-4">
          <HeadingTag className="text-lg sm:text-xl font-semibold text-heading">
            {section.heading}
          </HeadingTag>
          
          <div className="content-body space-y-3">
            {section.content.split('\n').map((paragraph, pIndex) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              
              // Check if it's a list item
              if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
                return (
                  <ul key={pIndex} className="list-disc list-inside ml-4">
                    <li className="text-content leading-relaxed">
                      {trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')}
                    </li>
                  </ul>
                )
              }
              
              // Regular paragraph
              return (
                <p key={pIndex} className="text-content leading-relaxed">
                  {trimmed}
                </p>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

interface ContentWithHeadingsProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper component that ensures proper heading hierarchy and content structure
 */
export function ContentWithHeadings({ children, className }: ContentWithHeadingsProps) {
  return (
    <div className={cn(
      "content-with-headings",
      "prose prose-lg max-w-none",
      "prose-headings:text-heading prose-p:text-content",
      "prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:font-bold prose-h1:mb-4",
      "prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:font-semibold prose-h2:mb-3",
      "prose-h3:text-lg prose-h3:sm:text-xl prose-h3:font-medium prose-h3:mb-2",
      "prose-p:leading-relaxed prose-p:mb-4",
      "prose-ul:list-disc prose-ul:list-inside prose-ul:ml-4",
      "prose-ol:list-decimal prose-ol:list-inside prose-ol:ml-4",
      "prose-li:mb-1",
      className
    )}>
      {children}
    </div>
  )
}

interface TextWithBreaksProps {
  text: string
  className?: string
  preserveLineBreaks?: boolean
}

/**
 * Component that properly formats text with line breaks and prevents single text block issues
 */
export function TextWithBreaks({ 
  text, 
  className, 
  preserveLineBreaks = true 
}: TextWithBreaksProps) {
  if (!text) return null

  const processedText = preserveLineBreaks 
    ? text.split('\n').filter(line => line.trim())
    : [text]

  return (
    <div className={cn("text-with-breaks space-y-3", className)}>
      {processedText.map((line, index) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        return (
          <p key={index} className="text-content leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

interface SectionWithHeadingProps {
  heading: string
  children: React.ReactNode
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  id?: string
}

/**
 * Component that creates a proper section with heading
 */
export function SectionWithHeading({ 
  heading, 
  children, 
  headingLevel = 2, 
  className,
  id 
}: SectionWithHeadingProps) {
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements
  
  const headingStyles = {
    1: "text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6",
    2: "text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4",
    3: "text-lg sm:text-xl lg:text-2xl font-medium mb-2 sm:mb-3",
    4: "text-base sm:text-lg lg:text-xl font-medium mb-2",
    5: "text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2",
    6: "text-xs sm:text-sm lg:text-base font-medium mb-1"
  }

  return (
    <section id={id} className={cn("section-with-heading space-y-4", className)}>
      <HeadingTag className={cn(
        "section-heading text-heading",
        headingStyles[headingLevel]
      )}>
        {heading}
      </HeadingTag>
      <div className="section-content">
        {children}
      </div>
    </section>
  )
}

interface ContentListProps {
  items: string[]
  ordered?: boolean
  className?: string
}

/**
 * Component that renders a properly structured list
 */
export function ContentList({ items, ordered = false, className }: ContentListProps) {
  if (!items || items.length === 0) return null

  const ListTag = ordered ? 'ol' : 'ul'
  const listClass = ordered ? 'list-decimal' : 'list-disc'

  return (
    <ListTag className={cn(
      "content-list",
      listClass,
      "list-inside ml-4 space-y-2",
      className
    )}>
      {items.map((item, index) => (
        <li key={index} className="text-content leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  )
}