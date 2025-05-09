describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/', {
      retries: {
        runMode: 2,
        openMode: 1
      },
      timeout: 10000
    })
    cy.injectAxe()
    cy.wait(1000) // 等待页面完全加载
  })

  it('should have no accessibility violations on homepage', () => {
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      rules: {
        'color-contrast': { enabled: true },
        'document-title': { enabled: true },
        'html-has-lang': { enabled: true },
        'image-alt': { enabled: true },
        'label': { enabled: true },
        'link-name': { enabled: true },
        'list': { enabled: true },
        'listitem': { enabled: true },
        'meta-viewport': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'region': { enabled: true }
      }
    })
  })

  it('should have no accessibility violations on navigation', () => {
    cy.get('nav').should('be.visible').checkA11y()
  })

  it('should have no accessibility violations on forms', () => {
    cy.get('form').should('exist').then($forms => {
      if ($forms.length > 0) {
        cy.wrap($forms).checkA11y()
      } else {
        cy.log('No forms found on this page')
      }
    })
  })

  it('should have no accessibility violations on images', () => {
    cy.get('img').should('exist').then($images => {
      // 检查所有图片是否有 alt 属性
      $images.each((i, img) => {
        expect(img).to.have.attr('alt')
      })
      cy.wrap($images).checkA11y()
    })
  })

  it('should have no accessibility violations on buttons', () => {
    cy.get('button').should('exist').then($buttons => {
      // 检查所有按钮是否有可访问的名称
      $buttons.each((i, button) => {
        const $button = Cypress.$(button)
        const hasText = $button.text().trim().length > 0
        const hasAriaLabel = $button.attr('aria-label')
        expect(hasText || hasAriaLabel, 'Button should have text content or aria-label').to.be.true
      })
      cy.wrap($buttons).checkA11y()
    })
  })

  it('should have no accessibility violations on links', () => {
    cy.get('a').should('exist').then($links => {
      // 检查所有链接是否有可访问的名称
      $links.each((i, link) => {
        const $link = Cypress.$(link)
        const hasText = $link.text().trim().length > 0
        const hasAriaLabel = $link.attr('aria-label')
        expect(hasText || hasAriaLabel, 'Link should have text content or aria-label').to.be.true
      })
      cy.wrap($links).checkA11y()
    })
  })

  it('should have no accessibility violations on headings', () => {
    cy.get('h1, h2, h3, h4, h5, h6').should('exist').then($headings => {
      // 检查标题层级
      const headingLevels = []
      $headings.each((i, heading) => {
        const level = parseInt(heading.tagName.substring(1))
        headingLevels.push(level)
      })
      
      // 确保标题层级是连续的
      headingLevels.sort()
      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i-1]).to.be.lessThan(2)
      }
      
      cy.wrap($headings).checkA11y()
    })
  })

  it('should have proper heading structure', () => {
    // 检查是否有且仅有一个 h1
    cy.get('h1').should('have.length', 1)
    
    // 检查标题层级
    cy.get('h1, h2, h3, h4, h5, h6').then($headings => {
      let lastLevel = 1
      $headings.each((i, heading) => {
        const level = parseInt(heading.tagName.substring(1))
        expect(level - lastLevel).to.be.lessThan(2)
        lastLevel = level
      })
    })
  })

  it('should have proper ARIA labels and roles', () => {
    // 检查导航
    cy.get('nav').should('have.attr', 'role', 'navigation')
    cy.get('nav').should('have.attr', 'aria-label')
    
    // 检查主要内容区域
    cy.get('main').should('have.attr', 'role', 'main')
    
    // 检查页脚
    cy.get('footer').should('have.attr', 'role', 'contentinfo')
    
    // 检查按钮
    cy.get('button').each($button => {
      if (!$button.text().trim()) {
        cy.wrap($button).should('have.attr', 'aria-label')
      }
    })
  })

  it('should be keyboard navigable', () => {
    // 检查跳过导航链接
    cy.get('.skip-link').should('exist')
    
    // 检查焦点顺序
    cy.get('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').each($el => {
      cy.wrap($el).should('be.visible').focus()
      cy.wrap($el).should('have.focus')
    })
  })

  it('should have sufficient color contrast', () => {
    cy.checkA11y(null, {
      runOnly: ['color-contrast']
    })
  })

  it('should handle form validation accessibly', () => {
    cy.get('form').should('exist').then($forms => {
      if ($forms.length > 0) {
        // 检查表单字段是否有标签
        cy.get('form input, form select, form textarea').each($field => {
          const id = $field.attr('id')
          if (id) {
            cy.get(`label[for="${id}"]`).should('exist')
          }
        })
        
        // 检查必填字段标记
        cy.get('form [required]').each($field => {
          const $label = Cypress.$(`label[for="${$field.attr('id')}"]`)
          expect($label.text()).to.match(/.*[*＊].*/)
        })
        
        // 检查错误消息
        cy.get('form [aria-invalid]').each($field => {
          cy.wrap($field).should('have.attr', 'aria-describedby')
        })
      } else {
        cy.log('No forms found on this page')
      }
    })
  })

  it('should support screen readers', () => {
    // 检查动态内容区域
    cy.get('[aria-live]').should('exist')
    
    // 检查图标和装饰性图片
    cy.get('i, [role="img"]').each($el => {
      if ($el.attr('aria-hidden') !== 'true') {
        cy.wrap($el).should('have.attr', 'aria-label')
      }
    })
    
    // 检查可折叠内容
    cy.get('[aria-expanded]').each($el => {
      cy.wrap($el).should('have.attr', 'aria-controls')
    })
  })
}) 