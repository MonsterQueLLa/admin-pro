# Admin Pro Server

Admin Pro 后台管理系统服务端 - Node.js + Express + MongoDB

## 技术栈

- **框架**: Express 4.x
- **数据库**: MongoDB + Mongoose
- **认证**: JWT
- **加密**: bcryptjs
- **文件上传**: Multer + Sharp

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置 MongoDB 连接地址
```

### 3. 初始化数据库

```bash
npm run seed
```

### 4. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将运行在 http://localhost:3001

## 默认账号

- 用户名: `admin`
- 密码: `123456`

## API 文档

### 认证接口

- `POST /api/v1/auth/login` - 登录
- `GET /api/v1/auth/info` - 获取当前用户信息
- `POST /api/v1/auth/logout` - 登出

### 用户管理

- `GET /api/v1/users` - 获取用户列表
- `GET /api/v1/users/:id` - 获取用户详情
- `POST /api/v1/users` - 创建用户
- `PUT /api/v1/users/:id` - 更新用户
- `DELETE /api/v1/users/:id` - 删除用户
- `PUT /api/v1/users/:id/reset-password` - 重置密码

### 角色管理

- `GET /api/v1/roles` - 获取角色列表
- `GET /api/v1/roles/:id` - 获取角色详情
- `POST /api/v1/roles` - 创建角色
- `PUT /api/v1/roles/:id` - 更新角色
- `DELETE /api/v1/roles/:id` - 删除角色

### 菜单管理

- `GET /api/v1/menus/tree` - 获取菜单树
- `GET /api/v1/menus/user` - 获取当前用户菜单
- `POST /api/v1/menus` - 创建菜单
- `PUT /api/v1/menus/:id` - 更新菜单
- `DELETE /api/v1/menus/:id` - 删除菜单

### 图片管理

- `GET /api/v1/images` - 获取图片列表（支持 subjects, type, keyword 以及 date/device/location 过滤）。该接口也用于“图片预览”页面，预览端提供多种模式并支持缩放/拖动。
- `POST /api/v1/images/upload` - 上传图片（服务器会根据原始文件名生成标题，标题必须唯一，重复时会返回 400 错误；单文件最大 20MB）
- `GET /api/v1/images/:id` - 获取图片详情
- `PUT /api/v1/images/:id` - 更新图片信息
- `DELETE /api/v1/images/:id` - 删除图片
- `POST /api/v1/images/batch-delete` - 批量删除

## 项目结构

```
server/
├── config/           # 配置文件
├── src/
│   ├── routes/       # 路由
│   ├── controllers/  # 控制器
│   ├── models/       # 数据模型
│   ├── middleware/   # 中间件
│   └── utils/        # 工具函数
├── scripts/          # 脚本
├── uploads/          # 上传文件
└── package.json
```
