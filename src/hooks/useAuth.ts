import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

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
    loading: true,
    error: null,
  });

  // 监听认证状态变化
  useEffect(() => {
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
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
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
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    // 更新 auth 用户元数据
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    // 同时更新 profiles 表
    if (data.user) {
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', data.user.id);
    }

    setState((prev) => ({
      ...prev,
      user: data.user,
      loading: false,
      error: null,
    }));

    return { success: true, user: data.user };
  }, []);

  return {
    ...state,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    resetPassword,
    updateUser,
    isAuthenticated: !!state.user,
  };
}