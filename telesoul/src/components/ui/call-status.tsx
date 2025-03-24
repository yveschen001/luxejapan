import { Phone, PhoneOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip } from "./tooltip"

interface CallStatusProps {
  isInCall: boolean
  isOnline: boolean
  lastActive: string
  className?: string
}

export function CallStatus({
  isInCall,
  isOnline,
  lastActive,
  className,
}: CallStatusProps) {
  const statusContent = isInCall
    ? "對方正在通話中"
    : isOnline
    ? "對方在線"
    : `最後上線: ${lastActive}`

  return (
    <Tooltip content={statusContent}>
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
          isInCall
            ? "bg-red-100 text-red-700"
            : isOnline
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700",
          className
        )}
      >
        {isInCall ? (
          <>
            <PhoneOff className="h-3 w-3" />
            <span>通話中</span>
          </>
        ) : isOnline ? (
          <>
            <Phone className="h-3 w-3" />
            <span>可通話</span>
          </>
        ) : (
          <>
            <PhoneOff className="h-3 w-3" />
            <span>離線</span>
          </>
        )}
      </div>
    </Tooltip>
  )
} 