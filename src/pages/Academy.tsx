import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass,
  Play,
  Clock,
  Users,
  Star,
  Fire,
  Trophy,
  CheckCircle
} from '@phosphor-icons/react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { SmartImage } from '@/components/SmartImage';

// 课程分类
const categories = [
  { id: 'all', name: '全部' },
  { id: 'calligraphy', name: '书法' },
  { id: 'painting', name: '国画' },
  { id: 'poetry', name: '诗词' },
  { id: 'seal', name: '篆刻' },
];

// 课程数据
const courses = [
  {
    id: '1',
    title: '楷书入门基础教程',
    image: '/images/course-calligraphy.jpg',
    instructor: {
      name: '王大师',
      avatar: '/images/avatar-2.jpg',
      isVerified: true,
    },
    duration: '12课时',
    students: 2345,
    rating: 4.9,
    progress: 0,
    category: 'calligraphy',
  },
  {
    id: '2',
    title: '水墨画技法精讲',
    image: '/images/course-painting.jpg',
    instructor: {
      name: '李教授',
      avatar: '/images/avatar-1.jpg',
      isVerified: true,
    },
    duration: '18课时',
    students: 1890,
    rating: 4.8,
    progress: 35,
    category: 'painting',
  },
  {
    id: '3',
    title: '古诗词鉴赏与创作',
    image: '/images/course-poetry.jpg',
    instructor: {
      name: '张诗人',
      avatar: '/images/avatar-2.jpg',
      isVerified: true,
    },
    duration: '15课时',
    students: 1567,
    rating: 4.7,
    progress: 0,
    category: 'poetry',
  },
];

// 学习数据
const learningStats = {
  streak: 7,
  totalMinutes: 1280,
  completedCourses: 3,
  badges: [
    { id: '1', name: '初学者', icon: '🔰' },
    { id: '2', name: '坚持7天', icon: '🔥' },
    { id: '3', name: '书法达人', icon: '✍️' },
  ],
};

// 排行榜
const leaderboard = [
  { rank: 1, name: '墨香书客', avatar: '/images/avatar-1.jpg', points: 12580 },
  { rank: 2, name: '清风雅士', avatar: '/images/avatar-2.jpg', points: 11230 },
  { rank: 3, name: '竹林隐士', avatar: '/images/avatar-1.jpg', points: 9876 },
];

