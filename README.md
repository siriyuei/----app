# 云栖·墨境 App

一个基于 React + Vite + TypeScript 的移动端国风创作社区 App，已接入 Supabase 登录注册、作品/动态数据表和图片 Storage，并提供 Vercel 部署配置。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn 风格组件
- Zustand 状态管理
- Supabase Auth / Database / Storage
- Vercel 静态部署

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

在 `.env.local` 填入 Supabase 项目的公开配置：

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

## Supabase 初始化

1. 在 Supabase 创建一个新项目。
2. 打开 `SQL Editor`。
3. 复制 `supabase/schema.sql` 全部内容并执行。
4. 在 `Authentication > Providers` 确认 Email 登录已开启。
5. 如果需要本地调试时免邮箱确认，在 `Authentication > Sign In / Providers > Email` 关闭 Confirm email。

脚本会创建：

- `profiles` 用户资料表
- `works` 作品表
- `posts` 动态表
- `likes` 点赞表
- 点赞计数 RPC
- Row Level Security 策略
- `avatars`、`works`、`posts` Storage buckets

## 构建

```bash
npm run build
```

构建输出目录为 `dist`。

## GitHub + Vercel 部署

1. 把当前 `app` 目录推到 GitHub 仓库。
2. 在 Vercel 选择 `Add New Project`，导入该 GitHub 仓库。
3. Framework Preset 选择 `Vite`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 在 Vercel `Settings > Environment Variables` 添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy 后即可获得 Vercel 访问地址。

项目已包含 `vercel.json`，默认会按 `npm install`、`vite build`、`dist` 输出部署。
