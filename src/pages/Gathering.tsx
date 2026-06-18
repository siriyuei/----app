import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ChatCircle, 
  ShareNetwork,
  Users,
  Clock
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/SmartImage';

// 话题标签
const topics = [
  { id: 'spring', name: '春日咏柳', count: 128 },
  { id: 'midautumn', name: '中秋赏月', count: 256 },
  { id: 'jiangnan', name: '墨韵江南', count: 189 },
  { id: 'landscape', name: '山水意境', count: 342 },
  { id: 'poetry', name: '诗词歌赋', count: 567 },
];

// 活动数据
const events = [
  {
    id: '1',
    title: '春日咏柳主题雅集',
    image: '/images/event-spring.jpg',
    participants: 128,
    deadline: '3天后截止',
    status: '进行中',
  },
  {
    id: '2',
    title: '文人雅集 - 竹林品茗',
    image: '/images/event-gathering.jpg',
    participants: 256,
    deadline: '7天后截止',
    status: '报名中',
  },
  {
    id: '3',
    title: '中秋赏月诗词大会',
    image: '/images/event-midautumn.jpg',
    participants: 512,
    deadline: '15天后截止',
    status: '即将开始',
  },
];

export function Gathering() {
  const { theme, posts, toggleLike, likedItems, setDialogItem } = useStore();
  const [activeTopic, setActiveTopic] = useState('spring');

  const isDark = theme === 'dark';

  const handlePostClick = (post: typeof posts[0]) => {
    setDialogItem({ type: 'post', data: post });
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    toggleLike(postId);
  };

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部话题标签 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        <h1 className={cn(
          'text-lg font-serif mb-3',
          isDark ? 'text-ink-100' : 'text-ink-900'
        )}>
          雅集广场
        </h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {topics.map((topic) => {
            const isActive = activeTopic === topic.id;
            return (
              <motion.button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex flex-col items-center px-4 py-2 rounded-xl',
                  'whitespace-nowrap transition-all min-w-[80px]',
                  isActive
                    ? (isDark 
                        ? 'bg-cinnabar text-white' 
                        : 'bg-cinnabar text-white')
                    : (isDark 
                        ? 'bg-ink-800 text-ink-300 hover:bg-ink-700' 
                        : 'bg-white text-ink-600 hover:bg-ink-100')
                )}
              >
                <span className="text-sm font-medium">{topic.name}</span>
                <span className={cn(
                  'text-[10px]',
                  isActive ? 'text-white/70' : (isDark ? 'text-ink-500' : 'text-ink-400')
                )}>
                  {topic.count} 作品
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 主题活动 */}
      <div className="px-4 mt-4">
        <h2 className={cn(
          'text-sm font-medium mb-3',
          isDark ? 'text-ink-400' : 'text-ink-600'
        )}>
          主题活动
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex-shrink-0 w-64 rounded-xl overflow-hidden',
                isDark ? 'bg-ink-900' : 'bg-white',
                'shadow-ink'
              )}
            >
              <div className="aspect-video relative">
                <SmartImage
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={cn(
                    'text-[10px] px-2 py-1 rounded-full',
                    'bg-cinnabar text-white'
                  )}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className={cn(
                  'font-medium text-sm mb-2',
                  isDark ? 'text-ink-200' : 'text-ink-800'
                )}>
                  {event.title}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <div className={cn(
                    'flex items-center gap-1',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    <Users className="w-3 h-3" />
                    <span>{event.participants} 人参与</span>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    <Clock className="w-3 h-3" />
                    <span>{event.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 动态流 */}
      <div className="px-4 mt-6">
        <h2 className={cn(
          'text-sm font-medium mb-3',
          isDark ? 'text-ink-400' : 'text-ink-600'
        )}>
          最新动态
        </h2>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePostClick(post)}
              className={cn(
                'rounded-xl overflow-hidden cursor-pointer',
                isDark ? 'bg-ink-900' : 'bg-white',
                'shadow-ink',
                'hover:shadow-lg transition-shadow'
              )}
            >
              {/* 作者信息 */}
              <div className="p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-medium text-sm',
                      isDark ? 'text-ink-200' : 'text-ink-800'
                    )}>
                      {post.author.name}
                    </span>
                    {post.author.isVerified && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        认证
                      </Badge>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    {post.createdAt}
                  </span>
                </div>
              </div>

              {/* 内容 */}
              <div className="px-4 pb-3">
                <p className={cn(
                  'text-sm leading-relaxed',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  {post.content}
                </p>
                {/* 标签 */}
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 图片 */}
              {post.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={post.image}
                    alt="作品"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 互动按钮 */}
              <div className={cn(
                'p-4 flex items-center justify-between border-t',
                isDark ? 'border-ink-800' : 'border-ink-100'
              )}>
                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => handleLike(e, post.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      weight={likedItems.includes(post.id) ? 'fill' : 'regular'}
                      className={cn(
                        'w-5 h-5 transition-colors',
                        likedItems.includes(post.id) ? 'text-cinnabar' : (isDark ? 'text-ink-500' : 'text-ink-400')
                      )}
                    />
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {post.likes + (likedItems.includes(post.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-2">
                    <ChatCircle className={cn(
                      'w-5 h-5',
                      isDark ? 'text-ink-500' : 'text-ink-400'
                    )} />
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {post.comments}
                    </span>
                  </button>
                  <button className="flex items-center gap-2">
                    <ShareNetwork className={cn(
                      'w-5 h-5',
                      isDark ? 'text-ink-500' : 'text-ink-400'
                    )} />
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {post.shares}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
