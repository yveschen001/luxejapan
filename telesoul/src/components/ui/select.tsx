import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: boolean
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, helperText, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "block mb-2 text-sm font-medium",
              error ? "text-red-500" : "text-gray-900 dark:text-gray-100"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <select
            className={cn(
              "block w-full rounded-lg transition-colors duration-200",
              "appearance-none bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "text-gray-900 dark:text-gray-100",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              startIcon && "pl-10",
              endIcon ? "pr-10" : "pr-8",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            {endIcon || <ChevronDown className="h-5 w-5 text-gray-400" />}
          </div>
        </div>
        {helperText && (
          <p className={cn(
            "mt-1.5 text-xs",
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        className={cn(
          "py-2 px-3",
          "text-gray-900 dark:text-gray-100",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </option>
    )
  }
)

Option.displayName = "Option"

export { Select, Option } 