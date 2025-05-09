'use client'

import React, { useState, useEffect } from 'react'
import { UserProfile } from '@/data/mockUsers'
import { IoMdMic, IoMdMicOff } from 'react-icons/io'
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs'
import { MdCallEnd, MdFlipCamera } from 'react-icons/md'
import { FiMinimize2 } from 'react-icons/fi'
import { IoVolumeMedium, IoVolumeOff } from 'react-icons/io5'
import Image from 'next/image'

interface CallOverlayProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  callType: 'voice' | 'video'
  user: UserProfile
  pricePerMinute: number
}

const CallOverlay: React.FC<CallOverlayProps> = ({
  isOpen,
  onClose,
  onMinimize,
  callType,
  user,
  pricePerMinute
}) => {
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSpeakerOff, setIsSpeakerOff] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [networkQuality, setNetworkQuality] = useState<'good' | 'fair' | 'poor'>('good')
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1)
        setTotalCost(prev => prev + pricePerMinute / 60)
      }, 1000)

      // 模拟网络质量变化
      const networkTimer = setInterval(() => {
        const qualities: ('good' | 'fair' | 'poor')[] = ['good', 'fair', 'poor']
        const randomQuality = qualities[Math.floor(Math.random() * 3)]
        setNetworkQuality(randomQuality)
      }, 5000)

      // 自动隐藏控制按钮
      const controlsTimer = setTimeout(() => {
        setShowControls(false)
      }, 3000)

      return () => {
        clearInterval(timer)
        clearInterval(networkTimer)
        clearTimeout(controlsTimer)
      }
    }
  }, [isOpen, pricePerMinute])

  if (!isOpen) return null

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getNetworkQualityText = () => {
    switch (networkQuality) {
      case 'good':
        return '网络状况良好'
      case 'fair':
        return '网络状况一般'
      case 'poor':
        return '网络状况较差'
    }
  }

  const getNetworkQualityColor = () => {
    switch (networkQuality) {
      case 'good':
        return 'text-green-400'
      case 'fair':
        return 'text-yellow-400'
      case 'poor':
        return 'text-red-400'
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* 视频区域 */}
      <div className="relative w-full h-full">
        {callType === 'video' && !isVideoOff ? (
          <>
            {/* 对方的视频 */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={isMuted}
            >
              <source src="/video-placeholder.mp4" type="video/mp4" />
            </video>
            {/* 自己的视频（小窗口） */}
            <div className="absolute top-4 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white/30">
              <video
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              >
                <source src="/self-video-placeholder.mp4" type="video/mp4" />
              </video>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-black">
            <Image
              src={user.avatar}
              alt={user.name}
              width={160}
              height={160}
              className="rounded-full mb-6 border-4 border-white/10"
            />
            <h2 className="text-white text-3xl font-semibold mb-3">{user.name}</h2>
            <p className="text-gray-300 text-lg">
              {callType === 'voice' ? '语音通话中' : '视频通话中'}
            </p>
          </div>
        )}
      </div>

      {/* 顶部信息栏 */}
      <div className={`absolute top-0 left-0 right-0 p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-white/90">{formatDuration(duration)}</p>
            <p className={`text-sm ${getNetworkQualityColor()}`}>
              {getNetworkQualityText()}
            </p>
          </div>
          <p className="text-yellow-400 font-medium">
            费用: {totalCost.toFixed(2)} 金币
          </p>
        </div>
      </div>

      {/* 控制按钮区域 */}
      <div className={`absolute bottom-8 left-0 right-0 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500' : 'bg-gray-600/80'
            }`}
          >
            {isMuted ? (
              <IoMdMicOff className="text-white text-2xl" />
            ) : (
              <IoMdMic className="text-white text-2xl" />
            )}
          </button>

          <button
            onClick={onClose}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
          >
            <MdCallEnd className="text-white text-3xl" />
          </button>

          {callType === 'video' && (
            <>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isVideoOff ? 'bg-red-500' : 'bg-gray-600/80'
                }`}
              >
                {isVideoOff ? (
                  <BsCameraVideoOffFill className="text-white text-2xl" />
                ) : (
                  <BsCameraVideoFill className="text-white text-2xl" />
                )}
              </button>
              <button
                className="w-14 h-14 rounded-full bg-gray-600/80 flex items-center justify-center"
              >
                <MdFlipCamera className="text-white text-2xl" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsSpeakerOff(!isSpeakerOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isSpeakerOff ? 'bg-red-500' : 'bg-gray-600/80'
            }`}
          >
            {isSpeakerOff ? (
              <IoVolumeOff className="text-white text-2xl" />
            ) : (
              <IoVolumeMedium className="text-white text-2xl" />
            )}
          </button>

          {onMinimize && (
            <button
              onClick={onMinimize}
              className="w-14 h-14 rounded-full bg-gray-600/80 flex items-center justify-center"
            >
              <FiMinimize2 className="text-white text-2xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallOverlay 