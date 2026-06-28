import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, ArrowRight, Check, BookOpen } from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

// 汉字笔画数据
const characterData = {
  char: '墨',
  pinyin: 'mò',
  meaning: '写字绘画用的黑色颜料',
  strokes: 15,
  structure: '上下结构',
  radicals: ['黑', '土'],
  strokeOrder: [
    { path: 'M 40 60 Q 60 50 80 60', label: '1' },
    { path: 'M 80 60 Q 100 70 100 90', label: '2' },
    { path: 'M 100 90 Q 100 110 80 120', label: '3' },
    { path: 'M 80 120 Q 60 130 40 120', label: '4' },
    { path: 'M 40 120 Q 20 110 20 90', label: '5' },
    { path: 'M 20 90 Q 20 70 40 60', label: '6' },
    { path: 'M 40 80 L 80 80', label: '7' },
    { path: 'M 30 100 L 90 100', label: '8' },
    { path: 'M 40 140 L 80 140', label: '9' },
    { path: 'M 35 160 L 85 160', label: '10' },
    { path: 'M 50 60 L 50 160', label: '11' },
    { path: 'M 70 60 L 70 160', label: '12' },
    { path: 'M 30 180 L 90 180', label: '13' },
    { path: 'M 40 200 L 80 200', label: '14' },
    { path: 'M 50 180 L 50 210 L 70 210', label: '15' },
  ],
};

