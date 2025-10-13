/**
 * Content structure utilities for proper HTML rendering and text formatting
 */

export interface ContentSection {
  id: string
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'quote'
  level?: number
  content: string
  children?: ContentSection[]
}

/**
 * Parse text content and structure it properly with HTML elements
 */
export function parseContentStructure(text: string): ContentSection[] {
  if (!text || typeof text !== 'string') {
    return []
  }

  const lines = text.split('\n').filter(line => line.trim().length > 0)
  const sections: ContentSection[] = []
  let currentId = 0

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip empty lines
    if (!trimmedLine) continue

    // Detect headings (lines starting with #, ##, etc. or all caps)
    if (trimmedLine.match(/^#{1,6}\s+/)) {
      const level = trimmedLine.match(/^(#{1,6})/)?.[1].length || 1
      const content = trimmedLine.replace(/^#{1,6}\s+/, '')
      sections.push({
        id: `heading-${currentId++}`,
        type: 'heading',
        level,
        content
      })
    }
    // Detect list items (lines starting with -, *, or numbers)
    else if (trimmedLine.match(/^[-*•]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      const content = trimmedLine.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')
      sections.push({
        id: `list-${currentId++}`,
        type: 'list',
        content
      })
    }
    // Detect code blocks (lines starting with ``` or indented)
    else if (trimmedLine.startsWith('```') || trimmedLine.startsWith('    ')) {
      const content = trimmedLine.replace(/^```/, '').replace(/^    /, '')
      sections.push({
        id: `code-${currentId++}`,
        type: 'code',
        content
      })
    }
    // Detect quotes (lines starting with >)
    else if (trimmedLine.startsWith('>')) {
      const content = trimmedLine.replace(/^>\s*/, '')
      sections.push({
        id: `quote-${currentId++}`,
        type: 'quote',
        content
      })
    }
    // Regular paragraphs
    else {
      sections.push({
        id: `paragraph-${currentId++}`,
        type: 'paragraph',
        content: trimmedLine
      })
    }
  }

  return sections
}

/**
 * Escape HTML characters to prevent XSS
 */
export function escapeHTML(text: string): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  } else {
    // Server environment
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

/**
 * Convert structured content to HTML string
 */
export function contentToHTML(sections: ContentSection[]): string {
  return sections.map(section => {
    switch (section.type) {
      case 'heading':
        const level = Math.min(Math.max(section.level || 1, 1), 6)
        return `<h${level} class="section-heading">${escapeHTML(section.content)}</h${level}>`
      
      case 'paragraph':
        return `<p class="text-block">${escapeHTML(section.content)}</p>`
      
      case 'list':
        return `<li class="list-item">${escapeHTML(section.content)}</li>`
      
      case 'code':
        return `<code class="code-block">${escapeHTML(section.content)}</code>`
      
      case 'quote':
        return `<blockquote class="quote-block">${escapeHTML(section.content)}</blockquote>`
      
      default:
        return `<div class="content-block">${escapeHTML(section.content)}</div>`
    }
  }).join('\n')
}

/**
 * Clean and structure text content for proper display
 */
export function cleanTextContent(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Ensure proper line breaks
    .replace(/\.\s+/g, '.\n\n')
    // Fix common formatting issues
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Trim and clean
    .trim()
}

/**
 * Add proper section headings to content
 */
export function addSectionHeadings(content: string, headings: string[]): string {
  if (!content || !headings.length) {
    return content
  }

  const sections = content.split('\n\n')
  let result = ''
  
  headings.forEach((heading, index) => {
    if (sections[index]) {
      result += `## ${heading}\n\n${sections[index]}\n\n`
    }
  })

  return result.trim()
}

/**
 * Format content with proper HTML structure
 */
export function formatContentWithStructure(content: string): string {
  if (!content) return ''

  const sections = parseContentStructure(content)
  return contentToHTML(sections)
}

/**
 * Extract and structure content from mixed text
 */
export function extractStructuredContent(text: string): {
  title?: string
  sections: Array<{
    heading: string
    content: string
  }>
} {
  if (!text) return { sections: [] }

  const lines = text.split('\n').filter(line => line.trim())
  const result: { title?: string; sections: Array<{ heading: string; content: string }> } = {
    sections: []
  }

  let currentSection: { heading: string; content: string } | null = null
  let title: string | undefined

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // First significant line could be title
    if (!title && trimmedLine.length > 10) {
      title = trimmedLine
      result.title = title
      continue
    }

    // Detect section headings
    if (trimmedLine.match(/^#{1,6}\s+/) || 
        trimmedLine.match(/^[A-Z][A-Z\s]+:?$/) ||
        trimmedLine.length < 50 && trimmedLine.match(/^[A-Z]/)) {
      
      // Save previous section
      if (currentSection && currentSection.content.trim()) {
        result.sections.push(currentSection)
      }
      
      // Start new section
      currentSection = {
        heading: trimmedLine.replace(/^#{1,6}\s+/, ''),
        content: ''
      }
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine
    } else {
      // Content without heading - create default section
      if (!currentSection) {
        currentSection = {
          heading: 'Overview',
          content: trimmedLine
        }
      }
    }
  }

  // Add final section
  if (currentSection && currentSection.content.trim()) {
    result.sections.push(currentSection)
  }

  return result
}

/**
 * Validate and fix HTML structure
 */
export function validateHTMLStructure(html: string): string {
  if (!html) return ''

  // Basic HTML structure validation and fixes
  return html
    // Ensure proper paragraph tags
    .replace(/([^>])\n\n([^<])/g, '$1</p>\n<p>$2')
    // Fix missing opening tags
    .replace(/^([^<])/gm, '<p>$1')
    // Fix missing closing tags
    .replace(/([^>])$/gm, '$1</p>')
    // Clean up multiple paragraph tags
    .replace(/<\/p>\s*<p>/g, '</p>\n<p>')
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    // Ensure proper heading structure
    .replace(/^([A-Z][A-Z\s]+)$/gm, '<h2>$1</h2>')
}