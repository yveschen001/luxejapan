'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Plus, ArrowDown, ArrowUp } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  type: 'recharge' | 'spend'
  amount: number
  description: string
  date: string
}

export default function CoinsWalletPage() {
  const [balance] = useState(280)
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'recharge',
      amount: 100,
      description: '充值金币',
      date: '2024-03-23 14:30'
    },
    {
      id: '2',
      type: 'spend',
      amount: 30,
      description: '重新测试 MBTI',
      date: '2024-03-22 15:20'
    },
    {
      id: '3',
      type: 'spend',
      amount: 10,
      description: '送出礼物',
      date: '2024-03-22 12:10'
    }
  ])

  return (
    <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </Button>
        </Link>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">金币钱包</h1>
        <div className="w-6" />
      </div>

      {/* 余额区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">当前余额</div>
        <div className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">{balance}</div>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          充值
        </Button>
      </div>

      {/* 交易记录 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">交易记录</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {transactions.map(transaction => (
            <div key={transaction.id} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</div>
                <div className={
                  transaction.type === 'recharge' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }>
                  {transaction.type === 'recharge' ? '+' : '-'}{transaction.amount}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</div>
                <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                  {transaction.type === 'recharge' ? (
                    <>
                      <ArrowDown className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-green-600 dark:text-green-400">充值</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-3 h-3 text-gray-700 dark:text-gray-300 mr-1" />
                      <span className="text-gray-700 dark:text-gray-300">支出</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 