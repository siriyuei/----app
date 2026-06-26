import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// 作品类型定义
export interface Work {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
}

// 动态类型定义
export interface Post {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  tags: string[] | null;
  type: string;
  created_at: string;
  updated_at: string;
  author?: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
}

// 作品相关操作
export function useWorks(user: User | null) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有作品
  const fetchWorks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('works')
        .select(`
          *,
          profiles:user_id (username, avatar)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 转换数据格式
      const formattedWorks = (data || []).map((work: any) => ({
        ...work,
        author: {
          name: work.profiles?.username || '匿名用户',
          avatar: work.profiles?.avatar || '/images/avatar-1.jpg',
          isVerified: false,
        },
      }));

      setWorks(formattedWorks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取作品失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建新作品
  const createWork = useCallback(async (workData: {
    title: string;
    content?: string;
    image?: string;
    tags?: string[];
  }) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('works')
        .insert([
          {
            user_id: user.id,
            ...workData,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 刷新作品列表
      await fetchWorks();

      return { success: true, work: data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '创建作品失败',
      };
    }
  }, [user, fetchWorks]);

  // 删除作品
  const deleteWork = useCallback(async (workId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('works')
        .delete()
        .eq('id', workId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // 刷新作品列表
      await fetchWorks();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '删除作品失败',
      };
    }
  }, [user, fetchWorks]);

  // 点赞作品
  const likeWork = useCallback(async (workId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      // 检查是否已点赞
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('work_id', workId)
        .single();

      if (existingLike) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        // 减少点赞数
        await supabase.rpc('decrement_likes', { work_id: workId });
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert([{ user_id: user.id, work_id: workId }]);

        // 增加点赞数
        await supabase.rpc('increment_likes', { work_id: workId });
      }

      await fetchWorks();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '操作失败',
      };
    }
  }, [user, fetchWorks]);

  // 实时订阅新作品
  useEffect(() => {
    const channel = supabase
      .channel('works-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'works' },
        () => fetchWorks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWorks]);

  // 初始加载
  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  return {
    works,
    loading,
    error,
    createWork,
    deleteWork,
    likeWork,
    refetch: fetchWorks,
  };
}

// 动态相关操作
export function usePosts(user: User | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有动态
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 转换数据格式
      const formattedPosts = (data || []).map((post: any) => ({
        ...post,
        author: {
          name: post.profiles?.username || '匿名用户',
          avatar: post.profiles?.avatar || '/images/avatar-1.jpg',
          isVerified: false,
        },
      }));

      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取动态失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建新动态
  const createPost = useCallback(async (postData: {
    title?: string;
    content: string;
    image?: string;
    tags?: string[];
    type?: string;
  }) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            ...postData,
            type: postData.type || 'post',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchPosts();

      return { success: true, post: data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '创建动态失败',
      };
    }
  }, [user, fetchPosts]);

  // 删除动态
  const deletePost = useCallback(async (postId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchPosts();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '删除动态失败',
      };
    }
  }, [user, fetchPosts]);

  // 点赞动态
  const likePost = useCallback(async (postId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        await supabase
          .from('likes')
          .insert([{ user_id: user.id, post_id: postId }]);
      }

      await fetchPosts();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '操作失败',
      };
    }
  }, [user, fetchPosts]);

  // 实时订阅新动态
  useEffect(() => {
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  // 初始加载
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    likePost,
    refetch: fetchPosts,
  };
}