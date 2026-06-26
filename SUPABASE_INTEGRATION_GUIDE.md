/**
 * Supabase 集成说明
 * 
 * ✅ 已完成的配置：
 * - Supabase 客户端已安装并配置
 * - 认证 Hooks 已创建
 * - 数据库操作 Hooks 已创建
 * - 文件上传 Hooks 已创建
 * 
 * ============================================
 * 您需要完成以下步骤来启用 Supabase：
 * ============================================
 * 
 * 第一步：运行数据库初始化脚本 ✅
 * ============================================
 * 
 * 1. 登录 Supabase Dashboard: https://supabase.com
 * 2. 打开您的项目
 * 3. 点击左侧菜单 "SQL Editor"
 * 4. 点击 "New query"
 * 5. 复制并粘贴 `database-setup.sql` 文件的内容
 * 6. 点击 "Run" 执行 SQL
 * 
 * 这将创建以下表：
 * - profiles: 用户资料表
 * - works: 作品表（墨池页面）
 * - posts: 动态表（雅集广场）
 * - comments: 评论表
 * - likes: 点赞/收藏表
 * 
 * ============================================
 * 第二步：创建存储桶
 * ============================================
 * 
 * 1. 在 Supabase Dashboard 点击左侧菜单 "Storage"
 * 2. 点击 "New bucket"
 * 3. 创建以下三个存储桶：
 * 
 *    存储桶名称：avatars
 *    - 勾选 "Public bucket"
 *    - 用途：存储用户头像
 * 
 *    存储桶名称：works
 *    - 勾选 "Public bucket"
 *    - 用途：存储作品图片
 * 
 *    存储桶名称：posts
 *    - 勾选 "Public bucket"
 *    - 用途：存储动态图片
 * 
 * 4. 为每个存储桶设置策略：
 *    - 点击存储桶名称 → Policies
 *    - 点击 "New Policy"
 *    - 选择 "For full customization"
 *    - 添加以下策略：
 * 
 *    读取策略（所有存储桶）：
 *    - Allowed operations: SELECT
 *    - Target role: authenticated, anon
 *    - Using expression: true
 * 
 *    上传策略（所有存储桶）：
 *    - Allowed operations: INSERT
 *    - Target role: authenticated
 *    - Using expression: (bucket_id = 'avatars'::text) OR 
 *                       auth.uid()::text = (storage.foldername)[1]
 * 
 * ============================================
 * 第三步：配置身份验证
 * ============================================
 * 
 * 1. 在 Supabase Dashboard 点击左侧菜单 "Authentication"
 * 2. 点击 "Providers"
 * 3. 启用 Email provider
 *    - 勾选 "Enable Email provider"
 *    - 勾选 "Confirm email"（可选）
 * 
 * 4. 配置 URL settings：
 *    - Site URL: http://localhost:5173
 *    - Redirect URLs:
 *      - http://localhost:5173/**
 *      - http://localhost:5173/auth/callback
 * 
 * ============================================
 * 使用示例
 * ============================================
 * 
 * // 在组件中使用认证
 * import { useAuth } from '@/hooks';
 * 
 * function MyComponent() {
 *   const { user, signInWithEmail, signOut } = useAuth();
 * 
 *   const handleLogin = async () => {
 *     await signInWithEmail('email@example.com', 'password');
 *   };
 * 
 *   return (
 *     <div>
 *       {user ? (
 *         <button onClick={signOut}>登出</button>
 *       ) : (
 *         <button onClick={handleLogin}>登录</button>
 *       )}
 *     </div>
 *   );
 * }
 * 
 * // 使用数据库操作
 * import { useWorks, usePosts } from '@/hooks';
 * 
 * function InkPoolPage() {
 *   const { works, createWork, deleteWork, likeWork } = useWorks(user);
 * 
 *   const handleCreate = async () => {
 *     await createWork({
 *       title: '我的作品',
 *       content: '作品描述',
 *       image: 'https://...',
 *       tags: ['书法', '临摹'],
 *     });
 *   };
 * 
 *   return (
 *     <div>
 *       {works.map(work => (
 *         <div key={work.id}>
 *           <h3>{work.title}</h3>
 *           <button onClick={() => likeWork(work.id)}>点赞</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * // 使用文件上传
 * import { useStorage } from '@/hooks';
 * 
 * function UploadComponent() {
 *   const { uploadWorkImage, uploading, url } = useStorage(user);
 * 
 *   const handleUpload = async (file: File) => {
 *     const result = await uploadWorkImage(file);
 *     if (result.success) {
 *       console.log('上传成功:', result.url);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
 *       {uploading && <p>上传中...</p>}
 *       {url && <img src={url} />}
 *     </div>
 *   );
 * }
 * 
 * ============================================
 * 完成状态
 * ============================================
 * 
 * ✅ Supabase 客户端已配置
 * ✅ 认证系统已创建
 * ✅ 数据库 Hooks 已创建
 * ✅ 文件上传已创建
 * ⏳ 数据库表待创建（请运行 SQL）
 * ⏳ 存储桶待创建（请在 Dashboard 创建）
 * ⏳ 身份验证待配置（请在 Dashboard 配置）
 */
