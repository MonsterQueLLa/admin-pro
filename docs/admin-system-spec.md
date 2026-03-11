# 通用后台管理系统 - 项目方案文档

## 📋 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | Admin Pro - 通用后台管理系统 |
| 版本 | v1.0.0 |
| 创建日期 | 2026-03-09 |
| 作者 | 诸葛亮 (Wise) |
| 项目路径 | F:\Projects\admin-system |

---

## 一、项目概述

### 1.1 项目定位
企业级通用后台管理系统，采用模块化架构设计，支持功能无限扩展。图片管理作为首个业务模块，后续可快速接入新功能。

### 1.2 核心特性
- 🔐 **RBAC 权限模型** - 角色-权限-用户三级管控
- 📐 **模块化架构** - 菜单、路由、权限动态配置
- 🎨 **统一设计规范** - Element Plus + 自定义主题
- 📱 **响应式布局** - 适配桌面、平板、手机
- ⚡ **高性能** - 路由懒加载、组件按需引入

### 1.3 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | Vue | 3.4+ | 渐进式框架 |
| 构建工具 | Vite | 5.0+ | 极速构建 |
| 状态管理 | Pinia | 2.1+ | 全局状态 |
| UI 组件库 | Element Plus | 2.5+ | 企业级组件 |
| 路由 | Vue Router | 4.2+ | 前端路由 |
| 权限控制 | CASL | 6.0+ | 权限能力库 |
| 后端框架 | Node.js + Express | 20.x + 4.x | REST API |
| 数据库 | MongoDB | 7.0+ | 文档存储 |
| ODM | Mongoose | 8.0+ | 数据建模 |
| 认证 | JWT | 9.0+ | Token 认证 |
| 加密 | bcrypt | 5.0+ | 密码加密 |

---

## 二、系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端层 (Vue 3)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Layout    │ │  Components │ │   Views     │               │
│  │  布局框架    │ │   业务组件   │ │   页面视图   │               │
│  │             │ │             │ │             │               │
│  │ • Sidebar   │ │ • DataTable │ │ • Dashboard │               │
│  │ • Header    │ │ • FormModal │ │ • UserMgr   │               │
│  │ • TagsView  │ │ • SearchBar │ │ • RoleMgr   │               │
│  │ • AppMain   │ │ • TreeMenu  │ │ • ImageMgr  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │    Pinia    │ │ Vue Router  │ │    Axios    │               │
│  │   状态管理   │ │   路由守卫   │ │   HTTP请求   │               │
│  │             │ │             │ │             │               │
│  │ • UserStore │ │ • 动态路由   │ │ • 拦截器     │               │
│  │ • AppStore  │ │ • 权限守卫   │ │ • 错误处理   │               │
│  │ • PermStore │ │ • 路由缓存   │ │ • Token刷新  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────┴────────────────────────────────────┐
│                      后端层 (Node.js)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   Routes    │ │ Controllers │ │  Services   │               │
│  │   路由层     │ │   控制层     │ │   业务层     │               │
│  │             │ │             │ │             │               │
│  │ • auth.js   │ │ • authCtrl  │ │ • authSvc   │               │
│  │ • user.js   │ │ • userCtrl  │ │ • userSvc   │               │
│  │ • role.js   │ │ • roleCtrl  │ │ • roleSvc   │               │
│  │ • menu.js   │ │ • menuCtrl  │ │ • menuSvc   │               │
│  │ • image.js  │ │ • imageCtrl │ │ • imageSvc  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ Middleware  │ │    Models   │ │    Utils    │               │
│  │   中间件     │ │   数据模型   │ │   工具库     │               │
│  │             │ │             │ │             │               │
│  │ • JWT验证   │ │ • User      │ │ • Response  │               │
│  │ • 权限校验   │ │ • Role      │ │ • Logger    │               │
│  │ • 参数校验   │ │ • Menu      │ │ • Encrypt   │               │
│  │ • 错误处理   │ │ • Image     │ │ • File      │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      数据层 (MongoDB)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │    users    │ │    roles    │ │    menus    │               │
│  │   用户集合   │ │   角色集合   │ │   菜单集合   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │   images    │ │   subjects  │ │    logs     │               │
│  │   图片集合   │ │   主角集合   │ │   日志集合   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 模块架构设计

