import { createClient } from '@supabase/supabase-js';

// Supabase 项目配置
const fallbackSupabaseUrl = 'https://placeholder.supabase.co';
const fallbackSupabaseAnonKey = 'placeholder-anon-key';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey;
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 辅助函数：获取当前用户
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 辅助函数：检查是否已登录
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
