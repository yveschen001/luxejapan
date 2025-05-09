"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: {
        switch: "w-8 h-4",
        thumb: "w-3 h-3",
        translate: "translate-x-4",
      },
      md: {
        switch: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translate-x-5",
      },
      lg: {
        switch: "w-14 h-7",
        thumb: "w-6 h-6",
        translate: "translate-x-7",
      },
    }

    return (
      <label className={cn("relative inline-flex items-start", className)}>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              props.disabled && "cursor-not-allowed opacity-50",
              props.checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
              sizes[size].switch
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                props.checked ? sizes[size].translate : "translate-x-0",
                sizes[size].thumb
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className={cn(
                "text-sm font-medium text-gray-900 dark:text-gray-100",
                props.disabled && "cursor-not-allowed opacity-50"
              )}>
                {label}
              </span>
            )}
            {description && (
              <span className={cn(
                "block text-xs text-gray-500 dark:text-gray-400",
                props.disabled && "cursor-not-allowed opacity-50"
              )}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    )
  }
)

Switch.displayName = "Switch"

export { Switch } 