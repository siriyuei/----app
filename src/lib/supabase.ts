import { createClient } from '@supabase/supabase-js';

// Supabase 项目配置
const supabaseUrl = 'https://clidbnhukpyiakcatpov.supabase.co';
const supabaseAnonKey = 'sb_publishable_zROKxzT4ON7-6Ldl_R15iA_JmcYiTkm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 辅助函数：获取当前用户
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 辅助函数：检查是否已登录
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
