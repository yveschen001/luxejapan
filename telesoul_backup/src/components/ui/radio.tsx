import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  helperText?: string
}

export interface RadioGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            className={cn(
              "h-4 w-4 text-blue-600",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || helperText) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  "text-sm font-medium select-none",
                  error ? "text-red-500" : "text-gray-900 dark:text-gray-100",
                  props.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className={cn(
                "mt-1 text-xs",
                error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              )}>
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, className, orientation = 'vertical' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === 'horizontal' ? "flex-row space-x-6" : "flex-col space-y-2",
          className
        )}
        role="radiogroup"
      >
        {children}
      </div>
    )
  }
)

Radio.displayName = "Radio"
RadioGroup.displayName = "RadioGroup"

export { Radio, RadioGroup } 