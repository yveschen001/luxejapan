'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, MessageCircle, Gift, Send, Search, Upload, Loader2, Plus, Image as ImageIcon, X, MessageSquare, Share2, MoreVertical, Camera } from 'lucide-react'
import { GiftOverlay } from '@/components/ui/gift-overlay'

interface Post {
  id: string
  imageUrl: string
  description: string
  likes: number
  comments: Comment[]
  user: {
    id: string
    name: string
    avatar: string
    mbti: string
    zodiac: string
    isKYC: boolean
    location: string
  }
  isLiked: boolean
  isUnderReview: boolean
  createdAt: Date
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: Date
}

// 模拟数据
const mockPosts: Post[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/600',
    description: '今天在东京的樱花季,美不胜收 🌸',
    likes: 128,
    comments: [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah',
        content: '好美啊！下次我也要去',
        createdAt: new Date()
      }
    ],
    user: {
      id: '1',
      name: 'Yuki',
      avatar: 'https://i.pravatar.cc/150?img=1',
      mbti: 'INFJ',
      zodiac: '双鱼座',
      isKYC: true,
      location: 'Tokyo'
    },
    isLiked: false,
    isUnderReview: false,
    createdAt: new Date()
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/800',
    description: '美食探店第一天,这家店的拉面真的绝了 🍜',
    likes: 89,
    comments: [],
    user: {
      id: '2',
      name: 'Mike',
      avatar: 'https://i.pravatar.cc/150?img=2',
      mbti: 'ENFP',
      zodiac: '射手座',
      isKYC: true,
      location: 'Osaka'
    },
    isLiked: true,
    isUnderReview: false,
    createdAt: new Date()
  }
]

export default function SquarePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showGiftOverlay, setShowGiftOverlay] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [currentUserIsKYC] = useState(true) // 模拟当前用户是 KYC 认证用户

  // 模拟搜索功能
  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const filteredPosts = mockPosts.filter(post => 
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.mbti.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.zodiac.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setPosts(filteredPosts)
      setIsSearching(false)
    }, 1000)
  }

  // 处理点赞
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1
        return {
          ...post,
          likes: newLikes,
          isLiked: !post.isLiked
        }
      }
      return post
    }))
  }

  // 处理评论
  const handleComment = (postId: string) => {
    if (!newComment.trim()) return
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now().toString(),
            userId: 'currentUser',
            userName: 'Me',
            content: newComment,
            createdAt: new Date()
          }]
        }
      }
      return post
    }))
    setNewComment('')
    setShowCommentInput(null)
  }

  // 处理送礼
  const handleGift = (post: Post) => {
    setSelectedPost(post)
    setShowGiftOverlay(true)
  }

  // 处理发起聊天
  const handleChat = (userId: string) => {
    if (confirm('是否要与该使用者建立聊天？')) {
      window.location.href = `/chat/${userId}`
    }
  }

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    
    setIsUploading(true)
    // 模拟上传延迟
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(e.target.files![0]),
        description: '',
        likes: 0,
        comments: [],
        user: {
          id: 'currentUser',
          name: 'Me',
          avatar: 'https://i.pravatar.cc/150?img=3',
          mbti: 'INFJ',
          zodiac: '天秤座',
          isKYC: true,
          location: 'Taipei'
        },
        isLiked: false,
        isUnderReview: true,
        createdAt: new Date()
      }
      setPosts([newPost, ...posts])
      setIsUploading(false)
      
      // 模拟审核通过
      setTimeout(() => {
        setPosts(posts => posts.map(post => {
          if (post.id === newPost.id) {
            return { ...post, isUnderReview: false }
          }
          return post
        }))
      }, 3000)
    }, 1500)
  }

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部搜索栏 */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Input
            type="text"
            placeholder="搜索广场内容"
            className="pl-10"
          />
        </div>
      </div>

      {/* 发布按钮 */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-lg"
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>

      {/* 帖子列表 */}
      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          >
            {/* 用户信息 */}
            <div className="p-4 flex items-center justify-between">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => handleUserClick(post.user.id)}
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.user.location} · {post.user.mbti} · {post.user.zodiac}
                  </p>
                </div>
              </div>
            </div>

            {/* 图片内容 */}
            <div className="relative">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="w-full object-cover"
              />
              {post.isUnderReview && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                    <p>審核中...</p>
                  </div>
                </div>
              )}
            </div>

            {/* 互动按钮 */}
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => setShowCommentInput(post.id)}
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* 描述文字 */}
              <p className="text-gray-900 dark:text-gray-100 mb-2">
                {post.description}
              </p>

              {/* 评论列表 */}
              {post.comments.length > 0 && (
                <div className="space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {comment.userName}
                      </span>{' '}
                      <span className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 评论输入框 */}
              {showCommentInput === post.id && (
                <div className="mt-4 flex space-x-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="發表評論..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleComment(post.id)}
                    disabled={!newComment.trim()}
                  >
                    發送
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 礼物弹窗 */}
      {showGiftOverlay && selectedPost && (
        <GiftOverlay
          isOpen={showGiftOverlay}
          onClose={() => {
            setShowGiftOverlay(false)
            setSelectedPost(null)
          }}
          onSend={(giftType: string, value: number) => {
            // TODO: 处理礼物发送逻辑
            setShowGiftOverlay(false)
            setSelectedPost(null)
          }}
          coins={100}
        />
      )}
    </div>
  )
} 