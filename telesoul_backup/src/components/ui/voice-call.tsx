"use client"

import * as React from "react"
import { Phone, PhoneOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { UserProfile } from '@/data/mockUsers'

interface VoiceCallProps {
  user: UserProfile
  onCallStart?: () => void
  onCallEnd?: () => void
  onCallAccept?: () => void
  onCallReject?: () => void
}

export function VoiceCall({
  user,
  onCallStart = () => {},
  onCallEnd = () => {},
  onCallAccept = () => {},
  onCallReject = () => {}
}: VoiceCallProps) {
  const [isCalling, setIsCalling] = React.useState(false)
  const [isCallActive, setIsCallActive] = React.useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)

  const handleCallClick = () => {
    if (user.gender !== 'male') {
      toast.error("女性用戶不能主動發起通話")
      return
    }

    if (!user.isPremium || !user.isKYC) {
      toast.error("必須是 Premium + 經過 KYC 的用戶才可以發起通話")
      return
    }

    if (user.voiceCallEnabled === 'none') {
      toast.error("對方不接受語音通話")
      return
    }

    if (user.voiceCallEnabled === 'matched' && !user.isMatched) {
      toast.error("必須建立互相喜歡的關係才可以通話")
      return
    }

    setIsCalling(true)
    onCallStart()
  }

  const handleEndCall = () => {
    setIsCalling(false)
    onCallEnd()
  }

  const handleAcceptCall = () => {
    setIsCalling(true)
    onCallAccept()
  }

  const handleRejectCall = () => {
    setIsCalling(false)
    onCallReject()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={isCalling ? handleEndCall : handleCallClick}
        className={cn(
          "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
          isCalling && "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
        )}
      >
        {isCalling ? (
          <PhoneOff className="w-6 h-6" />
        ) : (
          <Phone className="w-6 h-6" />
        )}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>發起語音通話</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您正在向對方發起語音邀請...請等待對方同意</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAcceptCall}>
              確認
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>語音通話已結束</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>對方拒絕了您的語音邀請</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRejectDialog(false)}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 