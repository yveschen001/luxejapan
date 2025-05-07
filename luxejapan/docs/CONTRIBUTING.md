# 贡献指南

感谢您对 Luxe Japan Elite Escorts 网站项目的关注！本文档将指导您如何参与项目开发。

## 全局基础组件与静态资源保护规范

- 以下全局基础组件和静态资源（如 SectionDivider.vue、SectionTitle.vue、SectionContainer.vue、section-divider-1.svg 等）为全站统一风格规范的核心部分。
- **禁止随意更改、删除、覆盖上述文件。**
- 如需调整分割线、区块、标题等全局风格，必须通过 Pull Request，并在团队评审后合并。
- 所有涉及全局基础组件的更改，必须详细说明设计意图和影响范围。
- 建议在 PR 标题中注明【全局组件/资源变更】。
- main 分支已受保护，禁止直接 push，所有更改需经 code review。

## 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 代码规范

### HTML
- 使用语义化标签
- 保持代码缩进一致
- 添加适当的注释

### CSS
- 使用 BEM 命名规范
- 优先使用 CSS 变量
- 遵循移动优先原则

### JavaScript
- 使用 ES6+ 语法
- 添加适当的注释
- 保持代码简洁

## 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 测试要求

- 确保所有测试通过
- 添加新功能的测试用例
- 保持测试覆盖率

## 文档要求

- 更新相关文档
- 添加必要的注释
- 保持文档的时效性

## 问题反馈

- 使用 Issue 模板
- 提供详细的复现步骤
- 附上相关的截图或日志

## 行为准则

- 保持专业和尊重
- 接受建设性的批评
- 关注问题本身

## SEO最佳实践

为确保网站在搜索引擎中的表现，所有贡献者在开发和提交代码时需遵循以下SEO相关规范：

- **页面元信息**：所有页面必须包含唯一且有意义的`<title>`和`<meta name="description">`标签。
- **图片优化**：所有图片需使用WebP格式（如有可能），并添加准确的`alt`描述。
- **结构化数据**：如有新增重要内容或页面，请补充相应的结构化数据（如JSON-LD）。
- **多语言一致性**：新增或修改内容时，需同步更新所有支持的语言版本，保持SEO一致性。
- **URL与内容规范**：URL命名需简洁、语义化，避免重复内容，合理使用`canonical`和`hreflang`标签。
- **性能与可访问性**：合并前请运行Lighthouse等工具，SEO分数需≥90，确保无重大可访问性问题。
- **内容更新流程**：定期检查和优化已有内容，移除过时信息，提升内容新鲜度。
- **自动化检测**：建议在PR流程中集成SEO自动化检测工具，强制通过SEO分数门槛。

如有疑问，请参考`requirements.md`中的SEO规范或联系项目维护者。

感谢您的贡献！ 