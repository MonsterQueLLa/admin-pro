# Admin Pro

Admin Pro 后台管理系统 - 基于 Vue 3 + Node.js + MongoDB 的全栈解决方案

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4

### 后端
- **框架**: Node.js + Express
- **数据库**: MongoDB + Mongoose
- **认证**: JWT
- **加密**: bcrypt

## 项目结构

```
admin-pro/
├── docs/                    # 文档
│   ├── 01-需求规格说明书.md
│   ├── 02-技术方案文档.md
│   └── admin-system-spec.md
│
├── src/                     # 源代码
│   ├── client/              # 前端 (Vue)
│   │   ├── src/
│   │   │   ├── modules/     # 业务模块
│   │   │   │   ├── system/      # 系统管理模块
│   │   │   │   └── image-manager/  # 图片管理模块
│   │   │   ├── core/        # 核心框架
│   │   │   │   ├── layout/      # 布局组件
│   │   │   │   ├── router/      # 路由配置
│   │   │   │   ├── store/       # 状态管理
│   │   │   │   └── views/       # 核心页面
│   │   │   └── shared/      # 共享资源
│   │   │       ├── components/  # 公共组件
│   │   │       ├── directives/  # 自定义指令
│   │   │       └── styles/      # 全局样式
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── server/              # 后端 (Node.js)
│       ├── src/
│       │   ├── routes/          # 路由层
│       │   ├── controllers/     # 控制层
│       │   ├── services/        # 业务层
│       │   ├── models/          # 数据模型
│       │   ├── middleware/      # 中间件
│       │   └── utils/           # 工具函数
│       ├── config/
│       ├── scripts/
│       ├── app.js
│       └── package.json
│
├── docker-compose.yml
└── README.md
```

## 快速开始

### 1. 启动 MongoDB
```bash
mongod
```

### 2. 启动后端
```bash
cd src/server
npm install
npm run seed    # 初始化数据
npm run dev     # 启动服务
```

### 3. 启动前端
```bash
cd src/client
pnpm install
pnpm dev
```

### 4. 访问
- 前端: http://localhost:3000
- 后端: http://localhost:3001
- 默认账号: admin / 123456

## 开发规范

- **Git 提交**: `feat:` / `fix:` / `docs:` / `refactor:` / `style:`
- **命名规范**: camelCase (JS) / PascalCase (Vue) / kebab-case (CSS)

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
