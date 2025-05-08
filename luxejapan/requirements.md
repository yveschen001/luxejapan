# Luxe Japan Elite Escorts - Website Development Requirements

## Project Overview

This project aims to build a luxurious, high-quality, responsive static website for "Luxe Japan Elite Escorts" with multi-language support, SEO optimization, and comprehensive analytics integration.

## Core Features

### 1. Multi-language Support
- Languages: Traditional Chinese, English, Korean, Vietnamese, Spanish
- Directory structure: `/zh-tw/`, `/en/`, `/ko/`, `/vi/`, `/es/`
- JSON-based language packs for easy maintenance

### 2. Website Structure
- Homepage with full-screen hero section
- About Us
- Services
- Process & Pricing
- Contact
- Service Notes

### 3. Technical Requirements
- Static frontend (HTML/CSS/JavaScript)
- Responsive design (mobile, tablet, desktop)
- SEO optimization
- Social media integration
- Analytics integration (Firebase & Google Analytics)
- Automated testing (Cypress/Playwright)

## Technical Stack

### Frontend
- HTML5
- CSS3 (with CSS variables)
- JavaScript (ES6+)
- Optional: React/Vue.js

### Build Tools
- Node.js & npm
- Build tool: Vite/Parcel/Webpack

### Testing
- Cypress or Playwright for E2E testing

### Deployment
- GitHub Pages
- GitHub Actions for CI/CD

## Project Structure

```
LuxeJapanSite/
├── public/                    # Build output
├── src/
│   ├── assets/               # Static resources
│   │   ├── images/          # 图片资源
│   │   │   ├── hero/       # 首页大图
│   │   │   ├── services/   # 服务相关图片
│   │   │   ├── gallery/    # 展示图片
│   │   │   └── icons/      # 图标资源
│   │   ├── videos/         # 视频资源
│   │   └── fonts/          # 字体文件
│   ├── i18n/                # Language packs
│   ├── components/          # Reusable UI components
│   ├── pages/              # Language-specific pages
│   ├── styles/             # CSS files
│   └── index.js            # Entry script
├── docs/                    # 项目文档
│   ├── CONTRIBUTING.md     # 贡献指南
│   ├── CHANGELOG.md        # 更新日志
│   └── PRIVACY.md          # 隐私政策
├── cypress/ or playwright/  # Test files
├── .github/
│   └── workflows/          # CI/CD configuration
├── .gitignore              # Git忽略文件
├── README.md               # 项目说明
├── package.json            # 项目配置
└── vite.config.js          # Vite配置
```

## Development Guidelines

### CSS Standards
- Use CSS variables for theming
- BEM naming convention
- Mobile-first approach
- Responsive breakpoints

### File Naming
- Lowercase with hyphens
- Descriptive and clear
- Consistent across project

### Performance Targets
- First load time ≤ 2s
- Lighthouse score ≥ 90
- Optimized images and assets

## Deployment Process

1. Local development and testing
2. Push to main branch
3. GitHub Actions automated build and test
4. Deploy to GitHub Pages

## Analytics Integration

### Firebase
- User tracking
- Custom events
- Conversion monitoring

### Google Analytics
- Page views
- User behavior
- Traffic sources

## Testing Requirements

### Automated Tests
- Language switching
- Responsive design
- Navigation
- Form validation
- Social media links

## Security Considerations

- HTTPS implementation
- Secure external resources
- Privacy policy compliance
- GDPR considerations

## Maintenance

- Regular content updates
- Performance monitoring
- Security patches
- Analytics review

## Timeline and Milestones

1. Setup and Configuration (Week 1)
2. Core Development (Weeks 2-4)
3. Testing and QA (Week 5)
4. Deployment and Launch (Week 6)

## References