系统采用**插件化模块架构**，每个业务模块独立开发、独立部署。

```
src/
├── modules/                     # 业务模块目录
│   ├── system/                  # 系统管理模块
│   │   ├── api/                 # 接口
│   │   ├── components/          # 组件
│   │   ├── views/               # 页面
│   │   └── router.js            # 模块路由
│   │
│   ├── image-manager/           # 图片管理模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── views/
│   │   └── router.js
│   │
│   └── [future-modules]/        # 未来扩展模块
│       ├── order-manager/       # 订单管理
│       ├── product-manager/     # 商品管理
│       └── ...
│
├── core/                        # 核心框架
│   ├── layout/                  # 布局组件
│   ├── router/                  # 路由配置
│   ├── store/                   # 全局状态
│   ├── permission/              # 权限控制
│   └── utils/                   # 工具函数
│
└── shared/                      # 共享资源
    ├── components/              # 公共组件
    ├── directives/              # 自定义指令
    └── styles/                  # 全局样式
```

---

## 三、权限系统设计 (RBAC)

### 3.1 RBAC 模型

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│  Role   │────▶│ Permission│────▶│ Resource│
│  用户   │ N:M │  角色   │ N:M │  权限    │ N:M │  资源   │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                               │
     │         ┌─────────┐           │
     └────────▶│  Menu   │◀──────────┘
               │  菜单   │
               └─────────┘
