const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// 递归获取所有图片文件（只处理 jpg/jpeg/png，不处理 svg）
function getImageFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getImageFiles(fullPath));
    } else {
      if (/\.(jpg|jpeg|png)$/i.test(item)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

// 优化图片
async function optimizeImages() {
  const images = getImageFiles(publicDir);
  
  for (const image of images) {
    const ext = path.extname(image);
    const webpPath = image.replace(ext, '.webp');
    
    try {
      await sharp(image)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      console.log(`Converted ${image} to WebP`);
      
      // 删除原始文件
      fs.unlinkSync(image);
      console.log(`Deleted original file: ${image}`);
    } catch (error) {
      console.error(`Error processing ${image}:`, error);
    }
  }
}

// 更新 Vue 文件中的图片引用（不替换 svg）
function updateImageReferences() {
  const srcDir = path.join(__dirname, '../src');
  
  function processFile(filePath) {
    if (!/\.(vue|js|ts|jsx|tsx)$/.test(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    // 只替换 jpg/jpeg/png，不替换 svg
    content = content.replace(/\.(jpg|jpeg|png)/g, '.webp');
    fs.writeFileSync(filePath, content);
    console.log(`Updated references in ${filePath}`);
  }
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        processFile(fullPath);
      }
    }
  }
  
  walkDir(srcDir);
}

// 运行优化
async function run() {
  console.log('开始优化图片...');
  await optimizeImages();
  
  console.log('更新图片引用...');
  updateImageReferences();
  
  console.log('完成！');
}

run().catch(console.error); 