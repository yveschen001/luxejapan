'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMockUser } from '@/data/mockUsers'
import { ChatOverlay } from '@/components/ui/chat-overlay'
import { VoiceCall } from '@/components/ui/voice-call'
import { toast } from 'sonner'

export interface ChatMessage {
  id: string
  content: string
  sender: string
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'video' | 'gift'
  gift?: {
    emoji: string
    value: number
  }
}

const mockChats: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1_1',
      content: '你好啊！',
      sender: '1',
      timestamp: new Date('2024-03-20T09:00:00Z').toISOString(),
      type: 'text'
    },
    {
      id: '2_1',
      content: '嗨！最近怎麼樣？',
      sender: '2',
      timestamp: new Date('2024-03-20T09:01:00Z').toISOString(),
      type: 'text'
    },
    {
      id: '1_2',
      content: 'https://picsum.photos/seed/chat1/400/300',
      sender: '1',
      timestamp: new Date('2024-03-20T09:02:00Z').toISOString(),
      type: 'image'
    },
    {
      id: '2_2',
      content: '照片拍得真好看！',
      sender: '2',
      timestamp: new Date('2024-03-20T09:03:00Z').toISOString(),
      type: 'text'
    },
    {
      id: '1_3',
      content: '/audio/message.mp3',
      sender: '1',
      timestamp: new Date('2024-03-20T09:04:00Z').toISOString(),
      type: 'audio'
    },
    {
      id: '2_3',
      content: '🎁',
      sender: '2',
      timestamp: new Date('2024-03-20T09:05:00Z').toISOString(),
      type: 'gift',
      gift: {
        emoji: '🎁',
        value: 100
      }
    }
  ]
}

export default function ChatDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [coins, setCoins] = useState(100)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null)
  const [coinDeductionTimer, setCoinDeductionTimer] = useState<NodeJS.Timeout | null>(null)
  const [diamondRewardTimer, setDiamondRewardTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    const targetUser = getMockUser(params.id as string)
    if (targetUser) {
      setUser(targetUser)
      setMessages(mockChats[targetUser.id] || [])
    }
  }, [params.id])

  useEffect(() => {
    return () => {
      // 清理計時器
      if (callTimer) clearInterval(callTimer)
      if (coinDeductionTimer) clearInterval(coinDeductionTimer)
      if (diamondRewardTimer) clearInterval(diamondRewardTimer)
    }
  }, [callTimer, coinDeductionTimer, diamondRewardTimer])

  const handleBack = () => {
    router.back()
  }

  const handleGiftSend = (giftType: string, value: number) => {
    if (coins < value) {
      toast.error('金幣不足！')
      return
    }
    setCoins(prev => prev - value)
    toast.success(`已發送 ${giftType} 禮物！`)
  }

  const handleCallStart = () => {
    if (coins < 10) {
      toast.error('金幣不足，無法發起通話！')
      return
    }
    setIsCallActive(true)
    setCallDuration(0)
    
    // 開始計時
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    setCallTimer(timer)

    // 每分鐘扣除金幣
    const coinTimer = setInterval(() => {
      setCoins(prev => {
        if (prev < 10) {
          clearInterval(coinTimer)
          handleCallEnd()
          return 0
        }
        return prev - 10
      })
    }, 60000)
    setCoinDeductionTimer(coinTimer)

    // 每5分鐘獎勵鑽石
    const diamondTimer = setInterval(() => {
      toast.success('獲得1顆鑽石獎勵！')
    }, 300000)
    setDiamondRewardTimer(diamondTimer)
  }

  const handleCallEnd = () => {
    setIsCallActive(false)
    if (callTimer) clearInterval(callTimer)
    if (coinDeductionTimer) clearInterval(coinDeductionTimer)
    if (diamondRewardTimer) clearInterval(diamondRewardTimer)
    setCallTimer(null)
    setCoinDeductionTimer(null)
    setDiamondRewardTimer(null)
    toast.success(`通話結束，持續時間：${Math.floor(callDuration / 60)}分${callDuration % 60}秒`)
  }

  const handleCallAccept = () => {
    toast.success('已接受通話請求')
  }

  const handleCallReject = () => {
    toast.error('已拒絕通話請求')
  }

  if (!mounted || !user) return null

  return (
    <div className="h-screen">
      <ChatOverlay
        user={user}
        onBack={handleBack}
        initialMessages={messages}
        onGiftSend={handleGiftSend}
        coins={coins}
        voiceCallComponent={
          <VoiceCall
            user={user}
            onCallStart={handleCallStart}
            onCallEnd={handleCallEnd}
            onCallAccept={handleCallAccept}
            onCallReject={handleCallReject}
          />
        }
      />
      {isCallActive && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
          通話中：{Math.floor(callDuration / 60)}分{callDuration % 60}秒
        </div>
      )}
    </div>
  )
} 