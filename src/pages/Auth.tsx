import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeSimple, Lock, Eye, EyeClosed, User } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Auth() {
  const { signUpWithEmail, signInWithEmail, loading, error } = useAuth();
  const { setCurrentPage } = useStore();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const result = await signUpWithEmail(formData.email, formData.password, formData.username);
      if (result.success) {
        setCurrentPage('inkpool');
      }
    } else {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.success) {
        setCurrentPage('inkpool');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-ink-50 dark:bg-ink-950"
    >
      <div className={cn(
        'w-full max-w-sm rounded-2xl p-8',
        'bg-white dark:bg-ink-900',
        'shadow-lg dark:shadow-ink-lg'
      )}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ink-800 to-ink-950 mb-4">
            <span className="text-3xl font-serif text-ink-100">墨</span>
          </div>
          <h1 className={cn(
            'text-2xl font-serif tracking-widest',
            'dark:text-ink-100 text-ink-900'
          )}>
            {isSignUp ? '注册' : '登录'}
          </h1>
          <p className={cn(
            'text-sm mt-2',
            'dark:text-ink-400 text-ink-500'
          )}>
            {isSignUp ? '开启您的墨境之旅' : '欢迎回来'}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名（仅注册） */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <label className={cn(
                'text-sm font-medium',
                'dark:text-ink-300 text-ink-700'
              )}>
                用户名
              </label>
              <div className="relative">
                <User className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                  'dark:text-ink-500 text-ink-400'
                )} />
                <Input
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className={cn(
                    'pl-10',
                    'dark:bg-ink-800 dark:border-ink-700',
                    'focus:dark:ring-ink-600'
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* 邮箱 */}
          <div className="space-y-2">
            <label className={cn(
              'text-sm font-medium',
              'dark:text-ink-300 text-ink-700'
            )}>
              邮箱
            </label>
            <div className="relative">
              <EnvelopeSimple className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                'dark:text-ink-500 text-ink-400'
              )} />
              <Input
                type="email"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={cn(
                  'pl-10',
                  'dark:bg-ink-800 dark:border-ink-700',
                  'focus:dark:ring-ink-600'
                )}
              />
            </div>
          </div>

          {/* 密码 */}
          <div className="space-y-2">
            <label className={cn(
              'text-sm font-medium',
              'dark:text-ink-300 text-ink-700'
            )}>
              密码
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                'dark:text-ink-500 text-ink-400'
              )} />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className={cn(
                  'pl-10 pr-10',
                  'dark:bg-ink-800 dark:border-ink-700',
                  'focus:dark:ring-ink-600'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'dark:text-ink-500 text-ink-400 hover:text-ink-600'
                )}
              >
                {showPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 登录/注册按钮 */}
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full h-12 rounded-xl',
              'bg-gradient-to-r from-ink-800 to-ink-900',
              'hover:from-ink-700 hover:to-ink-800',
              'text-white font-serif tracking-wider',
              'dark:bg-gradient-to-r dark:from-ink-700 dark:to-ink-800',
              'dark:hover:from-ink-600 dark:hover:to-ink-700'
            )}
          >
            {loading ? '处理中...' : (isSignUp ? '注册' : '登录')}
          </Button>
        </form>

        {/* 切换登录/注册 */}
        <p className={cn(
          'text-center text-sm mt-6',
          'dark:text-ink-400 text-ink-500'
        )}>
          {isSignUp ? '已有账号？' : '还没有账号？'}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormData({ email: '', password: '', username: '' });
            }}
            className={cn(
              'ml-1 font-medium',
              'text-ink-700 dark:text-ink-300',
              'hover:text-ink-900 dark:hover:text-ink-100'
            )}
          >
            {isSignUp ? '立即登录' : '立即注册'}
          </button>
        </p>

        {/* 底部提示 */}
        <p className={cn(
          'text-center text-xs mt-8',
          'dark:text-ink-600 text-ink-400'
        )}>
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </div>
    </motion.div>
  );
}