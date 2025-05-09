import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
  fullScreen?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size = "md", variant = "default", fullScreen = false, ...props }, ref) => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12"
    }

    const variants = {
      default: "border-gray-300 dark:border-gray-600",
      primary: "border-blue-500 dark:border-blue-400",
      secondary: "border-gray-500 dark:border-gray-400"
    }

    const spinner = (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      />
    )

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          {spinner}
        </div>
      )
    }

    return spinner
  }
)

Loading.displayName = "Loading"

export { Loading } 