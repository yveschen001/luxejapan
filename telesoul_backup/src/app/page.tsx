'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Gift } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 推荐用户卡片 */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6">
          <Image
            src="https://picsum.photos/800/600"
            alt="推荐用户"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/800/600?random=fallback';
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">小月</h2>
              <p className="text-sm text-gray-500">25岁 · 天蝎座 · 165cm</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-sm">
                INFJ
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-sm">
                兔
              </span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            喜欢旅行、美食和摄影的理想主义者。希望能遇到一个懂得欣赏生活的人，一起分享生活中的美好时刻。
          </p>
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="lg" className="flex-1 mr-3">
              <MessageCircle className="w-5 h-5 mr-2" />
              打招呼
            </Button>
            <Button variant="outline" size="lg" className="flex-1 mr-3">
              <Gift className="w-5 h-5 mr-2" />
              送礼物
            </Button>
            <Button variant="default" size="lg" className="flex-1">
              <Heart className="w-5 h-5 mr-2" />
              喜欢
            </Button>
          </div>
        </div>
      </div>

      {/* 快速匹配按钮 */}
      <Link href="/match" className="block mt-6">
        <Button
          variant="default"
          className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          开始匹配
        </Button>
      </Link>

      {/* 推荐标签 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">你可能感兴趣</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '旅行', count: 128 },
            { label: '美食', count: 256 },
            { label: '电影', count: 98 },
            { label: '音乐', count: 186 },
            { label: '摄影', count: 142 },
            { label: '阅读', count: 76 }
          ].map(tag => (
            <Button
              key={tag.label}
              variant="outline"
              className="h-12 justify-between hover:border-blue-500 hover:text-blue-600"
            >
              <span>{tag.label}</span>
              <span className="text-sm text-gray-500">{tag.count}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
