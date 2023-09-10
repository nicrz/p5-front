describe('Session details', () => {
    
    before(() => {
        // Se connecter avec un compte utilisateur
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('ruiz.nico64@gmail.com');
        cy.get('[formcontrolname="password"]').type('Test64170');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
    });

    it('Vérifier l\'affichage correct des informations de session', () => {
        cy.contains('span', 'Detail').click();

        cy.contains('Session').should('be.visible');
        cy.contains('Margot').should('be.visible');
        cy.contains('0 attendees').should('be.visible');
        cy.contains('Description:').should('be.visible');
        cy.contains('Description').should('be.visible');
    });
    
    it('should participate', () => {

        cy.contains('button', 'Participate').should('be.visible').click();
        cy.contains('button', 'Do not participate').should('be.visible');
    });
    
    it('should unparticipate', () => {

        cy.contains('button', 'Do not participate').should('be.visible').click();
        cy.contains('button', 'Participate').should('be.visible');
    });
    
    it('should not have delete button when no admin', () => {

        cy.contains('button', 'Delete').should('not.exist');
    });

    it('should have delete button', () => {
        // Se connecter avec un utilisateur admin
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
        cy.contains('span', 'Detail').click();

        cy.contains('button', 'Delete').should('be.visible').click();
        cy.on('window:confirm', () => true);
        cy.location('pathname').should('eq', '/sessions');
        cy.get('.mat-simple-snackbar').should('be.visible').contains('Session deleted !');
    });
});