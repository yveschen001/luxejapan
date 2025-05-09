import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, loading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || "加载中..."}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton } 