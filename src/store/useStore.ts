import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { famousImages } from '../constants/famousImages';
import { postImages } from '../constants/postImages';

export type Page = 'splash' | 'auth' | 'inkpool' | 'gathering' | 'market' | 'academy' | 'daily-character' | 'profile' | 'settings' | 'publish';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  works: number;
  isVerified: boolean;
}

export interface Author {
  id?: string;
  name: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
  works?: number;
  isVerified?: boolean;
}

export interface Work {
  id: string;
  title: string;
  content: string;
  image: string;
  author: Author;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  createdAt: string;
}

export interface Post extends Work {
  type: 'calligraphy' | 'painting' | 'poetry';
}

export interface DialogItem {
  type: 'work' | 'post' | 'product' | 'course';
  data: Work | Post | Product | Course;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  creator?: Author;
  shop?: string;
  likes?: number;
  sales?: number;
  isNew?: boolean;
  isHot?: boolean;
  isLimited?: boolean;
}

export interface Course {
  id: string;
  title: string;
  image: string;
  instructor: Author;
  duration: string;
  students: number;
  rating: number;
  progress: number;
  category: string;
}

interface AppState {
  // 主题
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // 导航
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  
  // 用户
  user: User | null;
  setUser: (user: User | null) => void;
  
  // 发布面板
  isPublishOpen: boolean;
  setIsPublishOpen: (open: boolean) => void;
  
  // 发布成功弹窗
  isPublishSuccess: boolean;
  setIsPublishSuccess: (isPublishSuccess: boolean) => void;
  
  // 是否已经看过开屏
  hasSeenSplash: boolean;
  setHasSeenSplash: (seen: boolean) => void;
  
  // 作品列表
  works: Work[];
  addWork: (work: Omit<Work, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => void;
  
  // 动态列表
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => void;
  
  // 收藏列表
  likedItems: string[];
  toggleLike: (itemId: string) => void;
  
  // 详情弹窗
  dialogItem: DialogItem | null;
  setDialogItem: (item: DialogItem | null) => void;
}

// Mock 用户数据
const mockUser: User = {
  id: '1',
  name: '墨香书客',
  avatar: '/images/avatar-1.jpg',
  bio: '一笔一世界，墨染千重山',
  followers: 1280,
  following: 365,
  works: 48,
  isVerified: true,
};

const mockUser2: User = {
  id: '2',
  name: '清风雅士',
  avatar: '/images/avatar-2.jpg',
  bio: '清风徐来，笔墨生香',
  followers: 890,
  following: 245,
  works: 32,
  isVerified: true,
};

const mockUser3: User = {
  id: '3',
  name: '竹林隐士',
  avatar: '/images/avatar-1.jpg',
  bio: '竹影清风，心旷神怡',
  followers: 456,
  following: 123,
  works: 18,
  isVerified: false,
};

// Mock 作品数据
const mockWorks: Work[] = [
  {
    id: '1',
    title: '千里江山图',
    content: '北宋王希孟传世之作，以青绿山水描绘锦绣河山，气势恢宏。',
    image: famousImages.qianli,
    author: { name: '王希孟', avatar: '/images/avatar-1.jpg', isVerified: true },
    likes: 1256,
    comments: 234,
    shares: 89,
    tags: ['绘画', '山水', '名画'],
    createdAt: '1113年',
  },
  {
    id: '2',
    title: '清明上河图',
    content: '北宋张择端所绘，生动记录了北宋都城汴京的繁华景象。',
    image: famousImages.qingming,
    author: { name: '张择端', avatar: '/images/avatar-2.jpg', isVerified: true },
    likes: 987,
    comments: 189,
    shares: 67,
    tags: ['绘画', '风俗', '名画'],
    createdAt: '1101年',
  },
  {
    id: '3',
    title: '富春山居图',
    content: '元代黄公望晚年杰作，被誉为"画中之兰亭"。',
    image: famousImages.fuchun,
    author: { name: '黄公望', avatar: '/images/avatar-1.jpg', isVerified: true },
    likes: 856,
    comments: 156,
    shares: 54,
    tags: ['绘画', '山水', '名画'],
    createdAt: '1350年',
  },
  {
    id: '4',
    title: '兰亭序',
    content: '王羲之代表作，被誉为"天下第一行书"，笔势飘逸，神韵天成。',
    image: famousImages.lanting,
    author: { name: '王羲之', avatar: '/images/avatar-2.jpg', isVerified: true },
    likes: 1123,
    comments: 267,
    shares: 98,
    tags: ['书法', '行书', '名帖'],
    createdAt: '353年',
  },
  {
    id: '5',
    title: '寒食帖',
    content: '苏轼代表作，中国三大行书之一，书法与文学的完美结合。',
    image: famousImages.hanshi,
    author: { name: '苏轼', avatar: '/images/avatar-1.jpg', isVerified: true },
    likes: 723,
    comments: 134,
    shares: 45,
    tags: ['书法', '行书', '名帖'],
    createdAt: '1082年',
  },
];

// Mock 动态数据
const mockPosts: Post[] = [
  {
    id: 'p1',
    title: '',
    content: '今日临摹《兰亭序》，感悟王羲之笔意。书法之道，在于心手合一，意在笔先。',
    image: postImages.calligraphy1,
    author: mockUser,
    likes: 328,
    comments: 56,
    shares: 23,
    tags: ['书法', '临摹', '兰亭序'],
    createdAt: '2小时前',
    type: 'calligraphy',
  },
  {
    id: 'p2',
    title: '',
    content: '山水之间，自有真意。此幅《云山烟雨》耗时三日，终于完成。',
    image: postImages.painting1,
    author: mockUser2,
    likes: 256,
    comments: 42,
    shares: 18,
    tags: ['绘画', '山水', '原创'],
    createdAt: '5小时前',
    type: 'painting',
  },
  {
    id: 'p3',
    title: '',
    content: '竹影清风，心旷神怡。写竹三十年，方得此中三昧。',
    image: postImages.painting2,
    author: mockUser3,
    likes: 189,
    comments: 31,
    shares: 12,
    tags: ['绘画', '竹子'],
    createdAt: '昨天',
    type: 'painting',
  },
  {
    id: 'p4',
    title: '',
    content: '练习楷书《多宝塔碑》，颜体的端庄大气令人沉醉。每一笔都要用心体会。',
    image: postImages.calligraphy2,
    author: mockUser2,
    likes: 425,
    comments: 68,
    shares: 35,
    tags: ['书法', '楷书', '颜真卿'],
    createdAt: '昨天',
    type: 'calligraphy',
  },
  {
    id: 'p5',
    title: '',
    content: '荷花出淤泥而不染，濯清涟而不妖。这幅水墨荷花送给大家。',
    image: postImages.painting3,
    author: mockUser,
    likes: 512,
    comments: 89,
    shares: 42,
    tags: ['绘画', '花鸟', '荷花'],
    createdAt: '2天前',
    type: 'painting',
  },
  {
    id: 'p6',
    title: '',
    content: '行草练习，感受书法的流动之美。笔墨随心，意在笔先。',
    image: postImages.calligraphy1,
    author: mockUser3,
    likes: 267,
    comments: 45,
    shares: 28,
    tags: ['书法', '行草', '练习'],
    createdAt: '3天前',
    type: 'calligraphy',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // 主题
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // 导航
      currentPage: 'splash',
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      // 用户
      user: null,
      setUser: (user) => set({ user }),
      
      // 发布面板
      isPublishOpen: false,
      setIsPublishOpen: (isPublishOpen) => set({ isPublishOpen }),
      
      // 发布成功弹窗
      isPublishSuccess: false,
      setIsPublishSuccess: (isPublishSuccess) => set({ isPublishSuccess }),
      
      // 开屏
      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),
      
      // 作品列表
      works: mockWorks,
      addWork: (workData) => {
        const newWork: Work = {
          ...workData,
          id: `work-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          likes: 0,
          comments: 0,
          shares: 0,
        };
        set((state) => ({ works: [newWork, ...state.works] }));
      },
      
      // 动态列表
      posts: mockPosts,
      addPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: `post-${Date.now()}`,
          createdAt: '刚刚',
          likes: 0,
          comments: 0,
          shares: 0,
        };
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },
      
      // 收藏列表
      likedItems: [],
      toggleLike: (itemId) => {
        set((state) => ({
          likedItems: state.likedItems.includes(itemId)
            ? state.likedItems.filter((id) => id !== itemId)
            : [...state.likedItems, itemId],
        }));
      },
      
      // 详情弹窗
      dialogItem: null,
      setDialogItem: (item) => set({ dialogItem: item }),
    }),
    {
      name: 'ink-realm-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        hasSeenSplash: state.hasSeenSplash,
        user: state.user,
        likedItems: state.likedItems,
      }),
    }
  )
);
