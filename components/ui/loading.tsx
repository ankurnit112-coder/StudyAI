import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
  fullScreen?: boolean
}

export function Loading({ className, size = "md", text, fullScreen = false }: LoadingProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      fullScreen ? "min-h-screen" : "min-h-[200px]",
      className
    )}>
      <LoadingSpinner size={size} />
      {text && (
        <p className="text-gray-600 text-sm animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

export function PageLoading() {
  return (
    <Loading 
      fullScreen 
      size="lg" 
      text="Loading StudyAI..." 
      className="bg-background"
    />
  )
}

export function ComponentLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <Loading 
      size="sm" 
      text={text}
      className="py-8"
    />
  )
}