import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-6 h-6"
  }

  return (
    <div 
      className={cn(
        "border-2 border-current border-t-transparent rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}