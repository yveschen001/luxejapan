import Image from 'next/image'
import { Card, CardContent, CardHeader } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Heart, MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserCardProps {
  user: {
    id: string
    name: string
    avatar: string
    age: number
    location: string
    tags: string[]
    isPremium?: boolean
    isKYC?: boolean
    isMatched?: boolean
  }
  onLike?: () => void
  onMessage?: () => void
  onCall?: () => void
  className?: string
}

export function UserCard({
  user,
  onLike,
  onMessage,
  onCall,
  className,
}: UserCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-48 w-full">
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-xl font-semibold">{user.name}, {user.age}</h3>
            <p className="text-sm opacity-90">{user.location}</p>
          </div>
          <div className="flex gap-2">
            {user.isPremium && (
              <Badge variant="premium" className="bg-yellow-500">
                VIP
              </Badge>
            )}
            {user.isKYC && (
              <Badge variant="secondary" className="bg-green-500">
                KYC
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {user.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <div className="flex items-center justify-between border-t p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLike}
          className={cn(
            "rounded-full",
            user.isMatched && "text-red-500 hover:text-red-600"
          )}
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMessage}
          className="rounded-full"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCall}
          className="rounded-full"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>
    </Card>
  )
} 