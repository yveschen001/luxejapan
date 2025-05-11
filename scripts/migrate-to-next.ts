import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const TARGET_DIR = path.join(ROOT_DIR, '..', 'luxejapan-next');

// 依赖映射关系
const dependencyMappings = {
  'vue': ['react', 'react-dom'],
  'vue-router': 'next/router',
  'vue-i18n': ['next-i18next', 'react-i18next'],
  '@vitejs/plugin-vue': null, // 将被移除
  'vite': null, // 将被移除
  'tailwindcss': 'tailwindcss',
  '@headlessui/vue': '@headlessui/react',
  '@heroicons/vue': '@heroicons/react',
};

// 文件扩展名映射
const extensionMappings = {
  '.vue': '.tsx',
  '.js': '.ts',
};

// Vue到React的基本语法映射
const syntaxMappings = {
  'v-if': 'conditional rendering with {}',
  'v-for': '.map()',
  'v-model': 'useState and onChange',
  '@click': 'onClick',
  ':class': 'className',
  'ref:': 'useRef',
  'computed:': 'useMemo',
  'watch:': 'useEffect',
};

// 品牌规范配置
const brandConfig = {
  typography: {
    brandFont: 'Playfair Display',
    weights: [400, 600, 700],
    letterSpacing: '0.08em',
    colors: {
      primary: '#2D1B4D',
      accent: '#D4AF37',
    }
  },
  spacing: {
    base: '0.25rem',
    sections: '2rem',
    container: '1200px'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

// 多语言配置
const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'zh-tw', 'ko', 'vi', 'es'],
  namespaces: ['common', 'home', 'about', 'services', 'contact']
};

async function executeCommand(command: string) {
  try {
    console.log(`执行命令: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`命令执行失败: ${error}`);
    throw error;
  }
}

async function analyzeDependencies() {
  console.log('📦 分析项目依赖...');
  
  try {
    const packageJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
    const newDependencies = {};
    const newDevDependencies = {};

    // 处理依赖映射
    for (const [oldDep, newDep] of Object.entries(dependencyMappings)) {
      if (packageJson.dependencies?.[oldDep] || packageJson.devDependencies?.[oldDep]) {
        if (Array.isArray(newDep)) {
          newDep.forEach(dep => {
            newDependencies[dep] = 'latest';
          });
        } else if (newDep) {
          newDependencies[newDep] = 'latest';
        }
      }
    }

    // 添加Next.js特定依赖
    Object.assign(newDependencies, {
      'next': 'latest',
      'react': 'latest',
      'react-dom': 'latest',
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      'next-i18next': 'latest',
      'react-i18next': 'latest',
    });

    return { dependencies: newDependencies, devDependencies: newDevDependencies };
  } catch (error) {
    console.error('❌ 依赖分析失败：', error);
    throw error;
  }
}

async function createNextProject() {
  console.log('🚀 开始创建 Next.js 项目...');
  
  try {
    await executeCommand(`npx create-next-app@latest ${TARGET_DIR} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`);
    
    // 分析并安装额外依赖
    const { dependencies, devDependencies } = await analyzeDependencies();
    
    process.chdir(TARGET_DIR);
    
    // 安装依赖
    for (const [dep, version] of Object.entries(dependencies)) {
      await executeCommand(`npm install ${dep}@${version}`);
    }
    
    // 安装开发依赖
    for (const [dep, version] of Object.entries(devDependencies)) {
      await executeCommand(`npm install -D ${dep}@${version}`);
    }
    
    console.log('✅ Next.js 项目创建成功！');
  } catch (error) {
    console.error('❌ Next.js 项目创建失败！');
    throw error;
  }
}

async function setupI18n() {
  console.log('🌍 配置多语言支持...');
  
  try {
    process.chdir(TARGET_DIR);
    
    // 创建语言配置文件
    const i18nConfig = `
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-tw', 'ko', 'vi', 'es'],
  },
}`;
    
    await fs.writeFile(
      path.join(TARGET_DIR, 'next-i18next.config.js'),
      i18nConfig
    );

    // 创建多语言目录结构
    const locales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
    for (const locale of locales) {
      await fs.ensureDir(path.join(TARGET_DIR, 'public/locales', locale));
    }

    // 复制i18n资源文件
    const sourceI18n = path.join(ROOT_DIR, 'src/i18n');
    const targetI18n = path.join(TARGET_DIR, 'public/locales');
    if (await fs.pathExists(sourceI18n)) {
      await fs.copy(sourceI18n, targetI18n);
    }

    // 创建i18n工具函数
    const i18nUtils = `
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getI18nProps = async (locale: string, namespacesRequired: string[] = ['common']) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, namespacesRequired)),
    },
  };
};

