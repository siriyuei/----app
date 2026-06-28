import type { Post as DbPost, Work as DbWork } from '@/hooks/useDatabase';
import type { Post, Work } from '@/store/useStore';

function formatCreatedAt(value: string) {
  const created = new Date(value);

  if (Number.isNaN(created.getTime())) {
    return value;
  }

  const diffMs = Date.now() - created.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return '刚刚';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}分钟前`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}小时前`;
  if (diffMs < 2 * day) return '昨天';
  return `${Math.floor(diffMs / day)}天前`;
}

export function mapDbWorkToWork(work: DbWork): Work {
  return {
    id: work.id,
    title: work.title,
    content: work.content || '',
    image: work.image || '/images/work-painting-1.jpg',
    author: {
      id: work.user_id,
      name: work.author?.name || '匿名用户',
      avatar: work.author?.avatar || '/images/avatar-1.jpg',
      isVerified: work.author?.isVerified ?? false,
    },
    likes: work.likes,
    comments: work.comments,
    shares: work.shares,
    tags: work.tags || [],
    createdAt: formatCreatedAt(work.created_at),
  };
}

export function mapDbPostToPost(post: DbPost): Post {
  return {
    id: post.id,
    title: post.title || '',
    content: post.content,
    image: post.image || '/images/work-calligraphy-1.jpg',
    author: {
      id: post.user_id,
      name: post.author?.name || '匿名用户',
      avatar: post.author?.avatar || '/images/avatar-1.jpg',
      isVerified: post.author?.isVerified ?? false,
    },
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    tags: post.tags || [],
    createdAt: formatCreatedAt(post.created_at),
    type: ['calligraphy', 'painting', 'poetry'].includes(post.type)
      ? (post.type as Post['type'])
      : 'calligraphy',
  };
}
