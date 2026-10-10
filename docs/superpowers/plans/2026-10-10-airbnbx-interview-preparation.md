# AirbnbX 项目面试准备计划

**目标：** 从“基本忘记项目”恢复到能够独立画出架构、沿源码讲清核心链路、回答常见追问，并能现场定位简单问题。

**建议周期：** 3 周，15 次学习，每次 90–120 分钟。

**学习方法：** 每次只学习一条完整业务链路，依次完成“基础概念 → 项目源码 → 口头复述 → 追问题 → 小练习”。不以背诵 API 为目标。

**技术范围：** JavaScript、React、Next.js 14 App Router、React Router、React Query、React Hook Form、Supabase Auth、PostgreSQL、RLS、RPC、Vite、npm Workspaces。

---

## 每次学习的固定流程

1. 15 分钟：补齐这节需要的基础概念。
2. 30 分钟：顺着真实代码追踪调用链。
3. 20 分钟：不看代码画流程图或写调用顺序。
4. 20 分钟：回答 5 个递进式面试追问。
5. 15 分钟：完成一个小修改、调试或代码阅读练习。

每节结束应产出一张流程图、一段 2 分钟口述和一组问答笔记。

## 第一阶段：恢复前端基础（第 1–4 次）

### 第 1 次：项目全景与浏览器基础

- 理解浏览器、Node.js、客户端渲染、服务端渲染、HTTP 请求、Cookie 和 JWT 的职责。
- 理解 AirbnbX 为什么有两个前端，但只有一个后端。
- 阅读根目录 `package.json`、两个应用的 `package.json` 和 `README.md`。
- 能画出 `website → Supabase ← admin` 架构图。
- 能回答：“两个项目之间是怎么连通的？”“匿名 Key 为什么可以放在前端？”

### 第 2 次：React 数据流

- 复习组件、Props、State、事件、受控表单、Context、Effect 和自定义 Hook。
- 阅读员工端客房列表、预订列表和 Theme Context。
- 区分 UI 状态、表单状态和服务端状态。
- 能回答：“为什么不能把所有数据都放进 Context？”

### 第 3 次：React Router 与后台路由保护

- 复习 SPA 路由、嵌套路由、Navigate 和 Outlet。
- 追踪 `App.jsx → ProtectedRoute → useUser → getCurrentUser`。
- 理解“登录态保护”和“管理员角色保护”不是同一件事。
- 练习说明当前后台为什么仍需要数据库 RLS 兜底。

### 第 4 次：异步请求、React Query 与表单

- 复习 Promise、async/await、错误传播和请求生命周期。
- 理解 Query Key、缓存、失效、Mutation、预取、分页和筛选。
- 阅读 `useBookings`、`useDeleteBooking` 和一个 React Hook Form 表单。
- 能回答：“React Query 和 Redux/Context 的区别是什么？”

## 第二阶段：掌握 Next.js 顾客端（第 5–8 次）

### 第 5 次：App Router 和渲染模型

- 理解文件路由、Layout、Page、动态路由、Server Component 和 Client Component。
- 阅读 `app/layout.js`、`app/cabins/page.js`、`app/cabins/[cabinId]/page.js`。
- 区分 SSG、SSR、动态渲染和客户端渲染。
- 能解释生产构建输出中的 `○`、`●` 和 `ƒ`。

### 第 6 次：数据获取与缓存

- 阅读 `data-service.js` 中客房、设置、已预订日期的查询。
- 理解 Next.js 服务端数据获取、`revalidatePath` 和浏览器请求的区别。
- 理解为什么公开客房可以使用匿名客户端，而个人预订必须使用带 Cookie 的服务端客户端。
- 练习定位一次“无法加载客房列表”的完整排查路径。

### 第 7 次：Server Actions 与表单提交

- 理解 `<form action>`、`useFormState`、`useFormStatus` 和 Server Action。
- 追踪登录、更新资料、创建预订、修改预订和退出登录。
- 区分服务端 `redirect()` 与客户端 `window.location.replace()`。
- 能完整复述此前“登录成功但没有跳转”的原因和修复。

### 第 8 次：Next.js 登录和会话保护

- 追踪 `AuthForm → loginAction → Supabase Auth → Cookie → middleware → account layout → auth()`。
- 理解 Middleware 只刷新会话，Layout 负责授权的职责划分。
- 理解为什么本机需要 `NODE_USE_ENV_PROXY=1`，而部署环境通常不需要。
- 能回答：“为什么不能只读取 Cookie 就认为用户已经登录？”

