import Image from 'next/image'
import { Card, CardContent, CardHeader } from './card'
import { Button } from './button'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    author: {
      id: string
      name: string
      avatar: string
    }
    content: string
    images?: string[]
    likes: number
    comments: number
    createdAt: Date
  }
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onMore?: () => void
  className?: string
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onMore,
  className,
}: PostCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold">{post.author.name}</h4>
            <p className="text-sm text-muted-foreground">
              {formatTime(post.createdAt)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMore}
          className="rounded-full"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm leading-relaxed">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className="flex items-center space-x-1"
          >
            <Heart className="h-5 w-5" />
            <span>{post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="flex items-center space-x-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="rounded-full"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
} 