export const useI18nHook = () => useTranslation(['common']);
`;

    await fs.writeFile(
      path.join(TARGET_DIR, 'src/utils/i18n.ts'),
      i18nUtils
    );
    
    console.log('✅ 多语言配置完成！');
  } catch (error) {
    console.error('❌ 多语言配置失败！');
    throw error;
  }
}

async function convertVueToReact(content: string): Promise<string> {
  // 这里实现Vue到React的基本转换逻辑
  let reactContent = content;

  // 替换模板语法
  for (const [vuePattern, reactPattern] of Object.entries(syntaxMappings)) {
    reactContent = reactContent.replace(
      new RegExp(vuePattern, 'g'),
      reactPattern
    );
  }

  // 添加React导入
  reactContent = `import React from 'react';\n${reactContent}`;

  return reactContent;
}

async function migrateComponents() {
  console.log('🔄 迁移组件...');
  
  try {
    const sourceComponents = path.join(ROOT_DIR, 'src/components');
    const targetComponents = path.join(TARGET_DIR, 'src/components');
    
    // 创建组件目录
    await fs.ensureDir(targetComponents);

    // 遍历并转换所有组件
    const processComponent = async (filePath: string) => {
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(filePath);
        for (const file of files) {
          await processComponent(path.join(filePath, file));
        }
      } else {
        const ext = path.extname(filePath);
        if (ext in extensionMappings) {
          const content = await fs.readFile(filePath, 'utf-8');
          const newContent = await convertVueToReact(content);
          
          const relativePath = path.relative(sourceComponents, filePath);
          const newExt = extensionMappings[ext];
          const newPath = path.join(
            targetComponents,
            relativePath.replace(ext, newExt)
          );
          
          await fs.ensureDir(path.dirname(newPath));
          await fs.writeFile(newPath, newContent);
        }
      }
    };

    if (await fs.pathExists(sourceComponents)) {
      await processComponent(sourceComponents);
    }

    console.log('✅ 组件迁移成功！');
  } catch (error) {
    console.error('❌ 组件迁移失败！');
    throw error;
  }
}

async function migratePages() {
  console.log('📄 迁移页面...');
  
  try {
    const sourcePages = path.join(ROOT_DIR, 'src/pages');
    const targetPages = path.join(TARGET_DIR, 'src/app');
    
    // 创建基本的应用结构
    const locales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
    for (const locale of locales) {
      await fs.ensureDir(path.join(targetPages, locale));
    }

    // 创建布局组件
    const layoutContent = `
