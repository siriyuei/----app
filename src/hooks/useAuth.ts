import { useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { ensureUserProfile } from '@/lib/authUser';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await ensureUserProfile(session.user);
      }

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
        if (session?.user) {
          void ensureUserProfile(session.user);
        }

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
      await ensureUserProfile(data.user, {
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
      await ensureUserProfile(data.user);
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
      await ensureUserProfile(data.user, updates);
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
      await ensureUserProfile(data.user, { username: name, bio });
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
