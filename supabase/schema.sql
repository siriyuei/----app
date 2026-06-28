create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text not null default '墨友',
  avatar text not null default '/images/avatar-1.jpg',
  bio text not null default '一笔一世界，墨染千重山',
  followers integer not null default 0 check (followers >= 0),
  following integer not null default 0 check (following >= 0),
  works_count integer not null default 0 check (works_count >= 0),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text,
  image text,
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  shares integer not null default 0 check (shares >= 0),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  content text not null,
  image text,
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  shares integer not null default 0 check (shares >= 0),
  tags text[] not null default '{}',
  type text not null default 'post',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_id uuid references public.works(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_target_check check (
    (work_id is not null and post_id is null)
    or (work_id is null and post_id is not null)
  )
);

create unique index if not exists likes_user_work_unique
  on public.likes(user_id, work_id)
  where work_id is not null;

create unique index if not exists likes_user_post_unique
  on public.likes(user_id, post_id)
  where post_id is not null;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, avatar, bio)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), '墨友'),
    coalesce(new.raw_user_meta_data ->> 'avatar', '/images/avatar-1.jpg'),
    coalesce(new.raw_user_meta_data ->> 'bio', '一笔一世界，墨染千重山')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.bump_profile_works_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles
    set works_count = works_count + 1
    where id = new.user_id;
    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.profiles
    set works_count = greatest(works_count - 1, 0)
    where id = old.user_id;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists bump_profile_works_count_insert on public.works;
create trigger bump_profile_works_count_insert
after insert on public.works
for each row execute function public.bump_profile_works_count();

drop trigger if exists bump_profile_works_count_delete on public.works;
create trigger bump_profile_works_count_delete
after delete on public.works
for each row execute function public.bump_profile_works_count();

create or replace function public.increment_work_likes(work_row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.works
  set likes = likes + 1
  where id = work_row_id;
end;
$$;

create or replace function public.decrement_work_likes(work_row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.works
  set likes = greatest(likes - 1, 0)
  where id = work_row_id;
end;
$$;

create or replace function public.increment_post_likes(post_row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set likes = likes + 1
  where id = post_row_id;
end;
$$;

create or replace function public.decrement_post_likes(post_row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set likes = greatest(likes - 1, 0)
  where id = post_row_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.works enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;

drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read"
on public.profiles for select
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "works_read" on public.works;
create policy "works_read"
on public.works for select
using (true);

drop policy if exists "works_insert_own" on public.works;
create policy "works_insert_own"
on public.works for insert
with check (auth.uid() = user_id);

drop policy if exists "works_update_own" on public.works;
create policy "works_update_own"
on public.works for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "works_delete_own" on public.works;
create policy "works_delete_own"
on public.works for delete
using (auth.uid() = user_id);

drop policy if exists "posts_read" on public.posts;
create policy "posts_read"
on public.posts for select
using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts for insert
with check (auth.uid() = user_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts for delete
using (auth.uid() = user_id);

drop policy if exists "likes_read" on public.likes;
create policy "likes_read"
on public.likes for select
using (true);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own"
on public.likes for insert
with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own"
on public.likes for delete
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.works, public.posts, public.likes to anon, authenticated;
grant insert, update, delete on public.profiles, public.works, public.posts, public.likes to authenticated;
grant execute on function public.increment_work_likes(uuid) to authenticated;
grant execute on function public.decrement_work_likes(uuid) to authenticated;
grant execute on function public.increment_post_likes(uuid) to authenticated;
grant execute on function public.decrement_post_likes(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('works', 'works', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('posts', 'posts', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
on storage.objects for select
using (bucket_id in ('avatars', 'works', 'posts'));

drop policy if exists "storage_insert_own_folder" on storage.objects;
create policy "storage_insert_own_folder"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('avatars', 'works', 'posts')
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "storage_update_own_folder" on storage.objects;
create policy "storage_update_own_folder"
on storage.objects for update to authenticated
using (
  bucket_id in ('avatars', 'works', 'posts')
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id in ('avatars', 'works', 'posts')
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "storage_delete_own_folder" on storage.objects;
create policy "storage_delete_own_folder"
on storage.objects for delete to authenticated
using (
  bucket_id in ('avatars', 'works', 'posts')
  and auth.uid()::text = (storage.foldername(name))[1]
);

alter table public.works replica identity full;
alter table public.posts replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.works;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null;
end $$;