import React from 'react';
import { useTranslation } from 'next-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
`;

    await fs.writeFile(
      path.join(targetPages, '[locale]/layout.tsx'),
      layoutContent
    );

    // 复制并转换页面
    if (await fs.pathExists(sourcePages)) {
      const processPage = async (filePath: string) => {
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(filePath);
          for (const file of files) {
            await processPage(path.join(filePath, file));
          }
        } else {
          const content = await fs.readFile(filePath, 'utf-8');
          const reactContent = await convertVueToReact(content);
          
          const relativePath = path.relative(sourcePages, filePath);
          const newPath = path.join(
            targetPages,
            '[locale]',
            relativePath.replace(path.extname(relativePath), '.tsx')
          );
          
          await fs.ensureDir(path.dirname(newPath));
          await fs.writeFile(newPath, reactContent);
        }
      };

      await processPage(sourcePages);
    }
    
    console.log('✅ 页面迁移成功！');
  } catch (error) {
    console.error('❌ 页面迁移失败！');
    throw error;
  }
}

async function migrateAssets() {
  console.log('🖼 迁移静态资源...');
  
  try {
    // 复制资源文件
    const sourceAssets = path.join(ROOT_DIR, 'src/assets');
    const targetPublic = path.join(TARGET_DIR, 'public');
    
    if (await fs.pathExists(sourceAssets)) {
      await fs.copy(sourceAssets, targetPublic);
    }

    // 复制public目录
    const sourcePublic = path.join(ROOT_DIR, 'public');
    if (await fs.pathExists(sourcePublic)) {
      await fs.copy(sourcePublic, targetPublic);
    }

    // 更新资源引用路径
    const updateAssetPaths = async (directory: string) => {
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          await updateAssetPaths(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          let content = await fs.readFile(filePath, 'utf-8');
          
          // 更新资源引用路径
          content = content.replace(
            /['"]@\/assets\/(.*?)['"]/g,
            "'/assets/$1'"
          );
          
          await fs.writeFile(filePath, content);
        }
      }
    };

    await updateAssetPaths(path.join(TARGET_DIR, 'src'));

    console.log('✅ 静态资源迁移成功！');
  } catch (error) {
    console.error('❌ 静态资源迁移失败！');
    throw error;
  }
}

async function migrateStyles() {
  console.log('🎨 迁移样式文件...');
  
  try {
    const sourceStyles = path.join(ROOT_DIR, 'src/styles');
    const targetStyles = path.join(TARGET_DIR, 'src/styles');
    
    // 复制样式文件
    if (await fs.pathExists(sourceStyles)) {
      await fs.copy(sourceStyles, targetStyles);
    }
    
    // 复制根目录的styles.css
    const rootStyles = path.join(ROOT_DIR, 'styles.css');
    if (await fs.pathExists(rootStyles)) {
      await fs.copy(rootStyles, path.join(targetStyles, 'global.css'));
    }

    // 更新样式导入
    const updateStyleImports = async (directory: string) => {
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          await updateStyleImports(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          let content = await fs.readFile(filePath, 'utf-8');
          
          // 更新样式导入路径
          content = content.replace(
            /import ['"]\.\.?\/styles\/(.*?)['"];/g,
            `import '@/styles/$1';`
          );
          
          await fs.writeFile(filePath, content);
        }
      }
    };

    await updateStyleImports(path.join(TARGET_DIR, 'src'));
    
    console.log('✅ 样式文件迁移成功！');
  } catch (error) {
    console.error('❌ 样式文件迁移失败！');
    throw error;
  }
}

async function setupGitHubActions() {
  console.log('🔧 配置 GitHub Actions...');
  
  try {
    const workflowsDir = path.join(TARGET_DIR, '.github/workflows');
    await fs.ensureDir(workflowsDir);
    
    const deployWorkflow = `
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run export
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
`;
    
    await fs.writeFile(
      path.join(workflowsDir, 'deploy.yml'),
      deployWorkflow
    );

    // 复制现有的GitHub配置
    const sourceGithub = path.join(ROOT_DIR, '.github');
    if (await fs.pathExists(sourceGithub)) {
      await fs.copy(sourceGithub, path.join(TARGET_DIR, '.github'));
    }
    
    console.log('✅ GitHub Actions 配置完成！');
  } catch (error) {
    console.error('❌ GitHub Actions 配置失败！');
    throw error;
  }
}

async function setupConfig() {
  console.log('⚙️ 配置项目设置...');
  
  try {
    // 复制配置文件
    const configFiles = [
      '.eslintrc.js',
      '.prettierrc',
      '.gitignore',
      'README.md',
      'tsconfig.json',
    ];

    for (const file of configFiles) {
      const sourcePath = path.join(ROOT_DIR, file);
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(TARGET_DIR, file));
      }
    }

    // 更新 package.json 脚本
    const packageJson = await fs.readJson(path.join(TARGET_DIR, 'package.json'));
    packageJson.scripts = {
      ...packageJson.scripts,
      'export': 'next export',
      'analyze': 'ANALYZE=true next build',
      'lint': 'next lint',
      'type-check': 'tsc --noEmit',
    };
    await fs.writeJson(path.join(TARGET_DIR, 'package.json'), packageJson, { spaces: 2 });

    console.log('✅ 项目配置完成！');
  } catch (error) {
    console.error('❌ 项目配置失败！');
    throw error;
  }
}

async function verifyMigration() {
  console.log('🔍 验证迁移结果...');
  
  try {
    process.chdir(TARGET_DIR);

    // 检查类型
    await executeCommand('npm run type-check');

    // 运行 lint
    await executeCommand('npm run lint');

    // 尝试构建
    await executeCommand('npm run build');

    console.log('✅ 迁移验证完成！');
  } catch (error) {
    console.error('❌ 迁移验证失败！');
    throw error;
  }
}

async function verifyBrandConsistency() {
  console.log('🎨 验证品牌一致性...');
  
  try {
    const targetDir = path.join(TARGET_DIR, 'src');
    const issues = [];
    
    // 检查字体引用
    const fontCheck = async (file: string) => {
      const content = await fs.readFile(file, 'utf-8');
      if (!content.includes(brandConfig.typography.brandFont)) {
        issues.push(`文件 ${file} 未使用品牌字体`);
      }
    };
    
    // 检查颜色使用
    const colorCheck = async (file: string) => {
      const content = await fs.readFile(file, 'utf-8');
      const colorVars = [brandConfig.typography.colors.primary, brandConfig.typography.colors.accent];
      if (!colorVars.some(color => content.includes(color))) {
        issues.push(`文件 ${file} 可能未使用品牌颜色`);
      }
    };
    
    // 递归检查所有文件
    const checkFiles = async (directory: string) => {
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await checkFiles(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
          await fontCheck(fullPath);
          await colorCheck(fullPath);
        }
      }
    };
    
    await checkFiles(targetDir);
    
    if (issues.length > 0) {
      console.log('⚠️ 发现品牌一致性问题：');
      issues.forEach(issue => console.log(` - ${issue}`));
    } else {
      console.log('✅ 品牌一致性检查通过');
    }
    
    return issues;
  } catch (error) {
    console.error('❌ 品牌一致性检查失败：', error);
    throw error;
  }
}

async function verifyI18nCompleteness() {
  console.log('🌍 验证多语言完整性...');
  
  try {
    const localesDir = path.join(TARGET_DIR, 'public/locales');
    const issues = [];
    
    // 检查所有语言文件是否完整
    for (const locale of i18nConfig.locales) {
      const localeDir = path.join(localesDir, locale);
      
      for (const namespace of i18nConfig.namespaces) {
        const filePath = path.join(localeDir, `${namespace}.json`);
        
        if (!await fs.pathExists(filePath)) {
          issues.push(`缺少语言文件：${locale}/${namespace}.json`);
          continue;
        }
        
        // 检查翻译完整性
        const translations = await fs.readJson(filePath);
        const defaultTranslations = await fs.readJson(
          path.join(localesDir, i18nConfig.defaultLocale, `${namespace}.json`)
        );
        
        const missingKeys = Object.keys(defaultTranslations).filter(
          key => !translations[key]
        );
        
        if (missingKeys.length > 0) {
          issues.push(`${locale}/${namespace}.json 缺少以下翻译：${missingKeys.join(', ')}`);
        }
      }
    }
    
    if (issues.length > 0) {
      console.log('⚠️ 发现多语言问题：');
      issues.forEach(issue => console.log(` - ${issue}`));
    } else {
      console.log('✅ 多语言完整性检查通过');
    }
    
    return issues;
  } catch (error) {
    console.error('❌ 多语言完整性检查失败：', error);
    throw error;
  }
}

async function verifyUIConsistency() {
  console.log('🖼 验证UI一致性...');
  
  try {
    const targetDir = path.join(TARGET_DIR, 'src');
    const issues = [];
    
    // 检查组件属性
    const checkComponentProps = async (file: string) => {
      const content = await fs.readFile(file, 'utf-8');
      
      // 检查常见UI组件属性
      const commonProps = ['className', 'style', 'onClick', 'onChange'];
      commonProps.forEach(prop => {
        if (!content.includes(prop)) {
          issues.push(`文件 ${file} 可能缺少常用属性 ${prop}`);
        }
      });
    };
    
    // 检查响应式设计
    const checkResponsiveness = async (file: string) => {
      const content = await fs.readFile(file, 'utf-8');
      
      // 检查是否使用了响应式类名
      const breakpoints = Object.keys(brandConfig.breakpoints);
      breakpoints.forEach(bp => {
        if (!content.includes(`${bp}:`) && file.endsWith('.tsx')) {
          issues.push(`文件 ${file} 可能缺少 ${bp} 断点的响应式处理`);
        }
      });
    };
    
    // 递归检查所有组件文件
    const checkFiles = async (directory: string) => {
      const files = await fs.readdir(directory);
      
      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          await checkFiles(fullPath);
        } else if (file.endsWith('.tsx')) {
          await checkComponentProps(fullPath);
          await checkResponsiveness(fullPath);
        }
      }
    };
    
    await checkFiles(path.join(targetDir, 'components'));
    
    if (issues.length > 0) {
      console.log('⚠️ 发现UI一致性问题：');
      issues.forEach(issue => console.log(` - ${issue}`));
    } else {
      console.log('✅ UI一致性检查通过');
    }
    
    return issues;
  } catch (error) {
    console.error('❌ UI一致性检查失败：', error);
    throw error;
  }
}

async function autoFix(issues: string[]) {
  console.log('🔧 尝试自动修复问题...');
  
  try {
    for (const issue of issues) {
      if (issue.includes('未使用品牌字体')) {
        // 添加字体导入
        const globalStyles = path.join(TARGET_DIR, 'src/styles/globals.css');
        await fs.appendFile(globalStyles, `
