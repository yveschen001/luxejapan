describe('Navigation Tests', () => {
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

  it('should switch languages correctly', () => {
    cy.get('[data-test="language-switcher"]').should('exist').click()
    cy.get('html').should('have.attr', 'lang', 'en')
    cy.get('[data-test="language-switcher"]').click()
    cy.get('html').should('have.attr', 'lang', 'zh-tw')
  })

  it('should navigate to all main pages', () => {
    const pages = [
      { path: 'about', title: '關於我們' },
      { path: 'process-faq', title: '流程說明' },
      { path: 'testimonials', title: '客戶評價' },
      { path: 'contact', title: '聯絡我們' }
    ]

    pages.forEach(page => {
      cy.get(`[data-test="nav-${page.path}"]`).should('exist').click()
      cy.url().should('include', page.path)
      cy.get('h1').should('contain', page.title)
      cy.wait(500) // 等待页面过渡动画完成
    })
  })

  it('should maintain language preference after navigation', () => {
    // 切换到英文
    cy.get('[data-test="language-switcher"]').click()
    cy.get('html').should('have.attr', 'lang', 'en')

    // 导航到其他页面
    cy.get('[data-test="nav-about"]').click()
    cy.get('html').should('have.attr', 'lang', 'en')

    // 返回首页
    cy.get('[data-test="nav-home"]').click()
    cy.get('html').should('have.attr', 'lang', 'en')
  })

  it('should handle 404 pages correctly', () => {
    // 访问不存在的页面
    cy.visit('/non-existent-page', { failOnStatusCode: false })
    cy.get('[data-test="error-404"]').should('exist')
    cy.get('h1').should('contain', '404')
    
    // 测试返回首页链接
    cy.get('[data-test="back-to-home"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should have working mobile navigation', () => {
    // 设置移动设备视口
    cy.viewport('iphone-x')
    
    // 检查汉堡菜单按钮
    cy.get('.navbar__toggle').should('be.visible')
    
    // 打开菜单
    cy.get('.navbar__toggle').click()
    cy.get('.navbar__links').should('have.class', 'open')
    
    // 点击链接应该关闭菜单
    cy.get('[data-test="nav-about"]').click()
    cy.get('.navbar__links').should('not.have.class', 'open')
  })

  it('should handle keyboard navigation', () => {
    // 测试 Tab 键导航
    cy.get('body').tab()
    cy.focused().should('have.class', 'skip-link')
    
    cy.get('body').tab()
    cy.focused().should('have.attr', 'data-test', 'nav-home')
    
    // 测试回车键激活链接
    cy.focused().type('{enter}')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
}) 