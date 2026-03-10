# Admin Pro

Admin Pro 后台管理系统 - 基于 Vue 3 + Element Plus 的现代化管理后台

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier

## 项目结构

```
admin-pro/
├── public/              # 静态资源
├── src/
│   ├── api/             # API 接口
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   └── views/           # 页面视图
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产环境

```bash
pnpm build
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88
