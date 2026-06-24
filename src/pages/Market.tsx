import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Heart,
  TrendUp,
  SealCheck
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartImage } from '@/components/SmartImage';
import { productImages } from '@/constants/productImages';

// 数字馆商品
const digitalItems = [
  {
    id: '1',
    title: '墨韵山水 NFT',
    image: productImages.nft,
    price: 2.5,
    currency: 'ETH',
    creator: {
      name: '墨香书客',
      avatar: '/images/avatar-1.jpg',
      isVerified: true,
    },
    likes: 328,
    isNew: true,
  },
  {
    id: '2',
    title: '数字书法 - 兰亭序',
    image: productImages.calligraphy1,
    price: 1.8,
    currency: 'ETH',
    creator: {
      name: '清风雅士',
      avatar: '/images/avatar-2.jpg',
      isVerified: true,
    },
    likes: 256,
    isHot: true,
  },
  {
    id: '3',
    title: '水墨荷花系列',
    image: productImages.painting3,
    price: 3.2,
    currency: 'ETH',
    creator: {
      name: '水墨丹青',
      avatar: '/images/avatar-1.jpg',
      isVerified: false,
    },
    likes: 412,
    isLimited: true,
  },
  {
    id: '4',
    title: '竹影清风',
    image: productImages.painting2,
    price: 1.5,
    currency: 'ETH',
    creator: {
      name: '竹林隐士',
      avatar: '/images/avatar-2.jpg',
      isVerified: true,
    },
    likes: 189,
  },
];

// 实物馆商品
const physicalItems = [
  {
    id: '5',
    title: '精品文房四宝套装',
    image: productImages.wenfang,
    price: 1280,
    currency: 'CNY',
    shop: '墨香阁',
    sales: 256,
    isHot: true,
  },
  {
    id: '6',
    title: '名家书法复刻 - 兰亭序',
    image: productImages.calligraphy2,
    price: 680,
    currency: 'CNY',
    shop: '古韵轩',
    sales: 128,
    isNew: true,
  },
  {
    id: '7',
    title: '手工宣纸 100张',
    image: productImages.painting1,
    price: 168,
    currency: 'CNY',
    shop: '纸墨香',
    sales: 512,
  },
  {
    id: '8',
    title: '徽墨精品套装',
    image: productImages.calligraphy1,
    price: 388,
    currency: 'CNY',
    shop: '墨韵堂',
    sales: 89,
    isLimited: true,
  },
];

export function Market() {
  const { theme, setDialogItem } = useStore();
  const [activeTab, setActiveTab] = useState('digital');

  const isDark = theme === 'dark';

  const handleProductClick = (item: typeof digitalItems[0] | typeof physicalItems[0]) => {
    setDialogItem({ type: 'product', data: item });
  };

  const items = activeTab === 'digital' ? digitalItems : physicalItems;

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部标题和购物车 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={cn(
            'text-lg font-serif',
            isDark ? 'text-ink-100' : 'text-ink-900'
          )}>
            墨宝阁
          </h1>
          <button
            aria-label="打开购物车"
            className={cn(
              'p-2 rounded-full relative',
              isDark ? 'bg-ink-800 text-ink-300' : 'bg-white text-ink-600'
            )}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinnabar text-white text-[10px] rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* 标签切换 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn(
            'w-full grid grid-cols-2',
            isDark ? 'bg-ink-800' : 'bg-ink-200'
          )}>
            <TabsTrigger 
              value="digital"
              className={cn(
                'data-[state=active]:bg-cinnabar data-[state=active]:text-white'
              )}
            >
              数字馆
            </TabsTrigger>
            <TabsTrigger 
              value="physical"
              className={cn(
                'data-[state=active]:bg-cinnabar data-[state=active]:text-white'
              )}
            >
              实物馆
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 商品网格 */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleProductClick(item)}
              className={cn(
                'rounded-xl overflow-hidden cursor-pointer',
                isDark ? 'bg-ink-900' : 'bg-white',
                'shadow-ink',
                'hover:shadow-lg transition-shadow'
              )}
            >
              {/* 商品图片 */}
              <div className="aspect-square relative overflow-hidden">
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* 标签 */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {'isNew' in item && item.isNew && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white">
                      新品
                    </span>
                  )}
                  {'isHot' in item && item.isHot && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white">
                      热卖
                    </span>
                  )}
                  {'isLimited' in item && item.isLimited && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500 text-white">
                      限量
                    </span>
                  )}
                </div>
              </div>

              {/* 商品信息 */}
              <div className="p-3">
                <h3 className={cn(
                  'font-medium text-sm mb-2 line-clamp-1',
                  isDark ? 'text-ink-200' : 'text-ink-800'
                )}>
                  {item.title}
                </h3>

                {/* 价格 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      'text-lg font-bold text-cinnabar'
                    )}>
                      {item.price}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {item.currency}
                    </span>
                  </div>
                  {'likes' in item && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      <Heart weight="fill" className="w-3 h-3" />
                      <span>{item.likes}</span>
                    </div>
                  )}
                  {'sales' in item && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      <TrendUp className="w-3 h-3" />
                      <span>{item.sales}</span>
                    </div>
                  )}
                </div>

                {/* 创作者/店铺 */}
                <div className="flex items-center gap-2">
                  {'creator' in item ? (
                    <>
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={item.creator.avatar} />
                        <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'text-xs',
                        isDark ? 'text-ink-400' : 'text-ink-500'
                      )}>
                        {item.creator.name}
                      </span>
                      {item.creator.isVerified && (
                        <SealCheck className="w-3 h-3 text-blue-500" />
                      )}
                    </>
                  ) : (
                    <>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
                      )}>
                        {item.shop}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 推荐板块 */}
      <div className="px-4 mt-6">
        <h2 className={cn(
          'text-sm font-medium mb-3',
          isDark ? 'text-ink-400' : 'text-ink-600'
        )}>
          热门推荐
        </h2>
        <div className={cn(
          'p-4 rounded-xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center gap-4">
            <SmartImage
              src="/images/event-gathering.jpg"
              alt="推荐"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className={cn(
                'font-medium mb-1',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                文人雅集限定藏品
              </h3>
              <p className={cn(
                'text-xs mb-2',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                参与雅集活动，赢取限量版数字藏品
              </p>
              <button aria-label="参与活动" className="text-xs px-3 py-1.5 rounded-full bg-cinnabar text-white">
                立即参与
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
