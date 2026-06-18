import { motion } from 'framer-motion';
import { 
  House, 
  Users, 
  Storefront, 
  GraduationCap,
  Plus
} from '@phosphor-icons/react';
import { useStore, type Page } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'inkpool', label: '墨池', icon: House },
  { id: 'gathering', label: '雅集', icon: Users },
  { id: 'market', label: '墨宝阁', icon: Storefront },
  { id: 'academy', label: '书院', icon: GraduationCap },
];

export function BottomNav() {
  const { currentPage, setCurrentPage, setIsPublishOpen, theme } = useStore();
  
  const isDark = theme === 'dark';

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
  };

  const handlePublishClick = () => {
    setIsPublishOpen(true);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'glass border-t',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 px-4 max-w-lg mx-auto">
        {/* 左侧导航项 */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileTap={{ scale: 0.95 }}
              aria-label={`切换到${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1',
                'w-14 h-14 rounded-xl transition-colors',
                isActive 
                  ? (isDark ? 'text-cinnabar-light' : 'text-cinnabar')
                  : (isDark ? 'text-ink-400' : 'text-ink-500')
              )}
            >
              <Icon 
                weight={isActive ? 'fill' : 'regular'} 
                className="w-6 h-6"
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className={cn(
                    'absolute bottom-1 w-1 h-1 rounded-full',
                    isDark ? 'bg-cinnabar-light' : 'bg-cinnabar'
                  )}
                />
              )}
            </motion.button>
          );
        })}

        {/* 中央发布按钮 */}
        <motion.button
          onClick={handlePublishClick}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="发布作品"
          className={cn(
            'relative -top-4',
            'w-14 h-14 rounded-full',
            'flex items-center justify-center',
            'bg-cinnabar text-white',
            'shadow-lg shadow-cinnabar/30',
            'animate-pulse-slow'
          )}
        >
          <Plus weight="bold" className="w-7 h-7" />
          {/* 脉冲光环 */}
          <span className="absolute inset-0 rounded-full bg-cinnabar animate-ink-ripple" />
        </motion.button>

        {/* 右侧导航项 */}
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileTap={{ scale: 0.95 }}
              aria-label={`切换到${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1',
                'w-14 h-14 rounded-xl transition-colors',
                isActive 
                  ? (isDark ? 'text-cinnabar-light' : 'text-cinnabar')
                  : (isDark ? 'text-ink-400' : 'text-ink-500')
              )}
            >
              <Icon 
                weight={isActive ? 'fill' : 'regular'} 
                className="w-6 h-6"
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className={cn(
                    'absolute bottom-1 w-1 h-1 rounded-full',
                    isDark ? 'bg-cinnabar-light' : 'bg-cinnabar'
                  )}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
