// TeleSoul E2E smoke test

describe('Smoke Test', () => {
  it('應該能打開首頁', () => {
    cy.visit('http://localhost:3000')
    cy.contains('TeleSoul').should('exist')
  })

  it('健康檢查 API 應返回 200', () => {
    cy.request('http://localhost:3000/health').its('status').should('eq', 200)
  })
}) 