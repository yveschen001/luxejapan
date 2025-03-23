import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Gift, Coins } from 'lucide-react'
import { useState } from 'react'

interface GiftOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSend: (giftType: string, value: number) => void
  coins: number
}

const gifts = [
  { emoji: '🌹', name: '玫瑰花', value: 10 },
  { emoji: '💝', name: '愛心', value: 20 },
  { emoji: '🎁', name: '禮物', value: 30 },
  { emoji: '💎', name: '鑽石', value: 50 },
  { emoji: '🌟', name: '星星', value: 100 },
  { emoji: '👑', name: '皇冠', value: 200 }
]

export function GiftOverlay({ isOpen, onClose, onSend, coins }: GiftOverlayProps) {
  const [selectedGift, setSelectedGift] = useState<typeof gifts[0] | null>(null)

  if (!isOpen) return null

  const handleSelect = () => {
    if (selectedGift) {
      if (coins < selectedGift.value) {
        alert('金幣不足，請先充值！')
        return
      }
      onSend(selectedGift.emoji, selectedGift.value)
      setSelectedGift(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">選擇禮物</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            {gifts.map((gift) => (
              <button
                key={gift.emoji}
                onClick={() => setSelectedGift(gift)}
                className={`p-4 rounded-lg border ${
                  selectedGift?.emoji === gift.emoji
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-3xl mb-2 block">{gift.emoji}</span>
                <span className="text-sm">{gift.name}</span>
                <span className="text-xs text-gray-500">{gift.value} 金幣</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center text-yellow-500">
              <Coins className="w-5 h-5 mr-1" />
              <span>{coins}</span>
            </div>
            {selectedGift && (
              <div className="text-sm text-gray-500">
                將消耗 {selectedGift.value} 金幣
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!selectedGift || coins < (selectedGift?.value || 0)}
            onClick={handleSelect}
          >
            贈送
          </Button>
        </div>
      </div>
    </div>
  )
} 