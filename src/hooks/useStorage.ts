import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type BucketName = 'avatars' | 'works' | 'posts';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

export function useStorage(user: User | null) {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  // 上传文件到指定存储桶
  const uploadFile = useCallback(async (
    bucket: BucketName,
    file: File,
    path?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    setState({ uploading: true, progress: 0, error: null, url: null });

    try {
      // 生成文件路径
      const filePath = path || `${user.id}/${Date.now()}_${file.name}`;

      // 上传文件
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setState({
        uploading: false,
        progress: 100,
        error: null,
        url: publicUrl,
      });

      return { success: true, url: publicUrl };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '上传失败';
      setState({
        uploading: false,
        progress: 0,
        error: errorMsg,
        url: null,
      });
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // 上传头像
  const uploadAvatar = useCallback(async (file: File) => {
    return uploadFile('avatars', file);
  }, [uploadFile]);

  // 上传作品图片
  const uploadWorkImage = useCallback(async (file: File) => {
    return uploadFile('works', file);
  }, [uploadFile]);

  // 上传动态图片
  const uploadPostImage = useCallback(async (file: File) => {
    return uploadFile('posts', file);
  }, [uploadFile]);

  // 删除文件
  const deleteFile = useCallback(async (
    bucket: BucketName,
    path: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : '删除失败',
      };
    }
  }, [user]);

  // 压缩图片（可选）
  const compressImage = useCallback(async (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 计算压缩后的尺寸
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // 转换为 Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('压缩失败'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('图片加载失败'));
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
    });
  }, []);

  return {
    ...state,
    uploadFile,
    uploadAvatar,
    uploadWorkImage,
    uploadPostImage,
    deleteFile,
    compressImage,
  };
}