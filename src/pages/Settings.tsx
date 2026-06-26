import { motion } from 'framer-motion';
import { 
  CaretLeft,
  Moon,
  Sun,
  Bell,
  Globe,
  Shield,
  User,
  FileText,
  Question,
  Trash,
  SignOut
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

// 设置分组
const settingGroups = [
  {
    title: '账号设置',
    items: [
      { id: 'profile', name: '个人资料', icon: User },
      { id: 'security', name: '账号与安全', icon: Shield },
      { id: 'privacy', name: '隐私设置', icon: FileText },
    ],
  },
  {
    title: '应用设置',
    items: [
      { id: 'notifications', name: '通知设置', icon: Bell, hasSwitch: true },
      { id: 'language', name: '语言选择', icon: Globe, value: '简体中文' },
    ],
  },
  {
    title: '其他',
    items: [
      { id: 'help', name: '帮助与反馈', icon: Question },
      { id: 'clear', name: '清除缓存', icon: Trash, value: '128MB' },
    ],
  },
];

export function Settings() {
  const { theme, setTheme, setCurrentPage } = useStore();
  const { signOut } = useAuth();

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部导航 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('profile')}
            aria-label="返回个人中心"
            className={cn(
              'p-2 rounded-full',
              isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
            )}
          >
            <CaretLeft className={cn(
              'w-5 h-5',
              isDark ? 'text-ink-300' : 'text-ink-600'
            )} />
          </button>
          <h1 className={cn(
            'text-lg font-serif',
            isDark ? 'text-ink-100' : 'text-ink-900'
          )}>
            设置
          </h1>
        </div>
      </div>

      {/* 主题切换 */}
      <div className="px-4 mt-4">
        <div className={cn(
          'p-4 rounded-xl flex items-center justify-between',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-ink-800' : 'bg-ink-100'
            )}>
              {isDark ? (
                <Moon className="w-5 h-5 text-ink-300" />
              ) : (
                <Sun className="w-5 h-5 text-ink-600" />
              )}
            </div>
            <div>
              <p className={cn(
                'font-medium',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                深色模式
              </p>
              <p className={cn(
                'text-xs',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                {isDark ? '已开启' : '已关闭'}
              </p>
            </div>
          </div>
          <Switch
            checked={isDark}
            aria-label="切换深色模式"
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>

      {/* 设置分组 */}
      <div className="px-4 mt-4 space-y-4">
        {settingGroups.map((group) => (
          <div key={group.title}>
            <h2 className={cn(
              'text-xs font-medium mb-2 px-1',
              isDark ? 'text-ink-500' : 'text-ink-500'
            )}>
              {group.title}
            </h2>
            <div className={cn(
              'rounded-xl overflow-hidden',
              isDark ? 'bg-ink-900' : 'bg-white',
              'shadow-ink'
            )}>
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      'w-full flex items-center justify-between p-4',
                      index !== group.items.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        isDark ? 'bg-ink-800' : 'bg-ink-100'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5',
                          isDark ? 'text-ink-300' : 'text-ink-600'
                        )} />
                      </div>
                      <span className={cn(
                        'font-medium',
                        isDark ? 'text-ink-200' : 'text-ink-800'
                      )}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {'value' in item && (
                        <span className={cn(
                          'text-sm',
                          isDark ? 'text-ink-500' : 'text-ink-500'
                        )}>
                          {item.value}
                        </span>
                      )}
                      {'hasSwitch' in item && item.hasSwitch ? (
                        <Switch defaultChecked aria-label={`${item.name}开关`} />
                      ) : (
                        <CaretLeft className={cn(
                          'w-4 h-4 rotate-180',
                          isDark ? 'text-ink-600' : 'text-ink-400'
                        )} />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 退出登录 */}
      <div className="px-4 mt-8 mb-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => signOut()}
          className={cn(
            'w-full p-4 rounded-xl flex items-center justify-center gap-2',
            'bg-cinnabar/10 text-cinnabar',
            'hover:bg-cinnabar/20'
          )}
        >
          <SignOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </motion.button>
      </div>

      {/* 版本信息 */}
      <div className="text-center pb-8">
        <p className={cn(
          'text-xs',
          isDark ? 'text-ink-600' : 'text-ink-400'
        )}>
          云栖·墨境 v1.0.0
        </p>
        <p className={cn(
          'text-xs mt-1',
          isDark ? 'text-ink-700' : 'text-ink-300'
        )}>
          墨流主义设计系统
        </p>
      </div>
    </div>
  );
}
