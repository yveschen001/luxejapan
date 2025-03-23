'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Copy, CheckCircle2, Gift, Users, Coins, UserPlus, Activity } from 'lucide-react'

interface InviteReward {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  reward: string
}

const rewards: InviteReward[] = [
  {
    id: 1,
    title: '邀请好友',
    description: '每邀请一位好友获得 10 金币，最多可邀请 100 人',
    icon: <UserPlus className="w-6 h-6" />,
    reward: '10 金币/人'
  },
  {
    id: 2,
    title: '好友首充',
    description: '好友首次充值，您可获得 50% 的金币奖励',
    icon: <Coins className="w-6 h-6" />,
    reward: '50% 返现'
  },
  {
    id: 3,
    title: '好友活跃',
    description: '好友每日活跃，您可获得 5 金币奖励',
    icon: <Activity className="w-6 h-6" />,
    reward: '5 金币/天'
  }
]

export default function InvitePage() {
  const [copied, setCopied] = useState(false)
  const inviteCode = 'TS888888' // 这里应该是从后端获取的用户专属邀请码

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    // 这里可以集成 Telegram 的分享功能
    console.log('分享邀请链接')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* 邀请码卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">邀请好友</h1>
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">你的专属邀请码</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">{inviteCode}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            分享邀请链接
          </Button>
        </div>

        {/* 奖励列表 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">邀请奖励</h2>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-blue-600">{reward.icon}</div>
                <div>
                  <h3 className="font-semibold">{reward.title}</h3>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {reward.reward}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 邀请记录 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">邀请记录</h2>
          <div className="text-center text-gray-600">
            <p>暂无邀请记录</p>
          </div>
        </div>
      </div>
    </div>
  )
} 