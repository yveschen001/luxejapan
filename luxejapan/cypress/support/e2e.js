// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-axe'

// 添加键盘导航命令
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9 })
  } else {
    cy.focused().trigger('keydown', { keyCode: 9, which: 9 })
  }
})

Cypress.Commands.add('shiftTab', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9, shiftKey: true })
  } else {
    cy.focused().trigger('keydown', { keyCode: 9, which: 9, shiftKey: true })
  }
})

// 添加焦点管理命令
Cypress.Commands.add('focusFirst', () => {
  cy.get('body').trigger('keydown', { keyCode: 9, which: 9 })
})

Cypress.Commands.add('focusLast', () => {
  cy.get('body').trigger('keydown', { keyCode: 9, which: 9, shiftKey: true })
})

// 添加无障碍测试命令
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe()
  cy.wait(500) // 等待页面加载完成
  cy.checkA11y(context, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    },
    ...options
  })
})

// 添加性能测试命令
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance
    const navigationTiming = performance.getEntriesByType('navigation')[0]
    
    // 检查页面加载时间
    expect(navigationTiming.loadEventEnd - navigationTiming.navigationStart).to.be.lessThan(5000)
    
    // 检查首次内容绘制
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    expect(firstPaint.startTime).to.be.lessThan(2000)
    
    // 检查长任务
    const longTasks = performance.getEntriesByType('longtask') || []
    expect(longTasks.length).to.be.lessThan(10)
    longTasks.forEach(task => {
      expect(task.duration).to.be.lessThan(100)
    })
  })
})

// 添加图片优化检查命令
Cypress.Commands.add('checkImages', () => {
  cy.get('img').each($img => {
    // 检查图片格式
    const src = $img.attr('src')
    if (src && !src.includes('data:image')) {
      expect(src).to.match(/\.(webp|avif)$/)
    }
    
    // 检查懒加载
    expect($img).to.have.attr('loading', 'lazy')
    
    // 检查尺寸
    const width = $img.width()
    const height = $img.height()
    expect(width).to.be.lessThan(2000)
    expect(height).to.be.lessThan(2000)
  })
})

// 添加缓存检查命令
Cypress.Commands.add('checkCaching', () => {
  cy.request('/').then((response) => {
    const cacheControl = response.headers['cache-control']
    expect(cacheControl).to.include('max-age=')
    expect(cacheControl).to.include('public')
  })
})

// 添加资源提示检查命令
Cypress.Commands.add('checkResourceHints', () => {
  cy.get('link[rel="preload"]').should('exist')
  cy.get('link[rel="dns-prefetch"]').should('exist')
  cy.get('link[rel="preconnect"]').should('exist')
})

// 配置全局行为
beforeEach(() => {
  // 重置所有 localStorage
  cy.clearLocalStorage()
  
  // 设置默认语言
  cy.window().then((win) => {
    win.localStorage.setItem('language', 'zh-tw')
  })
})

// 配置全局断言
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('pageLoadTimeout', 30000) 