import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

async function upsertProfile(user: User, updates: { username?: string; avatar?: string; bio?: string } = {}) {
  if (!isSupabaseConfigured) return;

  const metadata = user.user_metadata ?? {};

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email,
        username: updates.username || metadata.username || metadata.name || user.email?.split('@')[0] || '墨友',
        avatar: updates.avatar || metadata.avatar || '/images/avatar-1.jpg',
        bio: updates.bio || metadata.bio || '一笔一世界，墨染千重山',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.warn('同步用户资料失败:', error.message);
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: isSupabaseConfigured,
    error: null,
  });

  // 监听认证状态变化
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });
    });

    // 监听认证事件
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 邮箱注册
  const signUpWithEmail = useCallback(async (email: string, password: string, username?: string) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
        },
      },
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    if (data.user) {
      await upsertProfile(data.user, {
        username: username || email.split('@')[0],
      });
    }

    setState({
      user: data.user,
      session: data.session,
      loading: false,
      error: null,
    });

    return { success: true, user: data.user };
  }, []);

  // 邮箱登录
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    if (data.user) {
      await upsertProfile(data.user);
    }

    setState({
      user: data.user,
      session: data.session,
      loading: false,
      error: null,
    });

    return { success: true, user: data.user };
  }, []);

  // 登出
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
      return { success: true };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    });

    return { success: true };
  }, []);

  // 重置密码
  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    setState((prev) => ({ ...prev, loading: false, error: null }));
    return { success: true };
  }, []);

  // 更新用户信息
  const updateUser = useCallback(async (updates: { username?: string; avatar?: string; bio?: string }) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    if (data.user) {
      await upsertProfile(data.user, updates);
    }

    setState((prev) => ({
      ...prev,
      user: data.user,
      loading: false,
      error: null,
    }));

    return { success: true, user: data.user };
  }, []);

  // 更新用户资料（昵称和签名）
  const updateUserProfile = useCallback(async (name: string, bio: string) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.updateUser({
      data: { username: name, bio },
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    if (data.user) {
      await upsertProfile(data.user, { username: name, bio });
    }

    setState((prev) => ({
      ...prev,
      user: data.user,
      loading: false,
      error: null,
    }));

    return { success: true };
  }, []);

  // 更新密码
  const updatePassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      const message = '请先配置 Supabase 环境变量';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { success: false, error: message };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    setState((prev) => ({ ...prev, loading: false, error: null }));
    return { success: true };
  }, []);

  return {
    ...state,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    resetPassword,
    updateUser,
    updateUserProfile,
    updatePassword,
    isAuthenticated: !!state.user,
  };
}
