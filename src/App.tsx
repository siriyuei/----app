import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Splash } from '@/pages/Splash';
import { Auth } from '@/pages/Auth';
import { InkPool } from '@/pages/InkPool';
import { Gathering } from '@/pages/Gathering';
import { Market } from '@/pages/Market';
import { Academy } from '@/pages/Academy';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { AccountSecurity } from '@/pages/AccountSecurity';
import { DailyCharacter } from '@/pages/DailyCharacter';
import { BottomNav } from '@/components/BottomNav';
import { PublishSheet } from '@/components/PublishSheet';
import { DetailDialog } from '@/components/DetailDialog';
import { PublishSuccessModal } from '@/components/PublishSuccessModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { authUserToAppUser, type ProfileRow } from '@/lib/authUser';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

// 页面过渡动画配置
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
};

// 开屏已是全屏动效，外层只做淡入淡出以免位移冲突
const splashTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' as const },
};

function App() {
  const { currentPage, theme, setCurrentPage, setUser } = useStore();
  const { user, loading: authLoading } = useAuth();

  const isDark = theme === 'dark';

  // 同步 Supabase 登录用户到应用资料状态
  useEffect(() => {
    let isActive = true;

    const syncAppUser = async () => {
      if (!user) {
        setUser(null);
        return;
      }

      setUser(authUserToAppUser(user));

      if (!isSupabaseConfigured) {
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, bio, followers, following, works_count, is_verified')
        .eq('id', user.id)
        .maybeSingle<ProfileRow>();

      if (!isActive || error) return;

      setUser(authUserToAppUser(user, data));
    };

    if (!authLoading) {
      void syncAppUser();
    }

    return () => {
      isActive = false;
    };
  }, [authLoading, setUser, user]);

  // 未登录时直接显示登录界面
  useEffect(() => {
    const checkAuthAndNavigate = () => {
      const { hasSeenSplash, currentPage } = useStore.getState();
      if (hasSeenSplash && currentPage === 'splash') {
        if (user) {
          setCurrentPage('inkpool');
        } else {
          setCurrentPage('auth');
        }
      }
      if (!user && currentPage !== 'auth' && currentPage !== 'splash') {
        setCurrentPage('auth');
      }
    };
    if (useStore.persist.hasHydrated()) {
      checkAuthAndNavigate();
    }
    return useStore.persist.onFinishHydration(() => {
      checkAuthAndNavigate();
    });
  }, [currentPage, user, setCurrentPage]);

  // 用户登录后自动跳转
  useEffect(() => {
    if (user && currentPage === 'auth') {
      setCurrentPage('inkpool');
    }
  }, [user, currentPage, setCurrentPage]);

  // 应用主题
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // 加载中显示空白
  if (authLoading) {
    return (
      <div className={cn(
        'min-h-screen',
        isDark ? 'bg-ink-950' : 'bg-ink-50'
      )} />
    );
  }

  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return (
          <motion.div key="splash" {...splashTransition}>
            <Splash />
          </motion.div>
        );
      case 'auth':
        return (
          <motion.div key="auth" {...pageTransition}>
            <Auth />
          </motion.div>
        );
      case 'inkpool':
        return (
          <motion.div key="inkpool" {...pageTransition}>
            <InkPool />
          </motion.div>
        );
      case 'gathering':
        return (
          <motion.div key="gathering" {...pageTransition}>
            <Gathering />
          </motion.div>
        );
      case 'market':
        return (
          <motion.div key="market" {...pageTransition}>
            <Market />
          </motion.div>
        );
      case 'academy':
        return (
          <motion.div key="academy" {...pageTransition}>
            <Academy />
          </motion.div>
        );
      case 'daily-character':
        return (
          <motion.div key="daily-character" {...pageTransition}>
            <DailyCharacter />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div key="profile" {...pageTransition}>
            <Profile />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div key="settings" {...pageTransition}>
            <Settings />
          </motion.div>
        );
      case 'account-security':
        return (
          <motion.div key="account-security" {...pageTransition}>
            <AccountSecurity />
          </motion.div>
        );
      default:
        return (
          <motion.div key="inkpool" {...pageTransition}>
            <InkPool />
          </motion.div>
        );
    }
  };

  // 判断是否显示底部导航
  const showBottomNav = ['inkpool', 'gathering', 'market', 'academy', 'profile'].includes(currentPage);

  return (
    <ErrorBoundary>
      <div className={cn(
        'min-h-screen transition-colors duration-300',
        isDark ? 'bg-ink-950' : 'bg-ink-50'
      )}>
        {/* 主内容区域 */}
        <main className="relative">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>

        {/* 底部导航 */}
        {showBottomNav && <BottomNav />}

        {/* 发布面板 */}
        <PublishSheet />

        {/* 详情弹窗 */}
        <DetailDialog />

        {/* 发布成功弹窗 */}
        <PublishSuccessModal />
      </div>
    </ErrorBoundary>
  );
}

export default App;
