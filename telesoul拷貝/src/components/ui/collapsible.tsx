import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, defaultOpen, open: controlledOpen, onOpenChange, trigger, children, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const handleOpenChange = () => {
      if (!isControlled) {
        setUncontrolledOpen(!open)
      }
      onOpenChange?.(!open)
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <button
          onClick={handleOpenChange}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
        >
          {trigger}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200 dark:text-gray-400",
              open && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-200",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="px-4 py-2">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)

Collapsible.displayName = "Collapsible"

export { Collapsible } 