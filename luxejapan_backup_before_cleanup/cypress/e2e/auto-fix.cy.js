describe('Auto Fix Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    Cypress.env('autoFix', true)
  })

  it('should automatically fix image optimization issues', () => {
    cy.fixImageOptimization()
    
    // 验证修复后的图片
    cy.get('img').each(($img) => {
      const src = $img.attr('src')
      expect(src).to.match(/\.(webp|avif)$/)
    })
  })

  it('should automatically fix accessibility issues', () => {
    cy.fixAccessibilityIssues()
    
    // 验证 ARIA 标签
    cy.get('button, a, input').each(($el) => {
      expect($el).to.have.attr('aria-label')
    })
    
    // 验证图片 alt 属性
    cy.get('img').each(($el) => {
      expect($el).to.have.attr('alt')
    })
  })

  it('should automatically fix performance issues', () => {
    cy.fixPerformanceIssues()
    
    // 验证资源大小
    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource')
      resources.forEach((resource) => {
        expect(resource.decodedBodySize).to.be.lessThan(500000)
      })
    })
  })

  it('should log all fixes', () => {
    // 运行所有修复
    cy.fixImageOptimization()
    cy.fixAccessibilityIssues()
    cy.fixPerformanceIssues()
    
    // 检查日志文件
    cy.readFile('cypress/logs/accessibility.log').should('exist')
  })
}) 