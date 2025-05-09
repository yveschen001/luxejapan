import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export interface ToastProps {
  open?: boolean
  onClose?: () => void
  title?: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ open, onClose, title, description, variant = 'info', duration = 5000, position = 'bottom-right', ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      if (open) {
        setIsVisible(true)
        if (duration > 0) {
          const timer = setTimeout(() => {
            setIsVisible(false)
            onClose?.()
          }, duration)
          return () => clearTimeout(timer)
        }
      } else {
        setIsVisible(false)
      }
    }, [open, duration, onClose])

    const variants = {
      success: {
        icon: CheckCircle,
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        iconColor: "text-green-500 dark:text-green-400"
      },
      error: {
        icon: AlertCircle,
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-800 dark:text-red-200",
        iconColor: "text-red-500 dark:text-red-400"
      },
      warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-800 dark:text-yellow-200",
        iconColor: "text-yellow-500 dark:text-yellow-400"
      },
      info: {
        icon: Info,
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-800 dark:text-blue-200",
        iconColor: "text-blue-500 dark:text-blue-400"
      }
    }

    const positions = {
      'top-right': "top-4 right-4",
      'top-left': "top-4 left-4",
      'bottom-right': "bottom-4 right-4",
      'bottom-left': "bottom-4 left-4"
    }

    const Icon = variants[variant].icon

    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 w-full max-w-sm pointer-events-auto",
          positions[position]
        )}
        {...props}
      >
        <div
          className={cn(
            "overflow-hidden rounded-lg border shadow-lg",
            "transition-all duration-300 ease-in-out",
            variants[variant].bg,
            variants[variant].border,
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={cn("h-5 w-5", variants[variant].iconColor)} />
              </div>
              <div className="ml-3 w-0 flex-1">
                {title && (
                  <p className={cn(
                    "text-sm font-medium",
                    variants[variant].text
                  )}>
                    {title}
                  </p>
                )}
                {description && (
                  <p className={cn(
                    "mt-1 text-sm",
                    variants[variant].text
                  )}>
                    {description}
                  </p>
                )}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className={cn(
                    "inline-flex rounded-md",
                    variants[variant].text,
                    "hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    `focus:ring-${variant}-500`
                  )}
                  onClick={() => {
                    setIsVisible(false)
                    onClose?.()
                  }}
                >
                  <span className="sr-only">关闭</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

Toast.displayName = "Toast"

export { Toast } 