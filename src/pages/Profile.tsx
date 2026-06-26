import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gear,
  CaretRight,
  Images,
  Heart,
  ShoppingBag,
  BookOpen,
  SealCheck,
  Log,
  Pencil,
  Shield,
  Lock,
  DeviceMobile,
  Check,
  X,
  FloppyDisk
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SmartImage } from '@/components/SmartImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const menuItems = [
  { id: 'works', name: '我的作品', icon: Images, count: 0 },
  { id: 'favorites', name: '我的收藏', icon: Heart, count: 0 },
  { id: 'orders', name: '我的订单', icon: ShoppingBag, count: 0 },
  { id: 'learning', name: '学习记录', icon: BookOpen, count: 0 },
];

const accountMenuItems = [
  { id: 'security', name: '账号安全', icon: Shield, desc: '修改密码、绑定邮箱' },
  { id: 'password', name: '修改密码', icon: Lock, desc: '设置新密码' },
  { id: 'devices', name: '登录设备', icon: DeviceMobile, desc: '管理登录设备' },
];

const placeholderWorks = [
    { id: '1', image: '/images/work-calligraphy-1.jpg', title: '', likes: 0 },
    { id: '2', image: '/images/work-painting-1.jpg', title: '', likes: 0 },
    { id: '3', image: '/images/work-painting-2.jpg', title: '', likes: 0 },
    { id: '4', image: '/images/work-calligraphy-2.jpg', title: '', likes: 0 },
    { id: '5', image: '/images/work-painting-3.jpg', title: '', likes: 0 },
    { id: '6', image: '/images/work-calligraphy-1.jpg', title: '', likes: 0 },
  ];

