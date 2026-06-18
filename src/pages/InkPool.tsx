import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PaintBrush, 
  Pen, 
  Pencil,
  Eraser,
  Heart,
  ChatCircle
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SmartImage } from '@/components/SmartImage';

// 工具栏数据
const tools = [
  { id: 'brush', name: '毛笔', icon: PaintBrush },
  { id: 'pen', name: '钢笔', icon: Pen },
  { id: 'pencil', name: '铅笔', icon: Pencil },
  { id: 'eraser', name: '橡皮', icon: Eraser },
];

// 颜色数据
const colors = [
  { id: 'black', name: '墨黑', value: '#1a1a1a' },
  { id: 'cinnabar', name: '朱砂', value: '#c41e3a' },
  { id: 'ochre', name: '赭石', value: '#8b7355' },
  { id: 'cyan', name: '花青', value: '#2d5a5a' },
  { id: 'yellow', name: '藤黄', value: '#d4a574' },
];

export function InkPool() {
  const { theme, works, toggleLike, likedItems, setDialogItem } = useStore();
  const [activeTool, setActiveTool] = useState('brush');
  const [activeColor, setActiveColor] = useState('black');

  const isDark = theme === 'dark';

  const handleWorkClick = (work: typeof works[0]) => {
    setDialogItem({ type: 'work', data: work });
  };

  const handleLike = (e: React.MouseEvent, workId: string) => {
    e.stopPropagation();
    toggleLike(workId);
  };

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部工具栏 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        {/* 创作工具 */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <motion.button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full',
                  'whitespace-nowrap transition-all',
                  isActive
                    ? (isDark 
                        ? 'bg-cinnabar text-white' 
                        : 'bg-cinnabar text-white')
                    : (isDark 
                        ? 'bg-ink-800 text-ink-300 hover:bg-ink-700' 
                        : 'bg-white text-ink-600 hover:bg-ink-100')
                )}
              >
                <Icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4" />
                <span className="text-sm">{tool.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* 颜色选择 */}
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.id}
              onClick={() => setActiveColor(color.id)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                activeColor === color.id
                  ? 'border-cinnabar scale-110'
                  : 'border-transparent'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 画布区域 */}
      <div className={cn(
        'mx-4 mt-4 rounded-2xl overflow-hidden',
        'aspect-[4/3] relative',
        isDark ? 'bg-ink-900' : 'bg-paper'
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className={cn(
            'text-lg font-hand',
            isDark ? 'text-ink-500' : 'text-ink-400'
          )}>
            在此创作您的作品...
          </p>
        </div>
        {/* 画布网格线 */}
        <div className={cn(
          'absolute inset-0 opacity-10',
          'bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]',
          'bg-[size:40px_40px]'
        )} />
      </div>

      {/* 每日一诗 */}
      <div className="px-4 mt-6">
        <div className={cn(
          'p-5 rounded-2xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              'bg-cinnabar/10 text-cinnabar'
            )}>
              每日一诗
            </span>
          </div>
          <p className={cn(
            'text-lg font-hand leading-relaxed',
            isDark ? 'text-ink-200' : 'text-ink-800'
          )}>
            "竹外桃花三两枝，春江水暖鸭先知。"
          </p>
          <p className={cn(
            'text-sm mt-2',
            isDark ? 'text-ink-500' : 'text-ink-500'
          )}>
            —— 苏轼《惠崇春江晚景》
          </p>
        </div>
      </div>

      {/* 作品展示 */}
      <div className="px-4 mt-6">
        <h2 className={cn(
          'text-lg font-serif mb-4',
          isDark ? 'text-ink-100' : 'text-ink-900'
        )}>
          精选作品
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleWorkClick(work)}
              className={cn(
                'rounded-xl overflow-hidden cursor-pointer',
                isDark ? 'bg-ink-900' : 'bg-white',
                'shadow-ink',
                'hover:shadow-lg transition-shadow'
              )}
            >
              {/* 作品图片 */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <SmartImage
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
                {/* 标签 */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 作品信息 */}
              <div className="p-3">
                <h3 className={cn(
                  'font-medium text-sm mb-2',
                  isDark ? 'text-ink-200' : 'text-ink-800'
                )}>
                  {work.title}
                </h3>
                
                {/* 作者信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={work.author.avatar} />
                      <AvatarFallback>{work.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-ink-400' : 'text-ink-500'
                    )}>
                      {work.author.name}
                    </span>
                  </div>
                  
                  {/* 互动按钮 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(e, work.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart
                        weight={likedItems.includes(work.id) ? 'fill' : 'regular'}
                        className={cn(
                          'w-4 h-4',
                          likedItems.includes(work.id) ? 'text-cinnabar' : (isDark ? 'text-ink-500' : 'text-ink-400')
                        )}
                      />
                      <span className={cn(
                        'text-xs',
                        isDark ? 'text-ink-500' : 'text-ink-400'
                      )}>
                        {work.likes + (likedItems.includes(work.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-1">
                      <ChatCircle className={cn(
                        'w-4 h-4',
                        isDark ? 'text-ink-500' : 'text-ink-400'
                      )} />
                      <span className={cn(
                        'text-xs',
                        isDark ? 'text-ink-500' : 'text-ink-400'
                      )}>
                        {work.comments}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
