import { motion } from 'framer-motion';
import { 
  Gear,
  CaretRight,
  Images,
  Heart,
  ShoppingBag,
  BookOpen,
  SealCheck
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SmartImage } from '@/components/SmartImage';

// 菜单项
const menuItems = [
  { id: 'works', name: '我的作品', icon: Images, count: 48 },
  { id: 'favorites', name: '我的收藏', icon: Heart, count: 128 },
  { id: 'orders', name: '我的订单', icon: ShoppingBag, count: 12 },
  { id: 'learning', name: '学习记录', icon: BookOpen, count: 5 },
];

// 作品展示
const myWorks = [
  '/images/work-calligraphy-1.jpg',
  '/images/work-painting-1.jpg',
  '/images/work-painting-2.jpg',
  '/images/work-calligraphy-2.jpg',
  '/images/work-painting-3.jpg',
];

export function Profile() {
  const { user, theme, setCurrentPage } = useStore();

  const isDark = theme === 'dark';

  if (!user) return null;

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部背景 */}
      <div className={cn(
        'h-40 relative',
        'bg-gradient-to-b from-ink-800 to-ink-900'
      )}>
        {/* 设置按钮 */}
        <button
          onClick={() => setCurrentPage('settings')}
          aria-label="打开设置"
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/30"
        >
          <Gear className="w-5 h-5" />
        </button>
      </div>

      {/* 个人信息卡片 */}
      <div className="px-4 -mt-16 relative z-10">
        <div className={cn(
          'p-5 rounded-2xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink-lg'
        )}>
          <div className="flex items-start gap-4">
            {/* 头像 */}
            <Avatar className="w-20 h-20 border-4 border-white dark:border-ink-900">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            
            {/* 信息 */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h1 className={cn(
                  'text-xl font-bold',
                  isDark ? 'text-ink-100' : 'text-ink-900'
                )}>
                  {user.name}
                </h1>
                {user.isVerified && (
                  <SealCheck className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-ink-400' : 'text-ink-500'
              )}>
                {user.bio}
              </p>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="flex items-center justify-around mt-6 pt-6 border-t border-ink-100 dark:border-ink-800">
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.works}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                作品
              </p>
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.followers}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                粉丝
              </p>
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.following}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                关注
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="px-4 mt-4">
        <div className={cn(
          'rounded-xl overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.99 }}
                aria-label={`打开${item.name}`}
                className={cn(
                  'w-full flex items-center justify-between p-4',
                  index !== menuItems.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isDark ? 'bg-ink-800' : 'bg-ink-100'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5',
                      isDark ? 'text-ink-300' : 'text-ink-600'
                    )} />
                  </div>
                  <span className={cn(
                    'font-medium',
                    isDark ? 'text-ink-200' : 'text-ink-800'
                  )}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    {item.count}
                  </span>
                  <CaretRight className={cn(
                    'w-4 h-4',
                    isDark ? 'text-ink-600' : 'text-ink-400'
                  )} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 作品展示 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn(
            'text-sm font-medium',
            isDark ? 'text-ink-400' : 'text-ink-600'
          )}>
            我的作品
          </h2>
          <button
            aria-label="查看全部作品"
            className={cn(
            'text-xs flex items-center gap-1',
            isDark ? 'text-ink-500' : 'text-ink-500'
            )}
          >
            查看全部
            <CaretRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {myWorks.map((work, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <SmartImage
                src={work}
                alt={`作品 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
