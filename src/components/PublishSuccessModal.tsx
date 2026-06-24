import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PublishSuccessModal() {
  const { isPublishSuccess, setIsPublishSuccess, setCurrentPage } = useStore();
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const handleClose = () => {
    setIsPublishSuccess(false);
  };

  const handleViewWork = () => {
    // 先关闭弹窗，然后延迟跳转
    setIsPublishSuccess(false);
    setTimeout(() => {
      setCurrentPage('gathering');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isPublishSuccess && (
        <>
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            key="success-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]',
              'w-[320px] rounded-2xl p-6 text-center',
              isDark ? 'bg-ink-900' : 'bg-white',
              'shadow-2xl'
            )}
          >
            {/* 成功图标 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1, stiffness: 500 }}
              className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            {/* 标题 */}
            <h3 className={cn(
              'text-xl font-serif font-semibold mb-2',
              isDark ? 'text-ink-100' : 'text-ink-900'
            )}>
              发布成功
            </h3>

            {/* 描述 */}
            <p className={cn(
              'text-sm mb-6',
              isDark ? 'text-ink-400' : 'text-ink-500'
            )}>
              您的作品已成功分享到墨池和雅集
            </p>

            {/* 按钮 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className={cn(
                  'flex-1',
                  isDark 
                    ? 'border-ink-700 text-ink-300 hover:bg-ink-800' 
                    : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                )}
              >
                关闭
              </Button>
              <Button
                onClick={handleViewWork}
                className="flex-1 bg-cinnabar hover:bg-cinnabar-dark text-white"
              >
                查看动态
              </Button>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              aria-label="关闭弹窗"
              className={cn(
                'absolute top-3 right-3 p-1.5 rounded-full',
                isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
              )}
            >
              <X className={cn(
                'w-4 h-4',
                isDark ? 'text-ink-500' : 'text-ink-400'
              )} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}