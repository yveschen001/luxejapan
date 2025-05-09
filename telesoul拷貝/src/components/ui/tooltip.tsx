import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
  disabled?: boolean
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, position = "top", delay = 200, disabled = false, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout>()
    const tooltipRef = React.useRef<HTMLDivElement>(null)

    const positions = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2"
    }

    const handleMouseEnter = () => {
      if (disabled) return
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delay)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              "absolute z-50 rounded-md bg-gray-900 px-2 py-1 text-sm text-white shadow-lg transition-opacity duration-200 dark:bg-gray-800",
              positions[position],
              className
            )}
            role="tooltip"
          >
            {content}
            <div
              className={cn(
                "absolute h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-800",
                position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
                position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
                position === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
                position === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
              )}
            />
          </div>
        )}
      </div>
    )
  }
)

Tooltip.displayName = "Tooltip"

export { Tooltip } 