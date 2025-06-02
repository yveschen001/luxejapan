# 贡献指南

感谢您对 LuxeHaven Scraper 项目的关注！我们欢迎任何形式的贡献，包括但不限于功能开发、bug 修复、文档改进等。

## 开发流程

1. Fork 本项目
2. 创建特性分支
   ```bash
   git checkout -b feature/新功能
   ```
3. 提交更改
   ```bash
   git commit -m 'feat: 添加新功能'
   ```
4. 推送到分支
   ```bash
   git push origin feature/新功能
   ```
5. 创建 Pull Request

## 代码规范

### 代码风格
- 使用 ESLint 进行代码风格检查
- 使用 Prettier 格式化代码
- 遵循 `.eslintrc.json` 和 `.prettierrc` 配置

### 提交信息规范
提交信息需要遵循 Conventional Commits 规范：
- feat: 新功能
- fix: 修复 bug
- docs: 更新文档
- style: 格式调整
- refactor: 代码重构
- test: 添加/修改测试
- chore: 其他更新

### 分支命名规范
- feature/功能名称
- fix/问题描述
- docs/文档更新
- test/测试相关

## 开发环境设置

1. 安装依赖
   ```bash
   npm install
   ```

2. 配置环境变量
   ```bash
   cp .env.example .env
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

## 测试规范

- 所有新功能必须包含单元测试
- 测试覆盖率要求不低于 80%
- 运行测试：`npm test`

## 文档规范

- 所有 API 接口需要添加 JSDoc 注释
- 更新 README.md 中的相关文档
- 添加必要的代码注释

## 问题反馈

如果您发现任何问题或有改进建议，请：
1. 检查是否已有相关 issue
2. 创建新的 issue，详细描述问题
3. 提供复现步骤和预期结果

## 行为准则

- 尊重每一位贡献者
- 保持专业和友善的交流
- 接受建设性的批评
- 关注问题本身而不是个人 