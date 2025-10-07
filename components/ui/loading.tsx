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
    <div 
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        fullScreen ? "min-h-screen" : "min-h-[200px]",
        className
      )}
      role="alert"
      aria-busy="true"
      aria-label={text || "Loading"}
    >
      <LoadingSpinner size={size} />
      {text && (
        <p className="text-muted-foreground text-sm animate-pulse font-medium">{text}</p>
      )}
      <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-indeterminate" />
      </div>
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