```

### 3.2 权限粒度

| 粒度级别 | 说明 | 示例 |
|---------|------|------|
| 菜单权限 | 控制侧边栏菜单显示 | 图片管理菜单可见/隐藏 |
| 按钮权限 | 控制页面按钮操作 | 新增/编辑/删除按钮 |
| 数据权限 | 控制数据范围 | 仅看自己创建的数据 |
| 接口权限 | 控制 API 访问 | 是否有权限调用删除接口 |

### 3.3 权限标识规范

```javascript
// 权限标识格式: 模块:操作:对象
const permissions = {
  // 系统管理
  'system:user:view': '查看用户',
  'system:user:create': '新增用户',
  'system:user:update': '编辑用户',
  'system:user:delete': '删除用户',
  
  // 角色管理
  'system:role:view': '查看角色',
  'system:role:create': '新增角色',
  'system:role:update': '编辑角色',
  'system:role:delete': '删除角色',
  
  // 图片管理
  'image:view': '查看图片',
  'image:upload': '上传图片',
  'image:update': '编辑图片信息',
  'image:delete': '删除图片',
  'image:download': '下载图片',
}
```

---

## 四、数据库设计

### 4.1 用户集合 (users)

```javascript
{
  _id: ObjectId,
  username: String,           // 用户名（唯一）
  password: String,           // 加密密码
  nickname: String,           // 昵称
  avatar: String,             // 头像URL
  email: String,              // 邮箱
  phone: String,              // 手机号
  
  // 角色关联
  roleIds: [ObjectId],        // 角色ID数组
  
  // 状态
  status: Number,             // 0禁用 1启用
  isAdmin: Boolean,           // 是否超级管理员
  
  // 登录信息
  lastLoginAt: Date,
  lastLoginIp: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 角色集合 (roles)

```javascript
{
  _id: ObjectId,
  name: String,               // 角色名称
  code: String,               // 角色编码（唯一）
  description: String,        // 角色描述
  
  // 权限
  permissions: [String],      // 权限标识数组
  menuIds: [ObjectId],        // 可访问菜单ID
  
  // 数据权限范围
  dataScope: String,          // all/dept/self/custom
  
  status: Number,
  sort: Number,               // 排序
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 菜单集合 (menus)

```javascript
{
  _id: ObjectId,
  parentId: ObjectId,         // 父菜单ID（null为顶级）
  name: String,               // 菜单名称
  path: String,               // 路由路径
  component: String,          // 组件路径
  icon: String,               // 图标类名
  
  // 菜单类型
  type: String,               // directory/menu/button
  
  // 权限标识
  permission: String,         // 按钮权限标识
  
  // 显示控制
  hidden: Boolean,            // 是否隐藏
  keepAlive: Boolean,         // 是否缓存
  
  status: Number,
  sort: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 图片集合 (images)

```javascript
{
  _id: ObjectId,
  title: String,              // 图片标题
  description: String,        // 描述
  
  // 存储路径
  originalPath: String,       // 原图绝对路径
  thumbnailPath: String,      // 缩略图路径
  
  // 业务信息
  subjects: [String],         // 主角
  type: String,               // 类型
  date: Date,                 // 拍摄日期
  device: String,             // 设备
  location: String,           // 地点
  
  // 文件信息
  size: Number,
  width: Number,
  height: Number,
  format: String,
  
  // 创建者（数据权限）
  creatorId: ObjectId,
  creatorName: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 操作日志 (logs)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // 操作用户
  username: String,
  
  // 操作信息
  module: String,             // 操作模块
  action: String,             // 操作类型
  description: String,        // 操作描述
  
  // 请求信息
  method: String,             // HTTP方法
  url: String,                // 请求URL
  params: Object,             // 请求参数
  
  // 响应信息
  status: Number,             // 响应状态
  result: String,             // 响应结果
  
  // 客户端信息
  ip: String,
  userAgent: String,
  
  createdAt: Date
}
```

---

## 五、界面设计

### 5.1 整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  🌐 Admin Pro                              [🔔] [👤] 管理员 ▼ │  ← Header
├──────────┬──────────────────────────────────────────────────┤
│          │  📍 首页 / 图片管理 / 图片列表                      │  ← Breadcrumb
│          │  📍 首页 / 图片管理 / 图片预览                      │  ← Breadcrumb
│  🏠 首页   ├──────────────────────────────────────────────────┤
│          │                                                  │
│  📊 数据   │  ┌──────────────────────────────────────────┐  │
│  📁 图片   │  │  🔍 搜索...  [主角 ▼] [类型 ▼] [📅] [🔍] │  │  ← SearchBar
│  👥 用户   │  └──────────────────────────────────────────┘  │
│  🛡️ 角色   │                                                  │
│  📋 菜单   │  [+ 新增]  [📤 批量上传]  [🗑️ 批量删除]          │  ← ActionBar
│  📝 日志   │                                                  │
│          │  ┌──────────────────────────────────────────┐  │
│  ⚙️ 设置   │  │ ☑️ │ 缩略图 │ 标题    │ 主角   │ 日期   │ 操作 │  │  ← DataTable
│  │        │  ├───┼─────────┼─────────┼────────┼────────┼─────┤  │
│  ▼        │  │ ☐ │ [img]  │ 风景照  │ 张三   │ 2024   │ ✏️ 🗑️│  │
│           │  │ ☑️ │ [img]  │ 人像照  │ 李四   │ 2024   │ ✏️ 🗑️│  │
│           │  │ ☐ │ [img]  │ 美食    │ -      │ 2024   │ ✏️ 🗑️│  │
│           │  └──────────────────────────────────────────┘  │
│           │                                                  │
│           │  < 1 2 3 4 5 ... 10 >    共 100 条              │  ← Pagination
│           │                                                  │
└───────────┴──────────────────────────────────────────────────┘
     ↑
   Sidebar (可折叠)
```

### 5.2 登录页

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    ┌─────────────────────┐                  │
│                    │                     │                  │
│                    │     🌐 Admin Pro    │                  │
│                    │                     │                  │
│                    │  用户名             │                  │
│                    │  ┌───────────────┐  │                  │
│                    │  │               │  │                  │
│                    │  └───────────────┘  │                  │
│                    │                     │                  │
│                    │  密码               │                  │
│                    │  ┌───────────────┐  │                  │
│                    │  │           [👁️]│  │                  │
│                    │  └───────────────┘  │                  │
│                    │                     │                  │
│                    │  ☑️ 记住我          │                  │
│                    │                     │                  │
│                    │  ┌───────────────┐  │                  │
│                    │  │    登 录      │  │                  │
│                    │  └───────────────┘  │                  │
│                    │                     │                  │
│                    └─────────────────────┘                  │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 用户管理页

```
┌─────────────────────────────────────────────────────────────┐
│  ...                                                        │
├──────────┬──────────────────────────────────────────────────┤
│          │  📍 系统管理 / 用户管理                            │
│          ├──────────────────────────────────────────────────┤
│          │                                                  │
│          │  ┌──────────────────────────────────────────┐   │
│          │  │ 🔍 用户名/昵称/手机号    [🔍] [重置]     │   │
│          │  └──────────────────────────────────────────┘   │
│          │                                                  │
│          │  [+ 新增用户]  [📤 导入]  [📥 导出]              │
│          │                                                  │
│          │  ┌──────────────────────────────────────────┐   │
│          │  │ ☑️ │ 头像 │ 用户名 │ 昵称 │ 角色 │ 状态 │ 操作│   │
│          │  ├───┼──────┼────────┼──────┼──────┼──────┼─────┤   │
│          │  │ ☐ │ [👤] │ admin  │ 管理员│超管  │ 🟢  │ ✏️ 🗑️│   │
│          │  │ ☐ │ [👤] │ zhang  │ 张三 │编辑  │ 🟢  │ ✏️ 🗑️│   │
│          │  │ ☐ │ [👤] │ li     │ 李四 │访客  │ 🔴  │ ✏️ 🗑️│   │
│          │  └──────────────────────────────────────────┘   │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### 5.4 角色权限配置页

```
┌─────────────────────────────────────────────────────────────┐
│  ...                                                        │
├──────────┬──────────────────────────────────────────────────┤
│          │  📍 系统管理 / 角色管理 / 编辑角色                 │
│          ├──────────────────────────────────────────────────┤
│          │                                                  │
│          │  基本信息                                        │
│          │  角色名称: [编辑者          ]                    │
│          │  角色编码: [editor          ]                    │
│          │  描述:     [普通编辑人员... ]                    │
│          │                                                  │
│          │  ─────────────────────────────────────────────  │
│          │                                                  │
│          │  菜单权限                                        │
│          │  ☑️ 🏠 首页                                       │
│          │  ☑️ 📁 图片管理                                   │
│          │     ☑️ 图片列表 (view)                            │
│          │     ☑️ 上传图片 (upload)                          │
│          │     ☑️ 编辑信息 (update)                          │
│          │     ☐  删除图片 (delete)                          │
│          │  ☐ 👥 用户管理                                    │
│          │  ☐ 🛡️ 角色管理                                    │
│          │                                                  │
│          │  ─────────────────────────────────────────────  │
│          │                                                  │
│          │  数据权限                                        │
│          │  ○ 全部数据                                       │
│          │  ○ 本部门数据                                     │
│          │  ● 仅本人数据                                     │
│          │                                                  │
│          │              [取消]  [保存]                       │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 六、API 接口设计

### 6.1 认证接口

```http
### 用户登录
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}

Response:
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "user": {
      "id": "xxx",
      "username": "admin",
      "nickname": "管理员",
      "avatar": "...",
      "roles": ["super-admin"],
      "permissions": ["*"]
    }
  }
}

