describe('Angular app', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('loads', () => {
    cy.visit('');
  });

  it('loads home state by default', () => {
    cy.visit('');
    cy.url().should('include', '/home');
  });

  it('renders uisref as links', () => {
    cy.visit('');
    cy.get('a').contains('home');
    cy.get('a').contains('about');
    cy.get('a').contains('lazy');
    cy.get('a').contains('lazy.child');
    cy.get('a').contains('lazy.child.viewtarget');
  });

  it('renders home', () => {
    cy.visit('/home');
    cy.get('a').contains('home').should('have.class', 'active');
    cy.get('a').contains('about').should('not.have.class', 'active');
    cy.get('#default').contains('home works');
  });

  it('renders about', () => {
    cy.visit('/home');
    cy.visit('/about');
    cy.get('a').contains('home').should('not.have.class', 'active');
    cy.get('a').contains('about').should('have.class', 'active');
    cy.get('#default').contains('about works');
  });

  it('loads lazy routes', () => {
    cy.visit('/home');
    cy.visit('/lazy');
    cy.get('a').contains('home').should('not.have.class', 'active');
    cy.get('a').contains('lazy').should('have.class', 'active');
    cy.get('#default').contains('lazy works');
  });

  it('routes to lazy routes', () => {
    cy.visit('/lazy');
    cy.get('a').contains('home').should('not.have.class', 'active');
    cy.get('a').contains('lazy').should('have.class', 'active');
    cy.get('#default').contains('lazy works');
  });

  it('routes to lazy child routes', () => {
    cy.visit('/lazy/child');
    cy.get('a').contains('home').should('not.have.class', 'active');
    cy.get('a').contains('lazy.child').should('have.class', 'active');
    cy.get('#default').contains('lazy.child works');
  });

  it('targets named views', () => {
    cy.visit('/lazy/child/viewtarget');
    cy.get('a').contains('home').should('not.have.class', 'active');
    cy.get('a').contains('lazy.child').should('have.class', 'active');
    cy.get('#default').contains('lazy.child works');
    cy.get('#header').contains('lazy.child.viewtarget works');
    cy.get('#footer').contains('lazy.child.viewtarget works');
  });
});
