const { defineConfig } = require('cypress')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // 图片优化任务
      on('task', {
        async fixImage({ imagePath }) {
          const publicPath = path.join(__dirname, 'public', imagePath)
          const tempDir = os.tmpdir()
          const tempFile = path.join(tempDir, `${crypto.randomBytes(16).toString('hex')}.webp`)
          
          try {
            // 先转换到临时文件
            await sharp(publicPath)
              .webp({ quality: 80 })
              .toFile(tempFile)
            
            // 然后替换原文件
            fs.unlinkSync(publicPath)
            fs.renameSync(tempFile, publicPath.replace(/\.(png|jpg|jpeg)$/, '.webp'))
            
            return null
          } catch (error) {
            console.error('图片优化失败:', error)
            return null
          }
        },
        
        // 无障碍修复任务
        fixAccessibility({ selector, issue }) {
          const logPath = path.join(__dirname, 'cypress', 'logs', 'accessibility.log')
          const timestamp = new Date().toISOString()
          const logEntry = `${timestamp} - ${issue}\n`
          
          // 确保日志目录存在
          const logDir = path.dirname(logPath)
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true })
          }
          
          fs.appendFileSync(logPath, logEntry)
          return true
        },
        
        // 日志任务
        log(message) {
          console.log(message)
          return null
        }
      })
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
}) 