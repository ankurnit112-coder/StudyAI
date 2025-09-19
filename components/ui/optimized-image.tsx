"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
  loading?: "lazy" | "eager"
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  className,
  width,
  height,
  loading = "lazy",
  objectFit = "cover",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-sky rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down"
        )}
        {...props}
      />
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}