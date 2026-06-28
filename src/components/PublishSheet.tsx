import { useCallback, useEffect, useState, useRef } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authUserToAppUser } from '@/lib/authUser';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useWorks } from '@/hooks/useDatabase';
import { useStorage } from '@/hooks/useStorage';

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
  const { isPublishOpen, setIsPublishOpen, setIsPublishSuccess, theme, user: storeUser, addWork, addPost } = useStore();
  const { user: authUser } = useAuth();
  const { createWork } = useWorks(authUser, false);
  const { createPost } = usePosts(authUser, false);
  const { uploadWorkImage, compressImage: compressFileForUpload } = useStorage(authUser);
  const [activeType, setActiveType] = useState('calligraphy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState('');
  
  // 文件上传input引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  const handleClose = useCallback(() => {
    setIsPublishOpen(false);
    // 重置表单
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setUploadedImage(null);
    setUploadedFile(null);
    setSubmitError('');
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

  // 简单的图片压缩函数
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // 最大尺寸
          const maxSize = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // 使用较低质量压缩
            const compressed = canvas.toDataURL('image/jpeg', 0.5);
            resolve(compressed);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 检查文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    try {
      // 压缩图片
      const compressedDataUrl = await compressImage(file);
      setUploadedImage(compressedDataUrl);
      setUploadedFile(file);
    } catch (error) {
      console.error('图片处理失败:', error);
      alert('图片处理失败，请重试');
    }

    // 重置input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublish = async () => {
    const author = storeUser ?? (authUser ? authUserToAppUser(authUser) : null);

    if (!author) {
      setSubmitError('请先登录后再发布作品');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    // 使用上传的图片或默认图片
    let imageUrl = uploadedImage || `/images/work-${activeType}-1.jpg`;
    let databaseSaved = false;

    if (authUser) {
      try {
        if (uploadedFile) {
          const optimizedFile = await compressFileForUpload(uploadedFile, 1200, 1200, 0.82);
          const uploadResult = await uploadWorkImage(optimizedFile);

          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || '图片上传失败');
          }

          imageUrl = uploadResult.url;
        }

        const workResult = await createWork({
          title: title || '无题',
          content,
          image: imageUrl,
          tags: selectedTags,
        });

        const postResult = await createPost({
          title: title || '',
          content,
          image: imageUrl,
          tags: selectedTags,
          type: activeType,
        });

        databaseSaved = workResult.success && postResult.success;

        if (!databaseSaved) {
          console.warn('数据库保存失败，已使用本地兜底:', workResult.error || postResult.error);
        }
      } catch (error) {
        console.warn('数据库保存失败，已使用本地兜底:', error);
      }
    }
    
    if (!databaseSaved && authUser) {
      setSubmitError('数据库保存失败，请确认 Supabase 表和 Storage 已创建后重试。');
      setIsSubmitting(false);
      return;
    }

    // 添加到本地列表作为乐观展示
    addWork({
      title: title || '无题',
      content: content,
      image: imageUrl,
      author,
      tags: selectedTags,
    });
    
    addPost({
      title: title || '',
      content: content,
      image: imageUrl,
      author,
      tags: selectedTags,
      type: activeType as 'calligraphy' | 'painting' | 'poetry',
    });
    
    // 重置表单
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setUploadedImage(null);
    setUploadedFile(null);
    setIsSubmitting(false);
    
    // 立即关闭面板并显示成功弹窗
    setIsPublishOpen(false);
    
    // 使用微任务确保状态更新完成后再显示成功弹窗
    Promise.resolve().then(() => {
      setTimeout(() => {
        setIsPublishSuccess(true);
      }, 100);
    });
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
              {submitError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

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
                  {uploadedImage && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden relative group">
                      <img
                        src={uploadedImage}
                        alt="上传的图片"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        aria-label="删除图片"
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {!uploadedImage && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="添加图片"
                      className={cn(
                        'w-20 h-20 rounded-lg flex flex-col items-center justify-center gap-1',
                        'border-2 border-dashed',
                        isDark 
                          ? 'border-ink-700 text-ink-500 hover:border-ink-600 hover:text-ink-400' 
                          : 'border-ink-300 text-ink-400 hover:border-ink-400 hover:text-ink-500'
                      )}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-xs">添加图片</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
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
