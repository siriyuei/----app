import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CaretLeft,
  Lock,
  EnvelopeSimple,
  DeviceMobile,
  WaveTriangle,
  Check,
  Eye,
  EyeClosed,
  Clock,
  ShieldCheck
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const securityItems = [
  { id: 'password', name: '修改密码', icon: Lock, desc: '定期更换密码保护账号安全' },
  { id: 'email', name: '绑定邮箱', icon: EnvelopeSimple, desc: '用于找回密码和接收通知' },
  { id: 'devices', name: '登录设备', icon: DeviceMobile, desc: '管理当前登录的设备' },
];

const mockDevices = [
  { id: '1', name: 'iPhone 15 Pro', ip: '192.168.1.100', location: '本地网络', time: '刚刚', active: true },
  { id: '2', name: 'MacBook Pro', ip: '10.0.0.5', location: '公司网络', time: '2小时前', active: false },
  { id: '3', name: 'iPad Air', ip: '192.168.1.105', location: '本地网络', time: '1天前', active: false },
];

export function AccountSecurity() {
  const { theme, setCurrentPage, user } = useStore();
  const { updatePassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'password' | 'email' | 'devices'>('password');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const handlePasswordSubmit = async () => {
    if (!user) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('密码长度至少为6位');
      return;
    }

    setLoading(true);
    setPasswordError('');
    
    const result = await updatePassword(passwordForm.newPassword);
    
    setLoading(false);
    
    if (result.success) {
      setPasswordSuccess(true);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 2000);
    } else {
      setPasswordError(result.error || '修改密码失败');
    }
  };

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
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
            账号安全
          </h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className={cn(
          'flex rounded-xl p-1',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          {securityItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg',
                  isActive
                    ? 'bg-ink-800 text-white dark:bg-ink-700'
                    : isDark
                      ? 'text-ink-400 hover:text-ink-200'
                      : 'text-ink-500 hover:text-ink-700'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        {activeTab === 'password' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-5 rounded-xl',
              isDark ? 'bg-ink-900' : 'bg-white',
              'shadow-ink'
            )}
          >
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-lg mb-4',
              'bg-amber-50/50 dark:bg-amber-900/20'
            )}>
              <WaveTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className={cn(
                'text-sm',
                isDark ? 'text-amber-200' : 'text-amber-800'
              )}>
                请确保新密码与旧密码不同，建议使用包含数字、字母的复杂密码以提高安全性。
              </p>
            </div>

            {passwordError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="mb-4 bg-green-100 text-green-700">
                <AlertDescription className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  密码修改成功，请重新登录
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className={cn(
                  'text-sm font-medium block mb-2',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  当前密码
                </label>
                <div className="relative">
                  <Lock className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                  <Input
                    type={showPassword.old ? 'text' : 'password'}
                    placeholder="请输入当前密码"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className={cn(
                      'pl-10',
                      isDark ? 'bg-ink-800 border-ink-700' : '',
                      'focus:dark:ring-ink-600'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2',
                      isDark ? 'text-ink-500' : 'text-ink-400'
                    )}
                  >
                    {showPassword.old ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={cn(
                  'text-sm font-medium block mb-2',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  新密码
                </label>
                <div className="relative">
                  <Lock className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                  <Input
                    type={showPassword.new ? 'text' : 'password'}
                    placeholder="请输入新密码"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className={cn(
                      'pl-10',
                      isDark ? 'bg-ink-800 border-ink-700' : '',
                      'focus:dark:ring-ink-600'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2',
                      isDark ? 'text-ink-500' : 'text-ink-400'
                    )}
                  >
                    {showPassword.new ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={cn(
                  'text-sm font-medium block mb-2',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  确认新密码
                </label>
                <div className="relative">
                  <Lock className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                  <Input
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder="请再次输入新密码"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={cn(
                      'pl-10',
                      isDark ? 'bg-ink-800 border-ink-700' : '',
                      'focus:dark:ring-ink-600'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className={cn(
                      'absolute right-3 top-1/2 -translate-y-1/2',
                      isDark ? 'text-ink-500' : 'text-ink-400'
                    )}
                  >
                    {showPassword.confirm ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePasswordSubmit}
              disabled={loading}
              className={cn(
                'w-full mt-6 bg-ink-800 hover:bg-ink-700',
                isDark ? 'bg-ink-700 hover:bg-ink-600' : ''
              )}
            >
              {loading ? '处理中...' : '修改密码'}
            </Button>
          </motion.div>
        )}

        {activeTab === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-5 rounded-xl',
              isDark ? 'bg-ink-900' : 'bg-white',
              'shadow-ink'
            )}
          >
            <div className={cn(
              'flex items-center justify-between p-4 rounded-xl mb-4',
              'bg-green-50/50 dark:bg-green-900/20'
            )}>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                <div>
                  <p className={cn(
                    'font-medium',
                    isDark ? 'text-green-200' : 'text-green-800'
                  )}>
                    邮箱已绑定
                  </p>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-green-300' : 'text-green-600'
                  )}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <Check className={cn(
                'w-6 h-6',
                isDark ? 'text-green-400' : 'text-green-500'
              )} />
            </div>

            <div className={cn(
              'flex items-start gap-3 p-3 rounded-lg',
              'bg-blue-50/50 dark:bg-blue-900/20'
            )}>
              <EnvelopeSimple className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className={cn(
                'text-sm',
                isDark ? 'text-blue-200' : 'text-blue-800'
              )}>
                绑定邮箱可以用于找回密码、接收重要通知和验证身份。
              </p>
            </div>

            <Button
              variant="outline"
              className={cn(
                'w-full mt-4',
                isDark ? 'border-ink-700' : ''
              )}
            >
              更换绑定邮箱
            </Button>
          </motion.div>
        )}

        {activeTab === 'devices' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {mockDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-4 rounded-xl mb-3',
                  isDark ? 'bg-ink-900' : 'bg-white',
                  'shadow-ink'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      device.active
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-ink-100 dark:bg-ink-800'
                    )}>
                      <DeviceMobile className={cn(
                        'w-5 h-5',
                        device.active
                          ? 'text-green-600'
                          : isDark ? 'text-ink-500' : 'text-ink-400'
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        isDark ? 'text-ink-200' : 'text-ink-800'
                      )}>
                        {device.name}
                      </p>
                      <p className={cn(
                        'text-xs mt-0.5',
                        isDark ? 'text-ink-500' : 'text-ink-500'
                      )}>
                        {device.location} · {device.ip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.active ? (
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        'bg-green-100 dark:bg-green-900/30',
                        'text-green-600'
                      )}>
                        当前
                      </span>
                    ) : (
                      <span className={cn(
                        'text-xs',
                        isDark ? 'text-ink-500' : 'text-ink-500'
                      )}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {device.time}
                      </span>
                    )}
                  </div>
                </div>
                
                {!device.active && (
                  <button
                    className={cn(
                      'mt-3 text-xs text-red-500 hover:text-red-600',
                      'dark:text-red-400 dark:hover:text-red-300'
                    )}
                  >
                    退出该设备
                  </button>
                )}
              </motion.div>
            ))}

            <Button
              variant="outline"
              className={cn(
                'w-full',
                isDark ? 'border-ink-700' : ''
              )}
            >
              退出其他所有设备
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}