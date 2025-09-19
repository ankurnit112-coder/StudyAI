"use client"

import { useState } from "react"
import { OptimizedImage } from "./optimized-image"
import { Button } from "./button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryImage {
  src: string
  alt: string
  title?: string
  description?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openModal = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)
    }
  }

  return (
    <>
      <div className={`grid gap-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => openModal(index)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                <p className="font-semibold">{image.title}</p>
                <p className="text-sm">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <OptimizedImage
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              className="max-w-full max-h-full rounded-lg"
              objectFit="contain"
            />

            {(images[selectedIndex].title || images[selectedIndex].description) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-4 rounded-lg">
                {images[selectedIndex].title && (
                  <h3 className="font-semibold mb-1">{images[selectedIndex].title}</h3>
                )}
                {images[selectedIndex].description && (
                  <p className="text-sm text-gray-200">{images[selectedIndex].description}</p>
                )}
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}