- [W3Schools Static Website Guide](https://www.w3schools.com/howto/howto_website_static.asp)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Cypress Documentation](https://docs.cypress.io/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 多语言规范

### 1. 语言包结构
```json
{
  "common": {
    "navigation": {
      "home": "首页",
      "about": "关于我们",
      "services": "服务项目",
      "contact": "联系我们"
    },
    "buttons": {
      "bookNow": "立即预约",
      "learnMore": "了解更多"
    }
  },
  "home": {
    "hero": {
      "title": "奢华伴游服务",
      "subtitle": "为您提供尊贵体验"
    }
  }
}
```

### 2. 语言切换机制
- URL 路径方式：`/zh-tw/`, `/en/`, `/ko/`, `/vi/`, `/es/`
- 默认语言：英文
- 语言检测：基于浏览器设置
- 语言持久化：使用 localStorage

### 3. SEO 多语言优化
- 每个语言版本使用独立的 meta 标签
- 实现 hreflang 标签
- 语言版本间互链
- 针对不同语言优化关键词

## 测试规范

### 1. 单元测试
- 组件测试
- 工具函数测试
- 语言包测试

### 2. E2E 测试
- 页面导航测试
- 语言切换测试
- 表单提交测试
- 响应式布局测试

### 3. 性能测试
- Lighthouse 评分要求
- 首屏加载时间
- 图片优化测试
- 缓存策略测试

## 代码命名规范

### 1. 文件命名
- 组件文件：`PascalCase.vue` 或 `PascalCase.jsx`
- 工具文件：`camelCase.js`
- 样式文件：`kebab-case.css`
- 图片文件：`kebab-case.png`

### 2. CSS 命名 (BEM)
```css
.block {}
.block__element {}
.block--modifier {}
```

### 3. JavaScript 命名
- 变量：`camelCase`
- 常量：`UPPER_SNAKE_CASE`
- 函数：`camelCase`
- 类：`PascalCase`

## 目录结构详解

```
src/
├── assets/
│   ├── images/
│   │   ├── hero/           # 首页大图 (1920x1080)
│   │   ├── services/       # 服务图片 (800x600)
│   │   ├── gallery/        # 展示图片 (1200x800)
│   │   └── icons/          # SVG图标 (24x24, 32x32)
│   ├── videos/             # 视频资源 (MP4, WebM)
│   └── fonts/              # 字体文件
├── i18n/
│   ├── zh-tw.json         # 繁体中文
│   ├── en.json           # 英文
│   ├── ko.json           # 韩文
│   ├── vi.json           # 越南文
│   └── es.json           # 西班牙文
├── components/
│   ├── common/           # 通用组件
│   ├── layout/           # 布局组件
│   └── sections/         # 页面区块组件
├── pages/
│   ├── zh-tw/           # 繁体中文页面
│   ├── en/             # 英文页面
│   ├── ko/             # 韩文页面
│   ├── vi/             # 越南文页面
│   └── es/             # 西班牙文页面
└── styles/
    ├── variables.css    # CSS变量
    ├── reset.css       # 重置样式
    ├── typography.css  # 排版样式
    └── components/     # 组件样式
```

## 性能优化规范

### 1. 图片优化
- 使用 WebP 格式
- 实现懒加载
- 响应式图片
- 图片压缩

### 2. 代码优化
- 代码分割
- 树摇优化
- 缓存策略
- 压缩资源

### 3. 加载优化
- 预加载关键资源
- 延迟加载非关键资源
- 使用 CDN
- 实现 PWA

## 安全规范

### 1. 内容安全
- CSP 配置
- XSS 防护
- CSRF 防护
- 输入验证

### 2. 数据安全
- 敏感信息加密
- 安全的 API 调用
- 数据备份策略
- 访问控制

## 部署规范

### 1. 环境配置
- 开发环境
- 测试环境
- 生产环境

### 2. 部署流程
- 代码审查
- 自动化测试
- 构建优化
- 部署验证

### 3. 监控告警
- 性能监控
- 错误追踪
- 用户行为分析
- 安全监控

## 文档规范

### 1. 代码文档
- JSDoc 注释
- 组件文档
- API 文档
- 更新日志

### 2. 项目文档
- 架构文档
- 部署文档
- 维护文档
- 用户指南

## 设计参考与优化

### 1. 视觉设计特点（参考 SEM Restaurant）
- 全屏视差滚动效果
- 大图展示区域（Hero Section）
- 简约优雅的排版
- 动态滚动动画
- 图片画廊展示
- 响应式设计断点：
  - 移动端：< 768px
  - 平板：768px - 1024px
  - 桌面：> 1024px

### 2. 交互设计
- 平滑滚动效果
- 图片悬停放大效果
- 导航栏滚动时固定
- 语言切换动画
- 图片画廊滑动效果
- 按钮悬停效果

### 3. 性能优化（参考 SEM）
- 图片懒加载策略
- 渐进式图片加载
- 预加载关键资源
- 图片格式优化：
  - 使用 WebP 格式
  - 提供 JPG 降级方案
- 视频优化：
  - 使用 poster 属性
  - 延迟加载
  - 提供低分辨率预览

### 4. 页面结构优化
```html
<!-- 首页结构 -->
<header>
  <nav>
    <!-- 多语言导航 -->
  </nav>
</header>

<main>
  <section class="hero">
    <!-- 全屏视差背景 -->
    <!-- 品牌标语 -->
    <!-- 行动按钮 -->
  </section>

  <section class="services">
    <!-- 服务卡片网格 -->
  </section>

  <section class="gallery">
    <!-- 图片画廊 -->
  </section>

  <section class="about">
    <!-- 关于我们 -->
  </section>

  <section class="contact">
    <!-- 联系信息 -->
    <!-- 社交媒体链接 -->
  </section>
</main>

<footer>
  <!-- 页脚信息 -->
</footer>
```

### 5. 动画效果
```css
/* 滚动动画 */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 图片悬停效果 */
.gallery-item {
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

/* 按钮动画 */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.5s;
}

.btn:hover::after {
  left: 100%;
}
```

### 6. 响应式设计策略
```css
/* 断点定义 */
:root {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

/* 响应式布局 */
.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

### 7. 图片优化策略
```html
<!-- 响应式图片 -->
<picture>
  <source
    srcset="image.webp"
    type="image/webp">
  <source
    srcset="image.jpg"
    type="image/jpeg">
  <img
    src="image.jpg"
    alt="描述"
    loading="lazy"
    width="800"
    height="600">
</picture>

<!-- 背景图片优化 -->
<div class="hero" 
     style="background-image: url('hero-small.jpg');"
     data-bg-large="hero-large.jpg">
</div>
```

### 8. 性能监控指标
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.8s

### 9. 无障碍设计
- 符合 WCAG 2.1 AA 标准
- 键盘导航支持
- 屏幕阅读器支持
- 高对比度模式
- 可调整字体大小 

## 设计优化升级

### 1. 视觉体验升级
- 3D 视差效果
  ```css
  .parallax-section {
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  ```
- 动态背景渐变
  ```css
  .hero-gradient {
    background: linear-gradient(
      45deg,
      rgba(0,0,0,0.7),
      rgba(0,0,0,0.3)
    );
    animation: gradientShift 10s ease infinite;
  }
  ```
- 高级图片展示
  - 图片画廊支持手势滑动
  - 图片加载时的优雅过渡
  - 图片放大时的细节展示

### 2. 交互体验升级
- 智能导航
  ```javascript
  // 滚动时自动高亮当前部分
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateNavigation(entry.target.id);
      }
    });
  });
  ```
- 语言切换优化
  - 平滑过渡动画
  - 保持滚动位置
  - 记住用户偏好

### 3. 性能优化升级
- 智能预加载
  ```javascript
  // 预加载下一个可能访问的页面
  const preloadNextPage = () => {
    const nextPage = predictNextPage();
    if (nextPage) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextPage;
      document.head.appendChild(link);
    }
  };
  ```
- 图片优化增强
  - 自适应图片质量
  - 智能裁剪
  - 渐进式加载优化

### 4. 用户体验升级
- 智能表单
  ```javascript
  // 表单智能验证
  const formValidator = {
    validate: (field) => {
      const value = field.value;
      const rules = field.dataset.rules;
      return validateRules(value, rules);
    },
    showError: (field, message) => {
      // 优雅的错误提示
    }
  };
  ```
- 个性化体验
  - 记住用户偏好
  - 智能推荐
  - 个性化内容展示

### 5. 动画效果升级
```css
/* 高级滚动动画 */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 图片悬停效果 */
.gallery-item {
  position: relative;
  overflow: hidden;
}

