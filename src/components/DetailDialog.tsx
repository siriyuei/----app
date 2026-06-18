import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Heart,
  ChatCircle,
  ShareNetwork,
  Clock,
  Users,
  Star,
  ShoppingCart,
  Play,
  CaretRight
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/SmartImage';
import { toast } from 'sonner';

export function DetailDialog() {
  const { dialogItem, setDialogItem, toggleLike, likedItems, theme } = useStore();
  
  const isDark = theme === 'dark';

  const handleClose = useCallback(() => {
    setDialogItem(null);
  }, [setDialogItem]);

  useEffect(() => {
    if (!dialogItem) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleClose, dialogItem]);

  if (!dialogItem) return null;

  const { type, data } = dialogItem;
  const isLiked = likedItems.includes(data.id);

  const handleLike = () => {
    toggleLike(data.id);
    toast.info(isLiked ? '已取消收藏' : '收藏成功');
  };

  const handleShare = () => {
    toast.success('分享链接已复制到剪贴板');
  };

  const renderContent = () => {
    switch (type) {
      case 'work':
      case 'post': {
        const work = data as { 
          id: string; 
          title: string; 
          content: string; 
          image: string; 
          author: { name: string; avatar: string; isVerified?: boolean };
          likes: number; 
          comments: number; 
          shares: number; 
          tags: string[]; 
          createdAt: string;
        };
        
        return (
          <div className="space-y-4">
            {/* 作者信息 */}
            <div className="flex items-center gap-3 p-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={work.author.avatar} />
                <AvatarFallback>{work.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium',
                    isDark ? 'text-ink-100' : 'text-ink-900'
                  )}>
                    {work.author.name}
                  </span>
                  {work.author.isVerified && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      认证
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-ink-500' : 'text-ink-500'
                )}>
                  {work.createdAt}
                </span>
              </div>
            </div>

            {/* 作品图片 */}
            <div className="aspect-square bg-ink-100 dark:bg-ink-800">
              <SmartImage
                src={work.image}
                alt={work.title || '作品'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 标题 */}
            {work.title && (
              <h2 className={cn(
                'text-xl font-bold px-4',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {work.title}
              </h2>
            )}

            {/* 内容 */}
            {work.content && (
              <p className={cn(
                'px-4 text-sm leading-relaxed',
                isDark ? 'text-ink-300' : 'text-ink-700'
              )}>
                {work.content}
              </p>
            )}

            {/* 标签 */}
            {work.tags.length > 0 && (
              <div className="px-4 flex gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 互动数据 */}
            <div className={cn(
              'px-4 py-3 flex items-center justify-between border-t',
              isDark ? 'border-ink-800' : 'border-ink-100'
            )}>
              <div className="flex items-center gap-6">
                <button onClick={handleLike} className="flex items-center gap-2">
                  <Heart
                    weight={isLiked ? 'fill' : 'regular'}
                    className={cn(
                      'w-5 h-5',
                      isLiked ? 'text-cinnabar' : (isDark ? 'text-ink-500' : 'text-ink-400')
                    )}
                  />
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-400' : 'text-ink-500'
                  )}>
                    {work.likes + (isLiked ? 1 : 0)}
                  </span>
                </button>
                <button className="flex items-center gap-2">
                  <ChatCircle className={cn(
                    'w-5 h-5',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-400' : 'text-ink-500'
                  )}>
                    {work.comments}
                  </span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2">
                  <ShareNetwork className={cn(
                    'w-5 h-5',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-400' : 'text-ink-500'
                  )}>
                    {work.shares}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'product': {
        const product = data as {
          id: string;
          title: string;
          image: string;
          price: number;
          currency: string;
          creator?: { name: string; avatar: string; isVerified?: boolean };
          shop?: string;
          likes?: number;
          sales?: number;
          isNew?: boolean;
          isHot?: boolean;
          isLimited?: boolean;
        };

        return (
          <div className="space-y-4">
            {/* 商品图片 */}
            <div className="aspect-square bg-ink-100 dark:bg-ink-800 relative">
              <SmartImage
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white text-[10px]">新品</Badge>
                )}
                {product.isHot && (
                  <Badge className="bg-orange-500 text-white text-[10px]">热卖</Badge>
                )}
                {product.isLimited && (
                  <Badge className="bg-purple-500 text-white text-[10px]">限量</Badge>
                )}
              </div>
              <button
                onClick={handleLike}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm"
              >
                <Heart
                  weight={isLiked ? 'fill' : 'regular'}
                  className={cn(
                    'w-5 h-5',
                    isLiked ? 'text-cinnabar' : 'text-white'
                  )}
                />
              </button>
            </div>

            {/* 商品信息 */}
            <div className="p-4">
              <h2 className={cn(
                'text-lg font-bold mb-2',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {product.title}
              </h2>

              {/* 价格 */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-cinnabar">
                  {product.price}
                </span>
                <span className={cn(
                  'text-sm',
                  isDark ? 'text-ink-500' : 'text-ink-500'
                )}>
                  {product.currency}
                </span>
              </div>

              {/* 创作者/店铺 */}
              <div className="flex items-center gap-2 mb-4">
                {product.creator ? (
                  <>
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={product.creator.avatar} />
                      <AvatarFallback>{product.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-400' : 'text-ink-500'
                    )}>
                      {product.creator.name}
                    </span>
                    {product.creator.isVerified && (
                      <Star weight="fill" className="w-3 h-3 text-blue-500" />
                    )}
                  </>
                ) : product.shop ? (
                  <span className={cn(
                    'text-sm px-2 py-1 rounded',
                    isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
                  )}>
                    {product.shop}
                  </span>
                ) : null}
              </div>

              {/* 统计 */}
              <div className={cn(
                'flex items-center gap-4 p-3 rounded-lg',
                isDark ? 'bg-ink-800' : 'bg-ink-50'
              )}>
                {'likes' in product && (
                  <div className="flex items-center gap-1">
                    <Heart weight="fill" className="w-4 h-4 text-cinnabar" />
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-400' : 'text-ink-500'
                    )}>
                      {product.likes} 收藏
                    </span>
                  </div>
                )}
                {'sales' in product && (
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-400' : 'text-ink-500'
                    )}>
                      {product.sales} 已售
                    </span>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.info('已加入购物车')}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  加入购物车
                </Button>
                <Button className="flex-1 bg-cinnabar hover:bg-cinnabar-dark">
                  立即购买
                </Button>
              </div>
            </div>
          </div>
        );
      }

      case 'course': {
        const course = data as {
          id: string;
          title: string;
          image: string;
          instructor: { name: string; avatar: string; isVerified?: boolean };
          duration: string;
          students: number;
          rating: number;
          progress: number;
          category: string;
        };

        return (
          <div className="space-y-4">
            {/* 课程封面 */}
            <div className="aspect-video relative bg-ink-100 dark:bg-ink-800">
              <SmartImage
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                  <Play weight="fill" className="w-6 h-6 text-cinnabar ml-1" />
                </button>
              </div>
            </div>

            {/* 课程信息 */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">
                  {course.category === 'calligraphy' ? '书法' : 
                   course.category === 'painting' ? '国画' : 
                   course.category === 'poetry' ? '诗词' : course.category}
                </Badge>
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-ink-500' : 'text-ink-500'
                )}>
                  {course.students} 人正在学习
                </span>
              </div>

              <h2 className={cn(
                'text-lg font-bold mb-2',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {course.title}
              </h2>

              {/* 讲师信息 */}
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className={cn(
                    'text-sm font-medium',
                    isDark ? 'text-ink-200' : 'text-ink-800'
                  )}>
                    {course.instructor.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star weight="fill" className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs">
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className={cn(
                'flex items-center gap-4 p-3 rounded-lg mb-4',
                isDark ? 'bg-ink-800' : 'bg-ink-50'
              )}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-400' : 'text-ink-500'
                  )}>
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-400' : 'text-ink-500'
                  )}>
                    {course.students} 学生
                  </span>
                </div>
              </div>

              {/* 学习进度 */}
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={isDark ? 'text-ink-400' : 'text-ink-500'}>
                      学习进度
                    </span>
                    <span className="text-cinnabar font-medium">{course.progress}%</span>
                  </div>
                  <div className={cn(
                    'h-2 rounded-full overflow-hidden',
                    isDark ? 'bg-ink-800' : 'bg-ink-200'
                  )}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-cinnabar rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <Button className="w-full bg-cinnabar hover:bg-cinnabar-dark">
                {course.progress > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    继续学习
                    <CaretRight className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play weight="fill" className="w-4 h-4" />
                    开始学习
                  </span>
                )}
              </Button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="dialog-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 z-50"
      />
      <motion.div
        key="dialog-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          'fixed inset-x-4 bottom-0 z-50',
          'rounded-t-3xl overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'max-h-[85vh] overflow-y-auto'
        )}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          aria-label="关闭详情"
          className={cn(
            'absolute top-4 right-4 z-10 p-2 rounded-full',
            'bg-black/20 text-white backdrop-blur-sm'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 内容 */}
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
