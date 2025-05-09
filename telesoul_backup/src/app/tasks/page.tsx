'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Share2, MessageSquare, Coins, Users, Link } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface InviteStats {
  totalInvites: number
  totalRewards: number
  inviteCode: string
}

interface Task {
  id: string
  title: string
  description: string
  reward: {
    type: 'coins'
    amount: number
  }
  progress: number
  total: number
  icon: any
  isCompleted: boolean
  link?: string
}

export default function TasksPage() {
  const [inviteStats] = useState<InviteStats>({
    totalInvites: 12,
    totalRewards: 240,
    inviteCode: 'TS888888'
  })

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: '關注Telegram',
      description: '關注我們的Telegram頻道獲得獎勵',
      reward: {
        type: 'coins',
        amount: 10
      },
      progress: 0,
      total: 1,
      icon: MessageSquare,
      isCompleted: false,
      link: 'https://t.me/your_channel'
    },
    {
      id: '2',
      title: '發送消息',
      description: '與新朋友聊天10則',
      reward: {
        type: 'coins',
        amount: 5
      },
      progress: 3,
      total: 10,
      icon: MessageCircle,
      isCompleted: false
    },
    {
      id: '3',
      title: '關注夥伴網站',
      description: '關注我們的X帳號',
      reward: {
        type: 'coins',
        amount: 5
      },
      progress: 0,
      total: 1,
      icon: Link,
      isCompleted: false,
      link: 'https://x.com/your_account'
    }
  ])

  const handleTaskAction = (task: Task) => {
    if (task.link) {
      window.open(task.link, '_blank')
      // 夥伴網站任務點擊後直接完成
      if (task.id === '3') {
        task.isCompleted = true
        task.progress = 1
        console.log('夥伴網站任務已完成')
      }
    }
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteStats.inviteCode)
    toast.success('邀請碼已複製')
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      {/* 邀請統計 */}
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">邀請獎勵</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyInviteCode}
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享邀請碼
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-primary">
              <Users className="w-5 h-5" />
              <span className="text-xl font-bold">{inviteStats.totalInvites}</span>
            </div>
            <p className="text-sm text-muted-foreground">已邀請人數</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-yellow-600 dark:text-yellow-400">
              <Coins className="w-5 h-5" />
              <span className="text-xl font-bold">{inviteStats.totalRewards}</span>
            </div>
            <p className="text-sm text-muted-foreground">獲得金幣</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-primary">
              <span className="text-xl font-bold font-mono">{inviteStats.inviteCode}</span>
            </div>
            <p className="text-sm text-muted-foreground">邀請碼</p>
          </div>
        </div>
      </div>

      {/* 任務列表 */}
      <h2 className="text-lg font-semibold mb-4">每日任務</h2>
      <div className="space-y-4">
        {tasks.filter(task => !task.isCompleted).map(task => (
          <div
            key={task.id}
            className="bg-card rounded-lg border shadow-sm p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <task.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                  <Coins className="h-4 w-4" />
                  <span className="font-medium">{task.reward.amount}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {task.progress}/{task.total}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Progress value={(task.progress / task.total) * 100} className="h-2" />
              <Button
                className="w-full"
                variant={task.progress >= task.total ? "primary" : "secondary"}
                onClick={() => handleTaskAction(task)}
                disabled={task.progress >= task.total}
              >
                {task.progress >= task.total ? '領取獎勵' : '去完成'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 