@import url('https://fonts.googleapis.com/css2?family=${brandConfig.typography.brandFont}:wght@${brandConfig.typography.weights.join(';')}&display=swap');
`);
      }
      
      if (issue.includes('缺少语言文件')) {
        // 创建缺失的语言文件
        const [locale, namespace] = issue.match(/(\w+)\/(\w+)\.json/);
        const defaultTranslations = await fs.readJson(
          path.join(TARGET_DIR, 'public/locales', i18nConfig.defaultLocale, `${namespace}.json`)
        );
        await fs.writeJson(
          path.join(TARGET_DIR, 'public/locales', locale, `${namespace}.json`),
          defaultTranslations
        );
      }
      
      // 其他自动修复逻辑...
    }
    
    console.log('✅ 自动修复完成');
  } catch (error) {
    console.error('❌ 自动修复失败：', error);
    throw error;
  }
}

async function iterativeMigration() {
  console.log('🔄 开始迭代式迁移...');
  
  try {
    // 第一阶段：基础迁移
    await createNextProject();
    await setupI18n();
    await migrateComponents();
    await migratePages();
    await migrateAssets();
    await migrateStyles();
    await setupGitHubActions();
    await setupConfig();
    
    // 第二阶段：一致性检查
    const brandIssues = await verifyBrandConsistency();
    const i18nIssues = await verifyI18nCompleteness();
    const uiIssues = await verifyUIConsistency();
    
    const allIssues = [...brandIssues, ...i18nIssues, ...uiIssues];
    
    if (allIssues.length > 0) {
      console.log('发现问题，尝试自动修复...');
      await autoFix(allIssues);
      
      // 再次验证
      const remainingBrandIssues = await verifyBrandConsistency();
      const remainingI18nIssues = await verifyI18nCompleteness();
      const remainingUIIssues = await verifyUIConsistency();
      
      const remainingIssues = [
        ...remainingBrandIssues,
        ...remainingI18nIssues,
        ...remainingUIIssues
      ];
      
      if (remainingIssues.length > 0) {
        console.log('⚠️ 以下问题需要手动处理：');
        remainingIssues.forEach(issue => console.log(` - ${issue}`));
      }
    }
    
    // 第三阶段：构建验证
    await verifyMigration();
    
    console.log(`
🎉 迁移完成！

检查清单：
1. 品牌一致性
   - 字体使用：${brandConfig.typography.brandFont}
   - 颜色系统
   - 间距规范
   - 响应式设计

2. 多语言支持
   - 默认语言：${i18nConfig.defaultLocale}
   - 支持语言：${i18nConfig.locales.join(', ')}
   - 翻译完整性
   - 语言切换功能

3. UI界面
   - 组件属性完整性
   - 响应式实现
   - 交互一致性
   - 布局结构

4. 后续优化建议
   - 运行 npm run dev 检查开发环境
   - 测试所有语言版本
   - 验证响应式布局
   - 检查性能指标

如需进一步优化，请运行：
npm run lint
npm run type-check
npm run build
`);
  } catch (error) {
    console.error('迁移过程中出现错误：', error);
    process.exit(1);
  }
}

// 替换原有的main函数调用
iterativeMigration(); 