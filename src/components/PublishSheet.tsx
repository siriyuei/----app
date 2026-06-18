import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  TextT,
  PaintBrush,
  ChatCircle,
  Plus,
  Check
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SmartImage } from '@/components/SmartImage';

// 发布类型
const publishTypes = [
  { id: 'calligraphy', name: '书法作品', icon: TextT },
  { id: 'painting', name: '绘画作品', icon: PaintBrush },
  { id: 'poetry', name: '诗词创作', icon: ChatCircle },
];

// 标签选项
const tagOptions = [
  '书法', '国画', '山水', '花鸟', '人物', '诗词', '篆刻', '临摹', '原创'
];

export function PublishSheet() {
  const { isPublishOpen, setIsPublishOpen, setIsPublishSuccess, theme, user, addWork, addPost } = useStore();
  const [activeType, setActiveType] = useState('calligraphy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const handleClose = useCallback(() => {
    setIsPublishOpen(false);
    // 重置表单
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setImages([]);
  }, [setIsPublishOpen]);

  useEffect(() => {
    if (!isPublishOpen) return;

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
  }, [handleClose, isPublishOpen]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handlePublish = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // 模拟发布请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const imageUrl = images.length > 0 ? images[0] : `/images/work-${activeType}-1.jpg`;
    
    // 添加到作品列表
    addWork({
      title,
      content,
      image: imageUrl,
      author: user,
      tags: selectedTags,
    });
    
    // 添加到动态列表
    addPost({
      title,
      content,
      image: imageUrl,
      author: user,
      tags: selectedTags,
      type: activeType as 'calligraphy' | 'painting' | 'poetry',
    });
    
    setIsSubmitting(false);
    handleClose();
    
    // 显示发布成功弹窗
    setIsPublishSuccess(true);
  };

  return (
    <AnimatePresence>
      {isPublishOpen && (
        <>
          <motion.div
            key="publish-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            key="publish-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            role="dialog"
            aria-modal="true"
            aria-label="发布作品面板"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'rounded-t-3xl overflow-hidden',
              isDark ? 'bg-ink-900' : 'bg-white'
            )}
            style={{ maxHeight: '85vh' }}
          >
            {/* 头部 */}
            <div className={cn(
              'flex items-center justify-between px-4 py-3 border-b',
              isDark ? 'border-ink-800' : 'border-ink-100'
            )}>
              <button
                onClick={handleClose}
                aria-label="关闭发布面板"
                className={cn(
                  'p-2 rounded-full',
                  isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
                )}
              >
                <X className={cn(
                  'w-5 h-5',
                  isDark ? 'text-ink-400' : 'text-ink-500'
                )} />
              </button>
              <h2 className={cn(
                'text-lg font-serif',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                发布作品
              </h2>
              <Button
                onClick={handlePublish}
                disabled={!title.trim() || isSubmitting}
                className="bg-cinnabar hover:bg-cinnabar-dark text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    发布中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    发布
                  </span>
                )}
              </Button>
            </div>

            {/* 内容区域 */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
              {/* 类型选择 */}
              <div className="flex gap-2 mb-4">
                {publishTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full',
                        'transition-all',
                        isActive
                          ? 'bg-cinnabar text-white'
                          : (isDark 
                              ? 'bg-ink-800 text-ink-300' 
                              : 'bg-ink-100 text-ink-600')
                      )}
                    >
                      <Icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4" />
                      <span className="text-sm">{type.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* 标题输入 */}
              <Input
                placeholder="添加标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  'mb-4 border-0 px-0 text-lg font-medium',
                  'focus-visible:ring-0 placeholder:text-ink-400',
                  isDark 
                    ? 'bg-transparent text-ink-100' 
                    : 'bg-transparent text-ink-900'
                )}
              />

              {/* 内容输入 */}
              <Textarea
                placeholder="分享您的创作心得..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  'mb-4 min-h-[100px] resize-none border-0 px-0',
                  'focus-visible:ring-0 placeholder:text-ink-400',
                  isDark 
                    ? 'bg-transparent text-ink-100' 
                    : 'bg-transparent text-ink-900'
                )}
              />

              {/* 图片上传区域 */}
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 rounded-lg overflow-hidden relative"
                    >
                      <SmartImage
                        src={img}
                        alt={`上传 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                        aria-label={`删除第${index + 1}张图片`}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      // 模拟添加图片
                      setImages((prev) => [...prev, '/images/work-painting-1.jpg']);
                    }}
                    aria-label="添加图片"
                    className={cn(
                      'w-20 h-20 rounded-lg flex flex-col items-center justify-center gap-1',
                      'border-2 border-dashed',
                      isDark 
                        ? 'border-ink-700 text-ink-500 hover:border-ink-600' 
                        : 'border-ink-300 text-ink-400 hover:border-ink-400'
                    )}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">添加图片</span>
                  </button>
                </div>
              </div>

              {/* 标签选择 */}
              <div>
                <p className={cn(
                  'text-sm mb-2',
                  isDark ? 'text-ink-400' : 'text-ink-600'
                )}>
                  选择标签 ({selectedTags.length}/3)
                </p>
                <div className="flex gap-2 flex-wrap">
                  {tagOptions.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm transition-all',
                          isSelected
                            ? 'bg-cinnabar text-white'
                            : (isDark 
                                ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' 
                                : 'bg-ink-100 text-ink-600 hover:bg-ink-200')
                        )}
                      >
                        {tag}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