export function Profile() {
  const { user, theme, setCurrentPage } = useStore();
  const { signOut, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleStartEdit = () => {
    if (user) {
      setEditForm({ name: user.name, bio: user.bio });
      setIsEditing(true);
      setEditError('');
      setEditSuccess(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    
    const result = await updateUserProfile(editForm.name, editForm.bio);
    if (result.success) {
      setEditSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setEditSuccess(false);
      }, 1500);
    } else {
      setEditError(result.error || '保存失败');
    }
  };

  if (!user) {
    return (
      <div className={cn(
        'min-h-screen pb-24',
        isDark ? 'bg-ink-950' : 'bg-ink-50'
      )}>
        <div className={cn(
          'h-40 relative',
          'bg-gradient-to-b from-ink-800 to-ink-900'
        )}>
          <button
            onClick={() => setCurrentPage('settings')}
            aria-label="打开设置"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/30"
          >
            <Gear className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 -mt-16 relative z-10">
          <div className={cn(
            'p-8 rounded-2xl text-center',
            isDark ? 'bg-ink-900' : 'bg-white',
            'shadow-ink-lg'
          )}>
            <div className={cn(
              'w-20 h-20 rounded-full mx-auto mb-4',
              isDark ? 'bg-ink-800' : 'bg-ink-100'
            )}>
              <span className={cn(
                'text-4xl font-serif flex items-center justify-center h-full',
                isDark ? 'text-ink-400' : 'text-ink-500'
              )}>
                客
              </span>
            </div>
            
            <h1 className={cn(
              'text-xl font-bold mb-2',
              isDark ? 'text-ink-100' : 'text-ink-900'
            )}>
              欢迎来到墨境
            </h1>
            <p className={cn(
              'text-sm mb-6',
              isDark ? 'text-ink-400' : 'text-ink-500'
            )}>
              登录后可以发布作品、参与互动
            </p>
            
            <Button
              onClick={() => setCurrentPage('auth')}
              className={cn(
                'w-full h-12 rounded-xl',
                'bg-gradient-to-r from-ink-800 to-ink-900',
                'hover:from-ink-700 hover:to-ink-800',
                'text-white font-serif tracking-wider',
                'dark:bg-gradient-to-r dark:from-ink-700 dark:to-ink-800',
                'dark:hover:from-ink-600 dark:hover:to-ink-700'
              )}
            >
              <Log className="w-4 h-4 mr-2" />
              立即登录
            </Button>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className={cn(
            'rounded-xl overflow-hidden',
            isDark ? 'bg-ink-900' : 'bg-white',
            'shadow-ink'
          )}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.99 }}
                  aria-label={`打开${item.name}`}
                  onClick={() => setCurrentPage('auth')}
                  className={cn(
                    'w-full flex items-center justify-between p-4 opacity-60 cursor-not-allowed',
                    index !== menuItems.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      isDark ? 'bg-ink-800' : 'bg-ink-100'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        isDark ? 'text-ink-500' : 'text-ink-400'
                      )} />
                    </div>
                    <span className={cn(
                      'font-medium',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-ink-600' : 'text-ink-400'
                    )}>
                      {item.count}
                    </span>
                    <CaretRight className={cn(
                      'w-4 h-4',
                      isDark ? 'text-ink-600' : 'text-ink-400'
                    )} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={cn(
              'text-sm font-medium',
              isDark ? 'text-ink-400' : 'text-ink-600'
            )}>
              我的作品
            </h2>
            <button
              onClick={() => setCurrentPage('auth')}
              className={cn(
              'text-xs flex items-center gap-1',
              isDark ? 'text-ink-500' : 'text-ink-500'
              )}
            >
              登录查看
              <CaretRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {placeholderWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden relative',
                  isDark ? 'bg-ink-800' : 'bg-ink-100'
                )}
              >
                <SmartImage
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover grayscale"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      <div className={cn(
        'h-40 relative',
        'bg-gradient-to-b from-ink-800 to-ink-900'
      )}>
        <button
          onClick={() => setCurrentPage('settings')}
          aria-label="打开设置"
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/30"
        >
          <Gear className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 -mt-16 relative z-10">
        <div className={cn(
          'p-5 rounded-2xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink-lg'
        )}>
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-4 border-white dark:border-ink-900">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h1 className={cn(
                  'text-xl font-bold',
                  isDark ? 'text-ink-100' : 'text-ink-900'
                )}>
                  {user.name}
                </h1>
                {user.isVerified && (
                  <SealCheck className="w-5 h-5 text-blue-500" />
                )}
                <button
                  onClick={handleStartEdit}
                  aria-label="编辑资料"
                  className={cn(
                    'p-1 rounded-full',
                    isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
                  )}
                >
                  <Pencil className={cn(
                    'w-4 h-4',
                    isDark ? 'text-ink-500' : 'text-ink-400'
                  )} />
                </button>
              </div>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-ink-400' : 'text-ink-500'
              )}>
                {user.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around mt-6 pt-6 border-t border-ink-100 dark:border-ink-800">
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.works}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                作品
              </p>
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.followers}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                粉丝
              </p>
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xl font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                {user.following}
              </p>
              <p className={cn(
                'text-xs mt-1',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                关注
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className={cn(
          'rounded-xl overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.99 }}
                aria-label={`打开${item.name}`}
                className={cn(
                  'w-full flex items-center justify-between p-4',
                  index !== menuItems.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
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
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    {item.count}
                  </span>
                  <CaretRight className={cn(
                    'w-4 h-4',
                    isDark ? 'text-ink-600' : 'text-ink-400'
                  )} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        <h2 className={cn(
          'text-xs font-medium mb-2 px-1',
          isDark ? 'text-ink-500' : 'text-ink-500'
        )}>
          账号管理
        </h2>
        <div className={cn(
          'rounded-xl overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          {accountMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setCurrentPage('account-security')}
                aria-label={`打开${item.name}`}
                className={cn(
                  'w-full flex items-center justify-between p-4',
                  index !== accountMenuItems.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
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
                  <div>
                    <span className={cn(
                      'font-medium block',
                      isDark ? 'text-ink-200' : 'text-ink-800'
                    )}>
                      {item.name}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-ink-500' : 'text-ink-500'
                    )}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <CaretRight className={cn(
                  'w-4 h-4',
                  isDark ? 'text-ink-600' : 'text-ink-400'
                )} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn(
            'text-sm font-medium',
            isDark ? 'text-ink-400' : 'text-ink-600'
          )}>
            我的作品
          </h2>
          <button
            aria-label="查看全部作品"
            className={cn(
            'text-xs flex items-center gap-1',
            isDark ? 'text-ink-500' : 'text-ink-500'
            )}
          >
            查看全部
            <CaretRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {placeholderWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'aspect-square rounded-lg overflow-hidden relative group',
                'shadow-ink hover:shadow-lg transition-shadow'
              )}
            >
              <SmartImage
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover"
              />
              <div className={cn(
                'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100',
                'transition-opacity duration-300',
                'flex items-center justify-center'
              )}>
                <div className="flex items-center gap-2 text-white">
                  <Heart weight="fill" className="w-4 h-4 text-cinnabar" />
                  <span className="text-xs">{work.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => signOut()}
          className={cn(
            'w-full p-4 rounded-xl',
            'bg-red-50 dark:bg-red-900/20',
            'text-red-500',
            'hover:bg-red-100 dark:hover:bg-red-900/30'
          )}
        >
          退出登录
        </motion.button>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-sm p-6 rounded-2xl',
              isDark ? 'bg-ink-900' : 'bg-white',
              'shadow-lg'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                'text-lg font-bold',
                isDark ? 'text-ink-100' : 'text-ink-900'
              )}>
                编辑资料
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                aria-label="关闭"
                className={cn(
                  'p-1 rounded-full',
                  isDark ? 'hover:bg-ink-800' : 'hover:bg-ink-100'
                )}
              >
                <X className={cn(
                  'w-5 h-5',
                  isDark ? 'text-ink-500' : 'text-ink-500'
                )} />
              </button>
            </div>

            {editError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{editError}</AlertDescription>
              </Alert>
            )}

            {editSuccess && (
              <Alert className="mb-4 bg-green-100 text-green-700">
                <AlertDescription className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  保存成功
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className={cn(
                  'text-sm font-medium block mb-2',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  昵称
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={cn(
                    isDark ? 'bg-ink-800 border-ink-700' : '',
                    'focus:dark:ring-ink-600'
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  'text-sm font-medium block mb-2',
                  isDark ? 'text-ink-300' : 'text-ink-700'
                )}>
                  签名
                </label>
                <Input
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="写下你的个性签名..."
                  className={cn(
                    isDark ? 'bg-ink-800 border-ink-700' : '',
                    'focus:dark:ring-ink-600'
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className={cn(
                  'flex-1',
                  isDark ? 'border-ink-700' : ''
                )}
              >
                取消
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-ink-800 hover:bg-ink-700"
              >
                <FloppyDisk className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}