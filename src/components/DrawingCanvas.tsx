import { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  tool: string;
  color: string;
  isDark: boolean;
}

// 画笔配置
const toolConfig = {
  brush: { lineWidth: 8, lineCap: 'round' as const, lineJoin: 'round' as const, opacity: 0.8 },
  pen: { lineWidth: 3, lineCap: 'round' as const, lineJoin: 'round' as const, opacity: 1 },
  pencil: { lineWidth: 2, lineCap: 'butt' as const, lineJoin: 'miter' as const, opacity: 0.9 },
  eraser: { lineWidth: 20, lineCap: 'round' as const, lineJoin: 'round' as const, opacity: 1 },
};

export function DrawingCanvas({ tool, color, isDark }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 获取颜色值
  const colorMap: Record<string, string> = {
    black: '#1a1a1a',
    cinnabar: '#c41e3a',
    ochre: '#8b7355',
    cyan: '#2d5a5a',
    yellow: '#d4a574',
  };

  const currentColor = colorMap[color] || colorMap.black;

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // 填充背景
    ctx.fillStyle = isDark ? '#0f0f0f' : '#f5f5dc';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 保存初始状态到历史记录
    saveToHistory();
  }, [isDark]);

  // 保存当前状态到历史记录
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 只保存当前状态之前的历史
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    ctx.putImageData(history[newIndex], 0, 0);
  }, [history, historyIndex]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    ctx.putImageData(history[newIndex], 0, 0);
  }, [history, historyIndex]);

  // 清空画布
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = isDark ? '#0f0f0f' : '#f5f5dc';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // 重置历史记录
    setHistory([]);
    setHistoryIndex(-1);
    saveToHistory();
  }, [isDark, saveToHistory]);

  // 获取鼠标/触摸位置
  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 开始绘画
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    lastPos.current = pos;
  };

  // 绘画中
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPosition(e);
    const config = toolConfig[tool as keyof typeof toolConfig] || toolConfig.brush;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    
    // 橡皮模式使用背景色
    ctx.strokeStyle = tool === 'eraser' 
      ? (isDark ? '#0f0f0f' : '#f5f5dc') 
      : currentColor;
    
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = config.lineCap;
    ctx.lineJoin = config.lineJoin;
    ctx.globalAlpha = config.opacity;
    
    ctx.stroke();

    lastPos.current = pos;
  };

  // 停止绘画
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  // 暴露方法给父组件
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      (canvas as any).__undo = undo;
      (canvas as any).__redo = redo;
      (canvas as any).__clear = clear;
    }
  }, [undo, redo, clear]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={cn(
          'w-full h-full cursor-crosshair rounded-2xl'
        )}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* 网格背景 */}
      <div className={cn(
        'absolute inset-0 pointer-events-none opacity-10',
        'bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]',
        'bg-[size:40px_40px]',
        isDark ? 'text-ink-700' : 'text-ink-300'
      )} />
    </div>
  );
}