### 刷新 Token
POST /api/v1/auth/refresh
Authorization: Bearer {refreshToken}

### 退出登录
POST /api/v1/auth/logout
Authorization: Bearer {token}

### 获取当前用户信息
GET /api/v1/auth/info
Authorization: Bearer {token}
```

### 6.2 用户管理接口

```http
### 获取用户列表
GET /api/v1/users?page=1&pageSize=20&keyword=xxx
Authorization: Bearer {token}

### 获取用户详情
GET /api/v1/users/:id
Authorization: Bearer {token}

### 新增用户
POST /api/v1/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "123456",
  "nickname": "张三",
  "roleIds": ["xxx", "yyy"],
  "status": 1
}

### 编辑用户
PUT /api/v1/users/:id
Authorization: Bearer {token}

### 删除用户
DELETE /api/v1/users/:id
Authorization: Bearer {token}

### 重置密码
PUT /api/v1/users/:id/reset-password
Authorization: Bearer {token}
```

### 6.3 角色管理接口

```http
### 获取角色列表
GET /api/v1/roles
Authorization: Bearer {token}

### 获取角色详情（含权限）
GET /api/v1/roles/:id
Authorization: Bearer {token}

### 新增角色
POST /api/v1/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "编辑者",
  "code": "editor",
  "permissions": ["image:view", "image:upload", "image:update"],
  "menuIds": ["xxx", "yyy"],
  "dataScope": "self"
}

### 编辑角色
PUT /api/v1/roles/:id
Authorization: Bearer {token}

