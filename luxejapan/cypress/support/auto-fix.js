// 自动修复命令
Cypress.Commands.add('autoFix', (type, options) => {
  if (!Cypress.env('autoFix')) return

  switch (type) {
    case 'image':
      cy.task('fixImage', { imagePath: options.path })
      break

    case 'accessibility':
      cy.task('fixAccessibility', {
        selector: options.selector,
        issue: options.issue
      })
      break

    case 'performance':
      // 记录性能问题
      cy.task('log', `Performance issue: ${options.message}`)
      break

    default:
      cy.task('log', `Unknown fix type: ${type}`)
  }
})

// 自动修复图片优化
Cypress.Commands.add('fixImageOptimization', () => {
  cy.get('img').each(($img) => {
    const src = $img.attr('src')
    if (src && !src.endsWith('.webp')) {
      cy.autoFix('image', { path: src })
    }
  })
})

// 自动修复无障碍问题
Cypress.Commands.add('fixAccessibilityIssues', () => {
  cy.get('*').each(($el) => {
    // 检查并修复 ARIA 标签
    if (!$el.attr('aria-label') && $el.is('button, a, input')) {
      const text = $el.text().trim()
      if (text) {
        cy.autoFix('accessibility', {
          selector: cy.$$($el).selector,
          issue: `Missing aria-label on ${$el.prop('tagName').toLowerCase()}`
        })
      }
    }

    // 检查并修复图片 alt 属性
    if ($el.is('img') && !$el.attr('alt')) {
      cy.autoFix('accessibility', {
        selector: cy.$$($el).selector,
        issue: 'Missing alt attribute on image'
      })
    }
  })
})

// 自动修复性能问题
Cypress.Commands.add('fixPerformanceIssues', () => {
  cy.window().then((win) => {
    // 检查并优化大型资源
    const resources = win.performance.getEntriesByType('resource')
    resources.forEach((resource) => {
      if (resource.decodedBodySize > 500000) {
        cy.autoFix('performance', {
          message: `Large resource detected: ${resource.name}`
        })
      }
    })
  })
}) 