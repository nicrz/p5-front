describe('Registration Form', () => {
    
    before(() => {
        // Se connecter avec un utilisateur admin
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
    });

    it('Afficher la liste des sessions', () => {
        cy.get('.list mat-card-title').should('contain', 'Rentals available');
        cy.get('.item').should('have.length.greaterThan', 0);
    });

    it('Vérifier le bouton "Create" pour un utilisateur admin', () => {
        cy.get('button[routerLink="create"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/sessions/create');
    });

    it('Vérifier le bouton "Edit" pour un utilisateur admin sur une session spécifique', () => {
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
        cy.get('span.ml1').contains('Edit').should('be.visible').click();
        cy.location('pathname').should('include', '/sessions/update/');
    });

    it('Vérifier la navigation vers la page de détails', () => {
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
        cy.get('span').contains('Detail').should('be.visible').click();
        cy.location('pathname').should('include', '/sessions/detail/');
    });

    it('Vérifier que le bouton "Create" et "Update" n\'est pas visible pour un utilisateur non-admin', () => {
        // Se connecter avec un utilisateur non-admin
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('ruiz.nico64@gmail.com');
        cy.get('[formcontrolname="password"]').type('Test64170');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
        cy.get('button[routerLink="create"]').should('not.exist');
        cy.get('span.ml1').contains('Edit').should('not.exist');
    });
});