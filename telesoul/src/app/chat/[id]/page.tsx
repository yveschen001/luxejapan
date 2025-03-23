'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMockUser } from '@/data/mockUsers'
import { ChatOverlay } from '@/components/ui/chat-overlay'

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
  const [coins, setCoins] = useState(1000)

  useEffect(() => {
    setMounted(true)
    const targetUser = getMockUser(params.id as string)
    if (targetUser) {
      setUser(targetUser)
      setMessages(mockChats[targetUser.id] || [])
    }
  }, [params.id])

  if (!mounted || !user) return null

  const handleBack = () => {
    router.back()
  }

  const handleGiftSend = (giftType: string, value: number) => {
    if (coins < value) {
      alert('金幣不足，請先充值！')
      return
    }

    setCoins(prev => prev - value)

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      content: giftType,
      sender: 'user2',
      timestamp: new Date().toISOString(),
      type: 'gift',
      gift: {
        emoji: giftType,
        value: value
      }
    }

    setMessages(prev => [...prev, message])

    // 模擬回覆
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        content: '謝謝你的禮物！',
        sender: user.id,
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      setMessages(prev => [...prev, reply])
    }, 1000)
  }

  return (
    <div className="h-screen">
      <ChatOverlay
        user={user}
        onBack={handleBack}
        initialMessages={messages}
        onGiftSend={handleGiftSend}
        coins={coins}
      />
    </div>
  )
} 