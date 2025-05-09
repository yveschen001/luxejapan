'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ArrowDown, ArrowUp, Wallet, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  type: 'earn' | 'withdraw'
  amount: number
  description: string
  date: string
  status?: 'pending' | 'completed' | 'failed'
}

interface WalletState {
  diamonds: number
  isKycVerified: boolean
  hasLinkedWallet: boolean
  exchangeRate: number // 40 diamonds = 1 USDT
}

export default function DiamondsWalletPage() {
  const [wallet] = useState<WalletState>({
    diamonds: 1200,
    isKycVerified: false,
    hasLinkedWallet: false,
    exchangeRate: 40 // 40 diamonds = 1 USDT
  })

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earn',
      amount: 100,
      description: '邀请好友奖励',
      date: '2024-03-22 14:30'
    },
    {
      id: '2',
      type: 'earn',
      amount: 50,
      description: '完成任务奖励',
      date: '2024-03-21 15:20'
    },
    {
      id: '3',
      type: 'withdraw',
      amount: 400,
      description: '提现到钱包',
      date: '2024-03-20 10:00',
      status: 'completed'
    }
  ]

  const minWithdrawAmount = 1000 // 最小提现金额
  const canWithdraw = wallet.isKycVerified && wallet.hasLinkedWallet

  return (
    <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </Button>
        </Link>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">钻石钱包</h1>
        <div className="w-6" />
      </div>

      {/* 余额区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">当前余额</div>
        <div className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-2">{wallet.diamonds}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          ≈ {(wallet.diamonds / wallet.exchangeRate).toFixed(2)} USDT
        </div>
        {!wallet.isKycVerified ? (
          <Link href="/kyc">
            <Button className="w-full">
              <AlertCircle className="w-4 h-4 mr-2" />
              完成 KYC 认证
            </Button>
          </Link>
        ) : !wallet.hasLinkedWallet ? (
          <Link href="/wallet/link">
            <Button className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              绑定钱包地址
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full"
            disabled={wallet.diamonds < minWithdrawAmount}
          >
            提现到钱包
          </Button>
        )}
        {wallet.diamonds < minWithdrawAmount && canWithdraw && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            需要至少 {minWithdrawAmount} 钻石才能提现
          </div>
        )}
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
                <div className={transaction.type === 'earn' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</div>
                <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                  {transaction.type === 'earn' ? (
                    <>
                      <ArrowDown className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-green-600 dark:text-green-400">收入</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400 mr-1" />
                      <span className="text-blue-600 dark:text-blue-400">
                        {transaction.status === 'pending' ? '处理中' : 
                         transaction.status === 'failed' ? '失败' : '提现'}
                      </span>
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