## 第三阶段：掌握 Supabase 与数据库安全（第 9–11 次）

### 第 9 次：Supabase 基础与数据模型

- 理解 Supabase Auth、PostgreSQL、PostgREST、Storage 和 RPC 的关系。
- 梳理 `auth.users`、`guests`、`cabins`、`bookings`、`settings` 的关系。
- 理解 Auth User 与业务 Guest 为什么分表，以及 `guests.userId` 的作用。
- 能手画主要表关系图。

### 第 10 次：JWT、RLS 与角色权限

- 理解 anon、authenticated、service role、JWT claim 和 `auth.uid()`。
- 逐条阅读 `20260824_email_password_auth.sql`。
- 理解顾客只能访问自己的数据，管理员如何通过 `app_metadata.role` 获得权限。
- 能回答：“前端代码能被篡改，系统为什么仍然安全？”

### 第 11 次：安全预订 RPC

- 逐行阅读 `20260824_secure_booking_rpc.sql`。
- 理解为什么价格、容量、日期冲突必须由可信后端重新校验。
- 理解事务级 advisory lock 如何避免并发重复预订。
- 对比“浏览器直接 INSERT”和“调用安全 RPC”的差异。
- 能用 3 分钟讲出这是项目最有含金量的技术点。

## 第四阶段：业务链路串讲（第 12–13 次）

### 第 12 次：顾客完整业务链路

- 演练注册、登录、浏览客房、选择日期、创建预订、查看、修改、删除和退出。
- 每一步指出运行位置：浏览器、Next.js Node 服务、Middleware 或 Supabase。
- 为每一步说明身份数据从哪里来、最终操作哪张表或哪个 RPC。
- 整理顾客端 5 分钟项目演示话术。

### 第 13 次：员工完整业务链路

- 演练登录、经营看板、筛选分页、客房管理、入住和退房。
- 说明 React Query 如何同步变更后的缓存。
- 说明 Recharts 的数据如何从预订记录聚合而来。
- 整理后台 5 分钟项目演示话术。

## 第五阶段：面试表达与模拟（第 14–15 次）

### 第 14 次：简历逐句验收

- 对简历中的每个技术名词准备“是什么、为什么用、项目哪里用了、有什么不足”。
- 准备 30 秒、2 分钟和 5 分钟三个版本的项目介绍。
- 准备一个最难问题：登录跳转与本地代理故障。
- 准备一个安全优化：从直接写表升级到 RLS + RPC。
- 准备一个遗留问题：管理员前端角色判断或顾客更新预订权限收口。

### 第 15 次：模拟面试与查漏补缺

- 第一轮：项目介绍和架构追问。
- 第二轮：React、Next.js、Supabase 基础追问。
- 第三轮：沿源码追问登录和预订链路。
- 第四轮：故障场景和系统设计追问。
- 汇总答不出的题，只复习暴露出的薄弱点。

## 简历表述验收

### 目前可以保留

- npm Workspaces Monorepo。
- Next.js 顾客端与 React + Vite 员工后台。
- Supabase Auth、PostgreSQL、RLS、RPC。
- 会话校验、数据隔离和预订冲突检测。
- Server Actions、React Query、React Hook Form、筛选分页、缓存同步。
- Recharts 经营数据看板、主题切换、异常处理。

### 建议修改或补强

- 当前后台前端实现的是“登录态路由保护”，不是完整的“管理员角色路由保护”。在补上管理员判断前，简历建议写成“登录态路由保护”。
- “预订冲突检测”可以保留，因为数据库 RPC 中已经包含重叠日期检测和 advisory lock。
- 面试中不要把匿名 Key 描述成秘密；真正的安全边界是 RLS、JWT 和受限 RPC。

## 完成标准

准备完成后，应能在不看代码的情况下回答以下问题：

1. 为什么是两个前端共用一个 Supabase，而不是两个前端互相请求？
2. 顾客登录后 Session 保存在哪里，服务端如何识别用户？
3. Middleware、Layout 和 Server Action 分别负责什么？
4. 员工后台为什么使用 React Query？Mutation 后如何更新页面？
5. RLS 如何保证顾客只能看到自己的预订？
6. 管理员权限为什么放在 `app_metadata` 而不是普通用户 metadata？
7. 为什么预订创建要使用 RPC？如何避免重复预订和价格篡改？
8. 登录成功却不跳转的问题是怎么定位和修复的？
9. 当前项目还有哪些安全和工程化不足？
10. 如果重新做一次，你会怎样改进架构？

