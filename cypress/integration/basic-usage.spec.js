describe('Basic usage', () => {
    it('should open and close a tooltip', () => {
        cy.visit('/');
        cy.get('.premium').trigger('mousemove', { force: true });
        cy.wait(250);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 1);
        cy.document().trigger('mousemove');
        cy.wait(100);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 0);
    });
});