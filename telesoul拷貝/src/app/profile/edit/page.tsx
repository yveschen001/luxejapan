'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Camera, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UserProfile {
  avatar: string
  nickname: string
  mbti: string
  mbtiDescription: string
  zodiac: string
  chineseZodiac: string
  height: number
  weight: number
  race: string
  eyeColor: string
  interests: string[]
  relationshipGoal: string
  gender: string
  age: number
  location: string
}

const heightOptions = Array.from({ length: 60 }, (_, i) => 140 + i * 5)
const weightOptions = Array.from({ length: 15 }, (_, i) => 40 + i * 5)
const raceOptions = ['亚洲', '欧美', '非洲', '拉丁', '其他']
const eyeColorOptions = ['黑色', '棕色', '蓝色', '绿色', '其他']
const relationshipOptions = ['交友', '谈心', '短期', '长期', '结婚', '随缘']
const interestOptions = [
  '旅行', '美食', '电影', '音乐', '摄影', '阅读', '运动', '游戏',
  '艺术', '设计', '科技', '投资', '烹饪', '宠物', '瑜伽', '冥想'
]

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    avatar: 'https://picsum.photos/200',
    nickname: '小月',
    mbti: 'INFJ',
    mbtiDescription: '理想主义者 - 富有同情心、创造力和理想主义的性格类型',
    zodiac: '天蝎座',
    chineseZodiac: '兔',
    height: 165,
    weight: 50,
    race: '亚洲',
    eyeColor: '黑色',
    interests: ['旅行', '美食', '电影', '音乐', '摄影', '阅读'],
    relationshipGoal: '长期',
    gender: 'female',
    age: 25,
    location: '上海'
  })

  const handleInterestToggle = (interest: string) => {
    if (profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }))
    } else if (profile.interests.length < 10) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-lg font-medium">编辑资料</h1>
        <Button variant="ghost" size="sm" className="text-blue-600">
          保存
        </Button>
      </div>

      {/* 头像编辑 */}
      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
        <div className="relative inline-block">
          <Image
            src={profile.avatar}
            alt={profile.nickname}
            width={100}
            height={100}
            className="rounded-full"
            priority
          />
          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MBTI 信息 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">MBTI 类型</div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-lg font-medium text-blue-600 mb-1">{profile.mbti}</div>
          <div className="text-sm text-gray-600 mb-3">{profile.mbtiDescription}</div>
          <Link href="/mbti/test">
            <Button variant="outline" className="w-full">
              重新测试 (30金币)
            </Button>
          </Link>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">昵称</label>
          <Input
            value={profile.nickname}
            onChange={e => setProfile(prev => ({ ...prev, nickname: e.target.value }))}
            maxLength={20}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">年龄</label>
          <Input
            type="number"
            value={profile.age}
            onChange={e => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">所在地</label>
          <Input
            value={profile.location}
            onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">身高</label>
          <div className="relative">
            <select
              value={profile.height}
              onChange={e => setProfile(prev => ({ ...prev, height: Number(e.target.value) }))}
              className="w-full p-2 border rounded-lg appearance-none pr-10"
            >
              {heightOptions.map(height => (
                <option key={height} value={height}>{height} cm</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">体重</label>
          <div className="relative">
            <select
              value={profile.weight}
              onChange={e => setProfile(prev => ({ ...prev, weight: Number(e.target.value) }))}
              className="w-full p-2 border rounded-lg appearance-none pr-10"
            >
              {weightOptions.map(weight => (
                <option key={weight} value={weight}>{weight} kg</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">种族</label>
          <div className="relative">
            <select
              value={profile.race}
              onChange={e => setProfile(prev => ({ ...prev, race: e.target.value }))}
              className="w-full p-2 border rounded-lg appearance-none pr-10"
            >
              {raceOptions.map(race => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">眼睛颜色</label>
          <div className="relative">
            <select
              value={profile.eyeColor}
              onChange={e => setProfile(prev => ({ ...prev, eyeColor: e.target.value }))}
              className="w-full p-2 border rounded-lg appearance-none pr-10"
            >
              {eyeColorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">期待关系</label>
          <div className="relative">
            <select
              value={profile.relationshipGoal}
              onChange={e => setProfile(prev => ({ ...prev, relationshipGoal: e.target.value }))}
              className="w-full p-2 border rounded-lg appearance-none pr-10"
            >
              {relationshipOptions.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 兴趣爱好 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <label className="text-sm text-gray-500 mb-3 block">
          兴趣爱好（最多选择 10 个）
        </label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map(interest => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                profile.interests.includes(interest)
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'border-gray-200 text-gray-600'
              }`}
              disabled={!profile.interests.includes(interest) && profile.interests.length >= 10}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 