.gallery-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover::before {
  opacity: 1;
}

/* 按钮动画 */
.btn {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #gold, #silver);
  transition: all 0.3s ease;
}

.btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
  transform: rotate(45deg);
  transition: transform 0.5s ease;
}

.btn:hover::after {
  transform: rotate(45deg) translate(50%, 50%);
}
```

### 6. 响应式设计升级
```css
/* 高级响应式布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* 智能图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 250px;
  grid-gap: 1rem;
}

/* 响应式排版 */
.typography {
  font-size: clamp(1rem, 2.5vw, 2rem);
  line-height: 1.5;
  letter-spacing: 0.02em;
}
```

### 7. 无障碍设计升级
- 高级键盘导航
- 语音控制支持
- 动态字体大小调整
- 高对比度模式
- 屏幕阅读器优化

### 8. 性能指标升级
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.0s
- First Input Delay (FID) < 50ms
- Cumulative Layout Shift (CLS) < 0.05
- Time to Interactive (TTI) < 3.0s

### 9. 创新功能
- 智能预约系统
- 实时在线咨询
- 多语言实时翻译
- 虚拟导览
- 社交媒体集成 

## 设计理念

### 1. 极简主义设计原则
- 留白艺术
  ```css
  .section {
    padding: 8rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .content-block {
    margin-bottom: 4rem;
  }
  ```
- 简约配色
  ```css
  :root {
    --color-primary: #1a1a1a;
    --color-secondary: #f5f5f5;
    --color-accent: #c9a959;
    --color-text: #333333;
    --color-background: #ffffff;
  }
  ```
- 优雅排版
  ```css
  .typography {
    font-family: 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    letter-spacing: 0.02em;
  }
  
  h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 300;
    margin-bottom: 2rem;
  }
  ```

### 2. 流畅体验
- 平滑滚动
  ```css
  html {
    scroll-behavior: smooth;
  }
  
  .scroll-container {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  ```
- 优雅过渡
  ```css
  .fade-transition {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .fade-transition.visible {
    opacity: 1;
    transform: translateY(0);
  }
  ```

### 3. 响应式设计
- 流体布局
  ```css
  .container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }
  ```
- 自适应图片
  ```css
  .image-container {
    position: relative;
    width: 100%;
    padding-bottom: 75%; /* 4:3 比例 */
    overflow: hidden;
  }
  
  .image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ```

### 4. 高级感设计元素
- 精致边框
  ```css
  .elegant-border {
    position: relative;
  }
  
  .elegant-border::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 60px;
    height: 1px;
    background: var(--color-accent);
    transform: translateX(-50%);
  }
  ```
- 微妙阴影
  ```css
  .subtle-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  ```

### 5. 移动优先设计
```css
/* 基础样式（移动端） */
.section {
  padding: 4rem 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .section {
    padding: 6rem 2rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .section {
    padding: 8rem 2rem;
  }
}
```

### 6. 性能优化
- 图片优化
  ```html
  <picture>
    <source
      srcset="image-small.webp 400w,
              image-medium.webp 800w,
              image-large.webp 1200w"
      sizes="(max-width: 768px) 100vw,
             (max-width: 1024px) 50vw,
             33vw"
      type="image/webp">
    <img
      src="image-fallback.jpg"
      alt="描述"
      loading="lazy"
      width="800"
      height="600">
  </picture>
  ```

### 7. 交互设计
- 简约按钮
  ```css
  .btn {
    padding: 1rem 2rem;
    border: 1px solid var(--color-accent);
    background: transparent;
    color: var(--color-accent);
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    background: var(--color-accent);
    color: var(--color-background);
  }
  ```
- 优雅导航
  ```css
  .nav-link {
    position: relative;
    padding: 0.5rem 0;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--color-accent);
    transition: width 0.3s ease;
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
  ```

### 8. 无障碍设计
```css
/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000000;
    --color-accent: #FFD700;
    --color-text: #000000;
    --color-background: #FFFFFF;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## 配色方案

### 1. 主色调
```css
:root {
  /* 主色调 - 暗紫色系 */
  --color-primary: #2D1B4D;      /* 深邃暗紫 */
  --color-primary-light: #3D2B6D; /* 亮暗紫 */
  --color-primary-dark: #1D0B2D;  /* 深暗紫 */
  
  /* 强调色 - 金色系 */
  --color-accent: #D4AF37;       /* 经典金 */
  --color-accent-light: #E5C158;  /* 亮金 */
  --color-accent-dark: #B38F2E;   /* 暗金 */
  
  /* 中性色 - 以白色为主 */
  --color-background: #FFFFFF;    /* 纯白 */
  --color-surface: #F8F8F8;      /* 浅灰白 */
  --color-text: #1A1A1A;         /* 近黑 */
  --color-text-light: #666666;   /* 中灰 */
  
  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --gradient-accent: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
  --gradient-light: linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%);
}
```

### 2. 配色应用
```css
/* 导航栏 */
.navbar {
  background: var(--color-background);
  color: var(--color-primary);
  border-bottom: 1px solid rgba(45, 27, 77, 0.1);
}

.nav-link {
  color: var(--color-primary);
}

.nav-link:hover {
  color: var(--color-accent);
}

/* 按钮样式 */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-background);
  border: 1px solid var(--color-primary);
}

.btn-accent {
  background: var(--color-accent);
  color: var(--color-background);
  border: 1px solid var(--color-accent);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* 卡片样式 */
.card {
  background: var(--color-background);
  border: 1px solid rgba(45, 27, 77, 0.1);
  box-shadow: 0 4px 6px rgba(45, 27, 77, 0.05);
}

/* 文字样式 */
.heading {
  color: var(--color-primary);
}

.subheading {
  color: var(--color-text-light);
}

/* 强调元素 */
.highlight {
  color: var(--color-accent);
}

/* 背景区块 */
.section-primary {
  background: var(--gradient-light);
  color: var(--color-primary);
}

.section-accent {
  background: var(--color-accent);
  color: var(--color-background);
}
```

### 3. 暗色模式（可选）
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1A1A1A;
    --color-surface: #2D2D2D;
    --color-text: #FFFFFF;
    --color-text-light: #CCCCCC;
  }
  
  .card {
    background: var(--color-surface);
    border-color: rgba(212, 175, 55, 0.1);
  }
}
```

### 4. 交互状态
```css
/* 悬停效果 */
.btn-primary:hover {
  background: var(--color-primary-light);
}

