# TeleSoul Frontend

TeleSoul 前端项目，基于 Vue 3 + TypeScript + Vite + Tailwind CSS 构建。

## 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 快速开始

1. 安装依赖：

```bash
pnpm install
```

2. 启动开发服务器：

```bash
pnpm dev
```

3. 构建生产版本：

```bash
pnpm build
```

4. 预览生产版本：

```bash
pnpm preview
```

## 开发指南

### 组件开发

- 所有组件位于 `src/components` 目录
- 每个组件应包含：
  - 组件文件 (`.vue`)
  - 类型定义 (`.d.ts`)
  - 单元测试 (`.spec.ts`)
  - Storybook 故事 (`.stories.ts`)

### 测试

运行单元测试：

```bash
pnpm test
```

运行测试覆盖率报告：

```bash
pnpm test:coverage
```

### Storybook

启动 Storybook：

```bash
pnpm storybook
```

构建 Storybook：

```bash
pnpm build-storybook
```

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 遵循 Vue 3 组合式 API 最佳实践

运行代码检查：

```bash
pnpm lint
```

运行代码格式化：

```bash
pnpm format
```

## 项目结构

```
frontend/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── composables/   # 组合式函数
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── .storybook/        # Storybook 配置
├── public/            # 公共资源
├── tests/             # 测试文件
└── vite.config.ts     # Vite 配置
```

## 设计系统

- 使用 Tailwind CSS 进行样式管理
- 遵循 TeleSoul 设计规范
- 支持暗色模式
- 响应式设计

## 性能优化

- 路由懒加载
- 组件按需加载
- 图片懒加载
- 资源预加载
- 缓存策略

## 部署

- 支持 Docker 部署
- 支持静态资源 CDN
- 支持环境变量配置
- 支持 CI/CD 集成

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT](LICENSE) 