import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', size = 'default', variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: cn(
                child.props.className,
                // 移除第一个按钮的左边框
                index === 0 && 'rounded-l-full',
                // 移除最后一个按钮的右边框
                index === React.Children.count(children) - 1 && 'rounded-r-full',
                // 移除中间按钮的圆角
                index > 0 && index < React.Children.count(children) - 1 && 'rounded-none',
                // 垂直方向时移除所有按钮的圆角
                orientation === 'vertical' && 'rounded-none',
                // 垂直方向时移除第一个按钮的上边框
                orientation === 'vertical' && index === 0 && 'rounded-t-full',
                // 垂直方向时移除最后一个按钮的下边框
                orientation === 'vertical' && index === React.Children.count(children) - 1 && 'rounded-b-full',
              ),
            })
          }
          return child
        })}
      </div>
    )
  }
)

ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup } 