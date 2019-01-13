describe('Basic usage', () => {
    before(() => {
        cy.visit('/');
    });

    it('should open and close a tooltip', () => {
        cy.get('#tooltip-trigger-1').trigger('mousemove', { force: true });
        cy.wait(250);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 1);
        cy.document().trigger('mousemove');
        cy.wait(90);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 0);
    });

    it('should open and close a tooltip with position right', () => {
        cy.visit('/');
        cy.get('#tooltip-trigger-2').trigger('mousemove', { force: true });
        cy.wait(250);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 1);
        cy.get('.cdk-overlay-container .tooltip .tooltip__arrow--left', { force: true }).should('have.length', 1);
        cy.document().trigger('mousemove');
        cy.wait(90);
        cy.get('.cdk-overlay-container .tooltip', { force: true }).should('have.length', 0);
    });
});