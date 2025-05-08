// 检查页面性能
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance
    const navigation = performance.getEntriesByType('navigation')[0]
    return navigation
  })
})

// 检查图片加载
Cypress.Commands.add('checkImageLoading', (selector) => {
  cy.get(selector).should('be.visible')
    .and(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(0)
    })
})

// 检查多语言内容
Cypress.Commands.add('checkLanguageContent', (key, expectedText) => {
  cy.get(`[data-i18n="${key}"]`).should('contain', expectedText)
})

// 检查无障碍性
Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe()
  cy.checkA11y()
}) 