.btn-accent:hover {
  background: var(--color-accent-light);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-background);
}

/* 激活状态 */
.btn-primary:active {
  background: var(--color-primary-dark);
}

.btn-accent:active {
  background: var(--color-accent-dark);
}

/* 禁用状态 */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 5. 特殊效果
```css
/* 金色边框装饰 */
.elegant-border {
  position: relative;
}

.elegant-border::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 60px;
  height: 2px;
  background: var(--color-accent);
  transform: translateX(-50%);
}

/* 渐变文字 */
.gradient-text {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 微妙阴影 */
.subtle-shadow {
  box-shadow: 0 4px 6px rgba(45, 27, 77, 0.05),
              0 2px 4px rgba(45, 27, 77, 0.03);
}
```

### 6. 配色使用建议
- 主色调（暗紫）用于：
  - 重要标题
  - 主要按钮
  - 导航文字
  - 强调区块

- 强调色（金色）用于：
  - 重要按钮
  - 装饰元素
  - 悬停效果
  - 特殊强调

- 中性色用于：
  - 背景色（白色为主）
  - 正文文本
  - 次要信息
  - 分隔线

### 7. 无障碍考虑
```css
/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000000;
    --color-accent: #FFD700;
    --color-text: #000000;
    --color-background: #FFFFFF;
  }
}
```

