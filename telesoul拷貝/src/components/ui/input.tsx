import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', size = 'md', error, helperText, ...props }, ref) => {
    const baseStyles = "w-full rounded-lg transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    
    const variants = {
      default: cn(
        "border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400"
      ),
      filled: cn(
        "border-2 border-transparent bg-gray-100 dark:bg-gray-700",
        "focus:bg-transparent focus:border-blue-500 dark:focus:border-blue-400",
        error && "bg-red-50 dark:bg-red-900/20 focus:border-red-500 dark:focus:border-red-400"
      ),
      outlined: cn(
        "border-2 border-gray-200 bg-transparent dark:border-gray-700",
        "focus:border-blue-500 dark:focus:border-blue-400",
        error && "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400"
      )
    }
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-4 text-base"
    }

    return (
      <div className="w-full">
        <input
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "mt-1.5 text-xs",
            error 
              ? "text-red-500 dark:text-red-400" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 