export function DailyCharacter() {
  const { theme, setCurrentPage } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [showStroke, setShowStroke] = useState(false);
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasPath, setCanvasPath] = useState('');
  const [showResult, setShowResult] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = isDark ? '#e5e7eb' : '#1f2937';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
      }
    }
  }, [isDark]);

  // 演示动画
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStroke < characterData.strokeOrder.length) {
      const showTimer = window.setTimeout(() => {
        setShowStroke(true);
      }, 0);
      const timer = setTimeout(() => {
        setCurrentStroke(prev => prev + 1);
        setShowStroke(false);
      }, 800);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(timer);
      };
    }

    const finishTimer = window.setTimeout(() => {
      setIsPlaying(false);
    }, 0);
    return () => clearTimeout(finishTimer);
  }, [isPlaying, currentStroke]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStroke(0);
    setUserStrokes([]);
    setCanvasPath('');
    setShowResult(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStroke(0);
    setUserStrokes([]);
    setCanvasPath('');
    setShowResult(false);
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleBack = () => {
    setCurrentPage('academy');
  };

  // 跟练功能
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    lastPosRef.current = { x, y };
    setIsDrawing(true);
    setCanvasPath(`M ${x} ${y}`);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPlaying || !ctxRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    
    if (lastPosRef.current) {
      setCanvasPath(prev => `${prev} L ${x} ${y}`);
    }
    lastPosRef.current = { x, y };
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setUserStrokes(prev => [...prev, canvasPath]);
    setCanvasPath('');
    
    if (userStrokes.length + 1 >= characterData.strokes) {
      setShowResult(true);
    }
  };

  const handleCanvasMouseLeave = () => {
    if (isDrawing) {
      handleCanvasMouseUp();
    }
  };

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部导航 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="返回书院"
            className={cn(
              'p-2 rounded-full',
              isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
            )}
          >
            <ArrowLeft className={cn(
              'w-5 h-5',
              isDark ? 'text-ink-300' : 'text-ink-600'
            )} />
          </button>
          <div className="flex-1">
            <h1 className={cn(
              'text-lg font-serif',
              isDark ? 'text-ink-100' : 'text-ink-900'
            )}>
              每日一字
            </h1>
            <p className={cn(
              'text-xs',
              isDark ? 'text-ink-500' : 'text-ink-500'
            )}>
              第 128 天 · {characterData.char}
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4">
        {/* 汉字展示 */}
        <div className={cn(
          'p-6 rounded-2xl mb-4',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center justify-center mb-4">
            <span className="text-9xl font-serif text-cinnabar">
              {characterData.char}
            </span>
          </div>
          <div className="text-center">
            <p className={cn(
              'text-xl font-medium mb-1',
              isDark ? 'text-ink-200' : 'text-ink-800'
            )}>
              {characterData.pinyin}
            </p>
            <p className={cn(
              'text-sm',
              isDark ? 'text-ink-500' : 'text-ink-500'
            )}>
              {characterData.meaning}
            </p>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
            )}>
              {characterData.strokes} 画
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600'
            )}>
              {characterData.structure}
            </div>
          </div>
        </div>

        {/* 演示区域 */}
        <div className={cn(
          'p-4 rounded-2xl mb-4',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center justify-between mb-4">
            <span className={cn(
              'text-sm font-medium',
              isDark ? 'text-ink-200' : 'text-ink-800'
            )}>
              笔画演示
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className={cn(
                  'p-2 rounded-full',
                  isPlaying
                    ? 'bg-gray-300 cursor-not-allowed'
                    : (isDark ? 'bg-cinnabar hover:bg-cinnabar-dark' : 'bg-cinnabar hover:bg-cinnabar-dark'),
                  'text-white'
                )}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                className={cn(
                  'p-2 rounded-full',
                  isDark ? 'bg-ink-800 hover:bg-ink-700' : 'bg-ink-100 hover:bg-ink-200'
                )}
              >
                <ArrowRight className={cn(
                  'w-4 h-4',
                  isDark ? 'text-ink-400' : 'text-ink-600'
                )} />
              </button>
            </div>
          </div>

          {/* 演示画布 */}
          <div className={cn(
            'relative aspect-square rounded-xl overflow-hidden',
            isDark ? 'bg-ink-800' : 'bg-ink-100'
          )} style={{ height: '280px' }}>
            {/* 田字格背景 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 240">
              <line x1="60" y1="0" x2="60" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="120" y2="120" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="0" x2="120" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="0.5" strokeDasharray="2" />
              <line x1="120" y1="0" x2="0" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="0.5" strokeDasharray="2" />
            </svg>

            {/* 笔画演示 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 240">
              {characterData.strokeOrder.slice(0, currentStroke).map((stroke, index) => (
                <motion.path
                  key={index}
                  d={stroke.path}
                  stroke="#c53030"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              {showStroke && currentStroke < characterData.strokeOrder.length && (
                <motion.path
                  d={characterData.strokeOrder[currentStroke].path}
                  stroke="#c53030"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </svg>

            {/* 笔画序号 */}
            {currentStroke < characterData.strokeOrder.length && showStroke && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="text-4xl font-bold text-cinnabar/50">
                  {currentStroke + 1}
                </span>
              </motion.div>
            )}
          </div>

          <p className={cn(
            'text-xs text-center mt-3',
            isDark ? 'text-ink-500' : 'text-ink-500'
          )}>
            {isPlaying 
              ? `正在演示第 ${currentStroke + 1} 笔...` 
              : currentStroke >= characterData.strokes
                ? '演示完成，点击播放重新观看'
                : '点击播放按钮观看笔画演示'}
          </p>
        </div>

        {/* 跟练区域 */}
        <div className={cn(
          'p-4 rounded-2xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className={cn(
              'w-4 h-4',
              isDark ? 'text-ink-400' : 'text-ink-500'
            )} />
            <span className={cn(
              'text-sm font-medium',
              isDark ? 'text-ink-200' : 'text-ink-800'
            )}>
              跟我练习
            </span>
            <span className={cn(
              'text-xs ml-auto',
              isDark ? 'text-ink-500' : 'text-ink-500'
            )}>
              {userStrokes.length}/{characterData.strokes} 笔
            </span>
          </div>

          {/* 练习画布 */}
          <div className={cn(
            'relative aspect-square rounded-xl overflow-hidden touch-none',
            isDark ? 'bg-ink-800' : 'bg-ink-100'
          )} style={{ height: '280px' }}>
            {/* 田字格背景 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 240">
              <line x1="60" y1="0" x2="60" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="120" y2="120" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="0" x2="120" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="0.5" strokeDasharray="2" />
              <line x1="120" y1="0" x2="0" y2="240" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="0.5" strokeDasharray="2" />
            </svg>

            {/* 淡字背景 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-8xl font-serif opacity-10" style={{ color: isDark ? '#e5e7eb' : '#1f2937' }}>
                {characterData.char}
              </span>
            </div>

            {/* 用户画布 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseLeave}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                handleCanvasMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent<HTMLCanvasElement>);
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                handleCanvasMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent<HTMLCanvasElement>);
              }}
              onTouchEnd={handleCanvasMouseUp}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleReset}
              className={cn(
                'px-4 py-2 rounded-full text-sm',
                isDark ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              )}
            >
              重新练习
            </button>
            {userStrokes.length > 0 && userStrokes.length < characterData.strokes && (
              <p className={cn(
                'text-xs',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                继续书写下一笔...
              </p>
            )}
          </div>
        </div>

        {/* 练习结果 */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'
              )}
              onClick={() => setShowResult(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'w-full max-w-sm p-6 rounded-2xl text-center',
                  isDark ? 'bg-ink-900' : 'bg-white',
                  'shadow-2xl'
                )}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, stiffness: 500 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className={cn(
                  'text-xl font-serif font-semibold mb-2',
                  isDark ? 'text-ink-100' : 'text-ink-900'
                )}>
                  练习完成！
                </h3>
                <p className={cn(
                  'text-sm mb-6',
                  isDark ? 'text-ink-400' : 'text-ink-500'
                )}>
                  您已完成「{characterData.char}」字的练习，再接再厉！
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResult(false)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-full text-sm',
                      isDark ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    )}
                  >
                    关闭
                  </button>
                  <button
                    onClick={() => {
                      setShowResult(false);
                      handleReset();
                    }}
                    className="flex-1 px-4 py-2 rounded-full text-sm bg-cinnabar text-white hover:bg-cinnabar-dark"
                  >
                    再练一次
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
