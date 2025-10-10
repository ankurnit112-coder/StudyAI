"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  loading?: "lazy" | "eager"
  width?: number
  height?: number
}

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  className,
  loading = "lazy",
  width,
  height,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    } else {
      setHasError(true)
    }
  }

  if (hasError && !fallbackSrc) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      width={width || 400}
      height={height || 300}
      onError={handleError}
      {...props}
    />
  )
}