"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins, Wallet, Star } from "lucide-react"

interface RechargeOption {
  amount: number
  coins: number
  price: number
}

const rechargeOptions: RechargeOption[] = [
  { amount: 10, coins: 300, price: 10 },
  { amount: 30, coins: 900, price: 30 },
  { amount: 100, coins: 3000, price: 100 },
  { amount: 500, coins: 15000, price: 500 },
]

interface RechargeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RechargeDialog({ open, onOpenChange }: RechargeDialogProps) {
  const [selectedOption, setSelectedOption] = React.useState<RechargeOption | null>(null)
  const [paymentMethod, setPaymentMethod] = React.useState<'telegram' | 'ton' | null>(null)

  const handleRecharge = () => {
    if (!selectedOption || !paymentMethod) return
    
    // TODO: 实现充值逻辑
    console.log('充值金额:', selectedOption.price)
    console.log('支付方式:', paymentMethod)
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">充值金币</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 充值选项 */}
          <div className="grid grid-cols-2 gap-3">
            {rechargeOptions.map((option) => (
              <Button
                key={option.amount}
                variant={selectedOption?.amount === option.amount ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24"
                onClick={() => setSelectedOption(option)}
              >
                <div className="text-lg font-bold">${option.price}</div>
                <div className="text-sm text-muted-foreground">{option.coins} 金币</div>
              </Button>
            ))}
          </div>

          {/* 支付方式 */}
          <div className="space-y-2">
            <div className="text-sm font-medium">选择支付方式</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'telegram' ? "default" : "outline"}
                className="flex items-center justify-center gap-2"
                onClick={() => setPaymentMethod('telegram')}
              >
                <Star className="w-4 h-4" />
                Telegram Star
              </Button>
              <Button
                variant={paymentMethod === 'ton' ? "default" : "outline"}
                className="flex items-center justify-center gap-2"
                onClick={() => setPaymentMethod('ton')}
              >
                <Wallet className="w-4 h-4" />
                TON Wallet
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleRecharge}
            disabled={!selectedOption || !paymentMethod}
          >
            确认充值
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 