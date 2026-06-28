import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User as AppUser } from '@/store/useStore';

export interface ProfileRow {
  id: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  followers: number | null;
  following: number | null;
  works_count: number | null;
  is_verified: boolean | null;
}

export function authUserToAppUser(user: SupabaseUser, profile?: Partial<ProfileRow> | null): AppUser {
  const metadata = user.user_metadata ?? {};
  const fallbackName = user.email?.split('@')[0] || '墨友';

  return {
    id: user.id,
    name: profile?.username || metadata.username || metadata.name || fallbackName,
    avatar: profile?.avatar || metadata.avatar || '/images/avatar-1.jpg',
    bio: profile?.bio || metadata.bio || '一笔一世界，墨染千重山',
    email: user.email || '',
    followers: profile?.followers ?? 0,
    following: profile?.following ?? 0,
    works: profile?.works_count ?? 0,
    isVerified: profile?.is_verified ?? false,
  };
}
