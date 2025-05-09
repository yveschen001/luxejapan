import * as React from "react"
import { cn } from "@/lib/utils"

// 表格容器
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped'
  size?: 'sm' | 'md' | 'lg'
  bordered?: boolean
  hoverable?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', size = 'md', bordered = false, hoverable = false, ...props }, ref) => {
    const sizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    }

    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom",
            sizes[size],
            bordered && "border border-gray-200 dark:border-gray-800",
            variant === 'striped' && "[&_tr:nth-child(even)]:bg-gray-50 dark:[&_tr:nth-child(even)]:bg-gray-800/50",
            hoverable && "[&_tr:hover]:bg-gray-100 dark:[&_tr:hover]:bg-gray-800/70",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Table.displayName = "Table"

// 表头
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50",
        className
      )}
      {...props}
    />
  )
)

TableHeader.displayName = "TableHeader"

// 表体
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    />
  )
)

TableBody.displayName = "TableBody"

// 表尾
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 font-medium",
        className
      )}
      {...props}
    />
  )
)

TableFooter.displayName = "TableFooter"

// 表格行
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-gray-200 dark:border-gray-800 transition-colors",
        className
      )}
      {...props}
    />
  )
)

TableRow.displayName = "TableRow"

// 表头单元格
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-300",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
)

TableHead.displayName = "TableHead"

// 数据单元格
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
)

TableCell.displayName = "TableCell"

// 表格标题
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
)

TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} 