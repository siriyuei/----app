import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
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

interface ProfileRelation {
  username: string | null;
  avatar: string | null;
  is_verified: boolean | null;
}

type WorkWithProfile = Work & {
  profiles?: ProfileRelation | null;
};

type PostWithProfile = Post & {
  profiles?: ProfileRelation | null;
};

// 作品相关操作
export function useWorks(user: User | null, enabled = true) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(enabled && isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // 获取所有作品
  const fetchWorks = useCallback(async () => {
    if (!enabled || !isSupabaseConfigured) {
      setWorks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('works')
        .select(`
          *,
          profiles:user_id (username, avatar, is_verified)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 转换数据格式
      const formattedWorks = ((data || []) as WorkWithProfile[]).map((work) => ({
        ...work,
        author: {
          name: work.profiles?.username || '匿名用户',
          avatar: work.profiles?.avatar || '/images/avatar-1.jpg',
          isVerified: work.profiles?.is_verified || false,
        },
      }));

      setWorks(formattedWorks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取作品失败');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
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

      if (enabled) {
        await fetchWorks();
      }

      return { success: true, work: data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '创建作品失败',
      };
    }
  }, [enabled, user, fetchWorks]);

  // 删除作品
  const deleteWork = useCallback(async (workId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('works')
        .delete()
        .eq('id', workId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      if (enabled) {
        await fetchWorks();
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '删除作品失败',
      };
    }
  }, [enabled, user, fetchWorks]);

  // 点赞作品
  const likeWork = useCallback(async (workId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
    }

    try {
      // 检查是否已点赞
      const { data: existingLike, error: likeError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('work_id', workId)
        .maybeSingle();

      if (likeError) throw likeError;

      if (existingLike) {
        // 取消点赞
        const { error: deleteLikeError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteLikeError) throw deleteLikeError;

        // 减少点赞数
        const { error: decrementError } = await supabase.rpc('decrement_work_likes', { work_row_id: workId });
        if (decrementError) throw decrementError;
      } else {
        // 添加点赞
        const { error: insertLikeError } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, work_id: workId }]);

        if (insertLikeError) throw insertLikeError;

        // 增加点赞数
        const { error: incrementError } = await supabase.rpc('increment_work_likes', { work_row_id: workId });
        if (incrementError) throw incrementError;
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
    if (!enabled || !isSupabaseConfigured) return;

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
  }, [enabled, fetchWorks]);

  // 初始加载
  useEffect(() => {
    fetchWorks();
  }, [enabled, fetchWorks]);

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
export function usePosts(user: User | null, enabled = true) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(enabled && isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // 获取所有动态
  const fetchPosts = useCallback(async () => {
    if (!enabled || !isSupabaseConfigured) {
      setPosts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar, is_verified)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 转换数据格式
      const formattedPosts = ((data || []) as PostWithProfile[]).map((post) => ({
        ...post,
        author: {
          name: post.profiles?.username || '匿名用户',
          avatar: post.profiles?.avatar || '/images/avatar-1.jpg',
          isVerified: post.profiles?.is_verified || false,
        },
      }));

      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取动态失败');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

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

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
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

      if (enabled) {
        await fetchPosts();
      }

      return { success: true, post: data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '创建动态失败',
      };
    }
  }, [enabled, user, fetchPosts]);

  // 删除动态
  const deletePost = useCallback(async (postId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      if (enabled) {
        await fetchPosts();
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '删除动态失败',
      };
    }
  }, [enabled, user, fetchPosts]);

  // 点赞动态
  const likePost = useCallback(async (postId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    if (!isSupabaseConfigured) {
      return { success: false, error: '请先配置 Supabase 环境变量' };
    }

    try {
      const { data: existingLike, error: likeError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (likeError) throw likeError;

      if (existingLike) {
        const { error: deleteLikeError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteLikeError) throw deleteLikeError;

        const { error: decrementError } = await supabase.rpc('decrement_post_likes', { post_row_id: postId });
        if (decrementError) throw decrementError;
      } else {
        const { error: insertLikeError } = await supabase
          .from('likes')
          .insert([{ user_id: user.id, post_id: postId }]);

        if (insertLikeError) throw insertLikeError;

        const { error: incrementError } = await supabase.rpc('increment_post_likes', { post_row_id: postId });
        if (incrementError) throw incrementError;
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
    if (!enabled || !isSupabaseConfigured) return;

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
  }, [enabled, fetchPosts]);

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