## 多語言站內鏈接規範

- 所有站內鏈接（router-link、a）必須根據當前語言自動生成對應語言的路徑。
- 嚴禁硬編碼語言前綴或直接寫死英文路徑。
- 切換語言時，應自動跳轉到當前頁面的對應語言版本。
- 新增頁面或鏈接時，必須檢查多語言鏈接正確性。

## 网站页面结构 Site Page Structure

1. **首页 Home**
   - 服务介绍 Service Introduction
   - 品牌故事 Brand Story

2. **关于我们 About**
   - 品牌理念 Brand Philosophy
   - 服务承诺 Service Commitment

3. **服务项目 Services**
   - 到府服务 In-home Service
   - 恋人伴游 Companion Service
   - 私人会所 Private Club

4. **流程与常见说明 Process & FAQ**
   - 预约流程 Booking Process
   - 常见问题 Frequently Asked Questions

5. **联系我们 Contact**
   - Line、Telegram 联系方式
   - 社交媒体（x.com、Telegram Channel）

6. **客户评价 Testimonials**
   - 客户反馈 Customer Feedback
   - 真实案例 Real Cases 

## 品牌组件与品牌字体规范

- "Luxe Japan"品牌字样必须全站统一使用 `<BrandLogo />` 组件，禁止直接写死文字。
- 品牌组件采用 Playfair Display 字体，字重600，字间距0.08em，颜色为品牌金色（var(--color-accent)），字号根据场景可自定义。
- 品牌组件可通过 props 自定义 size、color、weight、letterSpacing，确保在不同场景下风格一致。
- 品牌组件如需调整，必须经品牌负责人审核。 