describe('Performance Tests', () => {
  beforeEach(() => {
    cy.visit('/', {
      retries: {
        runMode: 2,
        openMode: 1
      },
      timeout: 10000
    })
    cy.wait(1000) // 等待页面加载完成
  })

  it('should load within performance budget', () => {
    cy.checkPerformance()
  })

  it('should have optimized images', () => {
    cy.checkImages()
  })

  it('should have proper meta tags and resource hints', () => {
    cy.checkResourceHints()
  })

  it('should have proper caching headers', () => {
    cy.checkCaching()
  })

  it('should have minimal main thread blocking', () => {
    cy.window().then((win) => {
      const performance = win.performance
      const longTasks = performance.getEntriesByType('longtask') || []
      
      // 检查长任务数量（开发环境可能有更多）
      expect(longTasks.length).to.be.lessThan(10)
      
      // 检查长任务持续时间
      longTasks.forEach(task => {
        expect(task.duration).to.be.lessThan(100)
      })
    })
  })
}) 