export function Academy() {
  const { theme, setDialogItem } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const handleCourseClick = (course: typeof courses[0]) => {
    setDialogItem({ type: 'course', data: course });
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isDark ? 'bg-ink-950' : 'bg-ink-50'
    )}>
      {/* 顶部搜索 */}
      <div className={cn(
        'sticky top-0 z-10 px-4 py-3',
        'glass border-b',
        isDark ? 'border-ink-800' : 'border-ink-200'
      )}>
        <h1 className={cn(
          'text-lg font-serif mb-3',
          isDark ? 'text-ink-100' : 'text-ink-900'
        )}>
          书院
        </h1>
        <div className="relative">
          <MagnifyingGlass className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
            isDark ? 'text-ink-500' : 'text-ink-400'
          )} />
          <Input
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="搜索课程"
            className={cn(
              'pl-10 rounded-full',
              isDark 
                ? 'bg-ink-800 border-ink-700 text-ink-100 placeholder:text-ink-500'
                : 'bg-white border-ink-200 text-ink-900 placeholder:text-ink-400'
            )}
          />
        </div>
      </div>

      {/* 学习统计 */}
      <div className="px-4 mt-4">
        <div className={cn(
          'p-4 rounded-xl',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Fire className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className={cn(
                  'text-2xl font-bold',
                  isDark ? 'text-ink-100' : 'text-ink-900'
                )}>
                  {learningStats.streak}
                </p>
                <p className={cn(
                  'text-xs',
                  isDark ? 'text-ink-500' : 'text-ink-500'
                )}>
                  连续学习天数
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {learningStats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                    isDark ? 'bg-ink-800' : 'bg-ink-100'
                  )}
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={cn(
                'text-lg font-semibold',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                {Math.floor(learningStats.totalMinutes / 60)}h
              </p>
              <p className={cn(
                'text-xs',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                学习时长
              </p>
            </div>
            <div>
              <p className={cn(
                'text-lg font-semibold',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                {learningStats.completedCourses}
              </p>
              <p className={cn(
                'text-xs',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                完成课程
              </p>
            </div>
            <div>
              <p className={cn(
                'text-lg font-semibold',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                {learningStats.badges.length}
              </p>
              <p className={cn(
                'text-xs',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                获得徽章
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 每日一字 */}
      <div className="px-4 mt-4">
        <div className={cn(
          'p-4 rounded-xl relative overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              'bg-cinnabar/10 text-cinnabar'
            )}>
              每日一字
            </span>
            <span className={cn(
              'text-xs',
              isDark ? 'text-ink-500' : 'text-ink-500'
            )}>
              第 128 天
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className={cn(
              'w-24 h-24 rounded-xl flex items-center justify-center',
              isDark ? 'bg-ink-800' : 'bg-ink-100'
            )}>
              <span className="text-6xl font-serif text-ink-900 dark:text-ink-100">
                墨
              </span>
            </div>
            <div className="flex-1">
              <p className={cn(
                'text-sm font-medium mb-1',
                isDark ? 'text-ink-200' : 'text-ink-800'
              )}>
                今日练习：墨
              </p>
              <p className={cn(
                'text-xs mb-3',
                isDark ? 'text-ink-500' : 'text-ink-500'
              )}>
                上下结构，黑+土，共15画
              </p>
              <button aria-label="开始今日练习" className="text-xs px-4 py-2 rounded-full bg-cinnabar text-white flex items-center gap-1">
                <Play weight="fill" className="w-3 h-3" />
                开始练习
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 课程分类 */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'px-4 py-2 rounded-full whitespace-nowrap text-sm',
                  'transition-all',
                  isActive
                    ? 'bg-cinnabar text-white'
                    : (isDark 
                        ? 'bg-ink-800 text-ink-300 hover:bg-ink-700' 
                        : 'bg-white text-ink-600 hover:bg-ink-100')
                )}
              >
                {category.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 课程列表 */}
      <div className="px-4 mt-4">
        <h2 className={cn(
          'text-sm font-medium mb-3',
          isDark ? 'text-ink-400' : 'text-ink-600'
        )}>
          推荐课程
        </h2>
        <div className="space-y-4">
          {filteredCourses.length === 0 && (
            <div
              className={cn(
                'rounded-xl p-6 text-center',
                isDark ? 'bg-ink-900 text-ink-400' : 'bg-white text-ink-500',
                'shadow-ink'
              )}
            >
              未找到匹配课程，试试更短的关键词或切换分类。
            </div>
          )}
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCourseClick(course)}
              className={cn(
                'rounded-xl overflow-hidden cursor-pointer',
                isDark ? 'bg-ink-900' : 'bg-white',
                'shadow-ink',
                'hover:shadow-lg transition-shadow'
              )}
            >
              <div className="flex gap-4 p-4">
                {/* 课程封面 */}
                <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <SmartImage
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 课程信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-medium text-sm mb-1 truncate',
                    isDark ? 'text-ink-200' : 'text-ink-800'
                  )}>
                    {course.title}
                  </h3>
                  
                  {/* 讲师 */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-ink-400' : 'text-ink-500'
                    )}>
                      {course.instructor.name}
                    </span>
                    {course.instructor.isVerified && (
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                  
                  {/* 统计 */}
                  <div className={cn(
                    'flex items-center gap-3 text-xs',
                    isDark ? 'text-ink-500' : 'text-ink-500'
                  )}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star weight="fill" className="w-3 h-3 text-yellow-500" />
                      {course.rating}
                    </span>
                  </div>
                  
                  {/* 进度 */}
                  {course.progress > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isDark ? 'text-ink-500' : 'text-ink-500'}>
                          学习进度
                        </span>
                        <span className="text-cinnabar">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 排行榜 */}
      <div className="px-4 mt-6">
        <h2 className={cn(
          'text-sm font-medium mb-3',
          isDark ? 'text-ink-400' : 'text-ink-600'
        )}>
          学习排行榜
        </h2>
        <div className={cn(
          'rounded-xl overflow-hidden',
          isDark ? 'bg-ink-900' : 'bg-white',
          'shadow-ink'
        )}>
          {leaderboard.map((user, index) => (
            <div
              key={user.rank}
              className={cn(
                'flex items-center gap-3 p-3',
                index !== leaderboard.length - 1 && (isDark ? 'border-b border-ink-800' : 'border-b border-ink-100')
              )}
            >
              {/* 排名 */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                user.rank === 1 ? 'bg-yellow-500 text-white' :
                user.rank === 2 ? 'bg-gray-400 text-white' :
                user.rank === 3 ? 'bg-orange-400 text-white' :
                (isDark ? 'bg-ink-800 text-ink-400' : 'bg-ink-100 text-ink-600')
              )}>
                {user.rank === 1 ? <Trophy weight="fill" className="w-4 h-4" /> : user.rank}
              </div>
              
              {/* 头像 */}
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              
              {/* 信息 */}
              <div className="flex-1">
                <p className={cn(
                  'font-medium text-sm',
                  isDark ? 'text-ink-200' : 'text-ink-800'
                )}>
                  {user.name}
                </p>
              </div>
              
              {/* 积分 */}
              <div className={cn(
                'text-sm font-semibold',
                isDark ? 'text-ink-300' : 'text-ink-700'
              )}>
                {user.points.toLocaleString()} 分
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
