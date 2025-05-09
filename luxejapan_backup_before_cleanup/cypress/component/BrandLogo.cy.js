import BrandLogo from '../../src/components/BrandLogo.vue'

describe('BrandLogo Component', () => {
  it('renders with default props', () => {
    cy.mount(BrandLogo)
    cy.get('[data-test="brand-logo"]').should('be.visible')
    cy.get('[data-test="brand-logo"]').should('have.class', 'brand-logo')
  })

  it('applies custom size prop', () => {
    cy.mount(BrandLogo, {
      props: {
        size: 'large'
      }
    })
    cy.get('[data-test="brand-logo"]').should('have.class', 'brand-logo--large')
  })

  it('applies custom color prop', () => {
    cy.mount(BrandLogo, {
      props: {
        color: 'accent'
      }
    })
    cy.get('[data-test="brand-logo"]').should('have.class', 'brand-logo--accent')
  })
}) 