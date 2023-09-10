describe('Form Component', () => {

    before(() => {
        // Se connecter avec un utilisateur admin
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
    });
  
    it('should create an session', () => {
        cy.get('button[routerLink="create"]').should('be.visible');
        cy.get('button[routerLink="create"]').click();
        cy.wait(500); 
  
        cy.get('[formcontrolname="name"]').type('Nouvelle session');
        cy.get('[formcontrolname="date"]').type('2023-08-30');
        cy.get('[formcontrolname="teacher_id"]').click();
        cy.get('mat-option').contains('Margot').click();
        cy.get('[formcontrolname="description"]').type('Description de la nouvelle session');
  
        cy.get('button[type="submit"]').click();
  
        cy.location('pathname').should('eq', '/sessions');
  
        cy.get('.mat-simple-snackbar').should('be.visible').contains('Session created !');
    });

    it('Should display an error without all information', () => {
        cy.get('button[routerLink="create"]').should('be.visible');
        cy.get('button[routerLink="create"]').click();
        cy.wait(500); 
  
        cy.get('[formcontrolname="name"]').type('Nouvelle session');
        cy.get('[formcontrolname="date"]').type('2023-08-30');
        cy.get('[formcontrolname="description"]').type('Description de la nouvelle session');
  
        cy.get('button[type="submit"]').should('be.disabled');
    });
  
    it('should update session', () => {
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(500); 
        cy.contains('span', 'Edit').click();
        cy.wait(500); 
  
        cy.get('[formcontrolname="name"]').clear().type('Session mise à jour');
        cy.get('[formcontrolname="date"]').clear().type('2023-08-31');
        cy.get('[formcontrolname="teacher_id"]').click();
        cy.get('mat-option').contains('Margot').click();
        cy.get('[formcontrolname="description"]').clear().type('Description mise à jour de la session');
  
        cy.get('button[type="submit"]').click();
        cy.location('pathname').should('eq', '/sessions');
        cy.get('.mat-simple-snackbar').should('be.visible').contains('Session updated !');
    });

    it('should update session with an error', () => {
        cy.get('span.ml1').contains('Edit').should('be.visible');
        cy.get('span.ml1').contains('Edit').click();
        cy.wait(500); 
  
        cy.get('[formcontrolname="name"]').clear();
        cy.get('[formcontrolname="date"]').clear().type('2023-08-01');
        cy.get('[formcontrolname="teacher_id"]').click();
        cy.get('mat-option').contains('Margot').click();
        cy.get('[formcontrolname="description"]').clear().type('Description mise à jour de la session');
    
        cy.get('button[type="submit"]').should('be.disabled');
    });
});