// Image optimization utilities for StudyAI

export interface ImageConfig {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  fallback?: string
}

// Unsplash image collections for different categories
export const imageCollections = {
  dashboard: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
  ],
  students: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
  ],
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
  ],
  study: [
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w={width}&h={height}&fit=crop&crop=center&auto=format&q={quality}",
  ]
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  baseUrl: string, 
  width: number = 800, 
  height: number = 600, 
  quality: number = 80
): string {
  return baseUrl
    .replace('{width}', width.toString())
    .replace('{height}', height.toString())
    .replace('{quality}', quality.toString())
}

// Get image by category and index
export function getCategoryImage(
  category: keyof typeof imageCollections,
  index: number = 0,
  width: number = 800,
  height: number = 600,
  quality: number = 80
): string {
  const images = imageCollections[category]
  const imageUrl = images[index % images.length]
  return getOptimizedImageUrl(imageUrl, width, height, quality)
}

// Predefined image configurations for common use cases
export const imageConfigs = {
  hero: {
    width: 1200,
    height: 600,
    quality: 90,
  },
  card: {
    width: 400,
    height: 300,
    quality: 80,
  },
  thumbnail: {
    width: 200,
    height: 150,
    quality: 75,
  },
  banner: {
    width: 1200,
    height: 400,
    quality: 85,
  }
}

// Generate responsive image srcSet
export function generateSrcSet(baseUrl: string, sizes: number[] = [400, 800, 1200]): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, size, Math.round(size * 0.75))} ${size}w`)
    .join(', ')
}

// Image presets for StudyAI
export const studyAIImages = {
  heroDashboard: getCategoryImage('dashboard', 0, 1200, 600, 90),
  cbseFeatures: getCategoryImage('students', 1, 1200, 400, 85),
  studentStudying: getCategoryImage('students', 0, 400, 300, 80),
  aiAnalysis: getCategoryImage('ai', 0, 400, 300, 80),
  studyPlan: getCategoryImage('study', 0, 400, 300, 80),
  dashboardOverview: getCategoryImage('dashboard', 1, 600, 400, 80),
  performanceAnalytics: getCategoryImage('dashboard', 0, 600, 400, 80),
  studyPlanner: getCategoryImage('study', 1, 600, 400, 80),
}