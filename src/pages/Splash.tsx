import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function Splash() {
  const { setCurrentPage, setHasSeenSplash } = useStore();
  const [isExiting, setIsExiting] = useState(false);
  const [showInk, setShowInk] = useState(false);

  useEffect(() => {
    // 墨滴动画定时
    const inkTimer = setTimeout(() => {
      setShowInk(true);
    }, 500);

    return () => clearTimeout(inkTimer);
  }, []);

  useEffect(() => {
    if (!isExiting) return;
    const exitTimer = window.setTimeout(() => {
      setHasSeenSplash(true);
      setCurrentPage('inkpool');
    }, 700);
    return () => window.clearTimeout(exitTimer);
  }, [isExiting, setCurrentPage, setHasSeenSplash]);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 z-[100]',
            'flex flex-col items-center justify-center',
            'bg-ink-950'
          )}
        >
          {/* 墨滴涟漪效果 */}
          <div className="relative w-48 h-48 mb-8 pointer-events-none">
            {/* 中心墨点 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ink-800 to-ink-950 flex items-center justify-center">
                <span className="text-6xl font-serif text-ink-100">墨</span>
              </div>
            </motion.div>
            
            {/* 涟漪环 */}
            {showInk && (
              <>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-ink-700/30"
                />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
                  className="absolute inset-0 rounded-full border border-ink-600/20"
                />
              </>
            )}
          </div>

          {/* 标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl font-serif text-ink-100 tracking-widest mb-2"
          >
            云栖·墨境
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-sm font-hand text-ink-400 tracking-wider mb-12"
          >
            一笔一世界，墨染千重山
          </motion.p>

          {/* 进入按钮 */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            className={cn(
              'px-10 py-3 rounded-full',
              'border border-ink-700',
              'text-ink-200 font-serif tracking-widest',
              'transition-all duration-300',
              'hover:bg-ink-800 hover:border-ink-600',
              'active:bg-ink-900'
            )}
          >
            踏入墨境
          </motion.button>

          {/* 底部装饰 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 text-ink-600 text-xs">
              <span className="w-8 h-px bg-ink-700" />
              <span className="font-hand">墨流主义</span>
              <span className="w-8 h-px bg-ink-700" />
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[100] bg-ink-950"
        >
          {/* 宣纸晕染效果 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-ink-800"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
