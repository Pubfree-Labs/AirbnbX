# AirbnbX

AirbnbX 是一个双端酒店预订与运营平台，包含面向顾客的预订网站和面向员工的运营后台。两个应用独立运行和构建，通过同一套 Supabase 后端实现客房、顾客与预订数据联动。

## 核心功能

### 顾客预订端

- 浏览、筛选客房并查看客房详情
- 邮箱密码注册、登录与服务端会话保持
- 选择入住日期、查看已占用日期并创建预订
- 查看、编辑和删除本人预订
- 维护国籍、证件号码等个人资料

### 员工运营后台

- 客房新增、编辑、复制、删除及图片上传
- 预订筛选、排序、分页与详情查看
- 办理入住、退房及早餐加购
- 销售额、入住率、入住时长与今日动态看板
- 员工账号、酒店设置与深色模式

## 技术亮点

- 使用 npm Workspaces 组织轻量 Monorepo，双端可独立开发、构建和部署
- 顾客端采用 Next.js App Router、Server Components、Server Actions 与 Supabase SSR
- 员工端采用 React Query 管理服务端状态，支持缓存、筛选、排序和分页
- 使用 Supabase Auth、PostgreSQL RLS 与 RPC 实现认证、数据隔离和安全预订
- 使用 React Hook Form、复合组件模式和 Recharts 完成表单、通用 UI 与经营看板
- 对日期边界、Hydration 一致性、远程图片和外部接口异常进行了兜底处理

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 顾客端 | Next.js 14、React、Tailwind CSS、date-fns |
| 员工端 | React、Vite、Styled Components、React Query、React Hook Form、Recharts |
| 后端 | Supabase Auth、PostgreSQL、Storage、RLS、RPC |
| 工程化 | npm Workspaces、ESLint |

## 项目结构

```text
AirbnbX/
├── apps/
│   ├── admin/          # React + Vite 员工运营后台
│   └── website/        # Next.js 顾客预订网站
├── packages/
│   ├── config/         # 共享业务配置
│   └── types/          # 共享类型声明
├── supabase/
│   └── migrations/     # RLS、认证触发器与安全预订 RPC
├── package.json
└── README.md
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

分别复制两个应用的环境变量模板：

```text
apps/admin/.env.example   → apps/admin/.env.local
apps/website/.env.example → apps/website/.env.local
```

员工端：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

顾客端：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

两个应用必须连接同一个 Supabase 项目。请勿将 `.env.local` 或 `service_role` 密钥提交到仓库。

### 3. 初始化 Supabase

在 Supabase SQL Editor 中按顺序执行：

```text
supabase/migrations/20260824_email_password_auth.sql
supabase/migrations/20260824_secure_booking_rpc.sql
```

`20260824_refresh_historical_booking_dates.sql` 仅用于刷新课程模拟数据的日期，可按需执行。

创建员工账号后，可在 SQL Editor 中将指定账号标记为管理员（请替换示例邮箱）：

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where lower(email) = lower('admin@example.com');
```

更新管理员角色后需要重新登录，使新的 JWT 权限生效。生产环境应通过受控的服务端管理流程分配管理员角色。

同时需要在 Supabase Storage 中创建项目所使用的客房图片和头像存储桶，并配置相应访问策略。

### 4. 启动应用

```bash
# 员工后台，默认 http://localhost:5173
npm run dev:admin

# 顾客网站，默认 http://localhost:3000
npm run dev:website
```

建议在两个终端中分别运行以上命令。

## 构建

```bash
# 构建全部应用
npm run build

# 分别构建
npm run build:admin
npm run build:website
```

## 权限模型

- 匿名用户只能读取公开的客房和酒店设置
- 顾客只能读取和操作自己的个人资料与预订
- 管理员可以管理全部客房、顾客、预订和酒店设置
- Publishable Key 可以用于浏览器端；`service_role` 密钥不得暴露在客户端

## 说明

本项目用于学习和展示 React、Next.js 与 Supabase 在双端业务场景中的协作方式，暂未集成真实支付、消息通知及生产级高并发库存锁定。