### 删除角色
DELETE /api/v1/roles/:id
Authorization: Bearer {token}
```

### 6.4 菜单管理接口

```http
### 获取菜单树
GET /api/v1/menus/tree
Authorization: Bearer {token}

### 获取当前用户菜单
GET /api/v1/menus/user
Authorization: Bearer {token}

### 新增菜单
POST /api/v1/menus
Authorization: Bearer {token}

### 编辑菜单
PUT /api/v1/menus/:id
Authorization: Bearer {token}

### 删除菜单
DELETE /api/v1/menus/:id
Authorization: Bearer {token}
```

### 6.5 图片管理接口（业务模块示例）

```http
### 获取图片列表
GET /api/v1/images?page=1&pageSize=20&subjects=张三&type=风景

可额外使用以下参数进行筛选：
- `date=YYYY-MM-DD` 根据拍摄日期
- `device` 设备名模糊匹配
- `location` 地点模糊匹配

图片预览页面支持三种展示模式：网格、瀑布流和 3D 轮播；轮播具备类似封面流的立体效果，点击可切换，支持缩放和拖动查看大图。
Authorization: Bearer {token}

### 上传图片
POST /api/v1/images/upload

> 上传时根据文件名生成图片标题，系统中不允许存在重复标题，相同标题会被拒绝。
Authorization: Bearer {token}
Content-Type: multipart/form-data

### 获取图片详情
GET /api/v1/images/:id
Authorization: Bearer {token}

### 编辑图片信息
PUT /api/v1/images/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "新标题",
  "subjects": ["张三", "李四"],
  "type": "风景",
  "date": "2024-01-01",
  "device": "iPhone 15",
  "location": "北京"
}

### 删除图片
DELETE /api/v1/images/:id
Authorization: Bearer {token}

### 批量删除
DELETE /api/v1/images/batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": ["xxx", "yyy", "zzz"]
}
```

---

## 七、开发规范

### 7.1 项目结构

```
admin-system/
├── docs/                        # 文档
│   ├── assets/                  # 文档图片
│   └── admin-system-spec.md     # 本文件
│
├── design/                      # 设计稿
│   └── *.fig / *.sketch
│
├── src/                         # 源代码
│   ├── client/                  # 前端
│   │   ├── src/
│   │   │   ├── modules/         # 业务模块
│   │   │   ├── core/            # 核心框架
│   │   │   └── shared/          # 共享资源
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                  # 后端
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── models/
│       │   ├── middleware/
│       │   └── utils/
│       ├── config/
│       ├── app.js
│       └── package.json
│
├── docker-compose.yml
└── README.md
```

### 7.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 数据库 | snake_case | `user_name`, `created_at` |
| JavaScript | camelCase | `userName`, `createdAt` |
| Vue 组件 | PascalCase | `UserManager.vue` |
| CSS 类名 | kebab-case | `user-manager`, `is-active` |
| 常量 | UPPER_SNAKE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| 接口路径 | kebab-case | `/api/v1/user-manager` |

### 7.3 Git 提交规范

```
feat: 新增功能
fix: 修复问题
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

---

## 八、开发计划

| 阶段 | 任务 | 工期 | 产出 |
|------|------|------|------|
| **Phase 1** | 基础框架搭建 | 2 天 | 项目结构、数据库、登录功能 |
| **Phase 2** | 权限系统 | 2 天 | 用户/角色/菜单管理 |
| **Phase 3** | 核心组件 | 1 天 | 统一表格/表单/搜索组件 |
| **Phase 4** | 图片管理模块 | 2 天 | 上传/浏览/管理功能 |
| **Phase 5** | 优化完善 | 1 天 | 性能优化、Bug修复 |

**总计：8 天**

---

## 九、附录

### 9.1 环境要求

| 环境 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 18.0 | 运行环境 |
| MongoDB | >= 6.0 | 数据库 |
| Git | >= 2.30 | 版本控制 |

### 9.2 推荐开发工具

- **IDE**: VS Code + Volar + ESLint
- **API 测试**: Postman / Insomnia
- **数据库**: MongoDB Compass
- **设计**: Figma

---

**文档版本：** v1.0.0  
**最后更新：** 2026-03-09  
**作者：** 诸葛亮 (Wise)  
**项目路径：** F:\Projects\admin-system