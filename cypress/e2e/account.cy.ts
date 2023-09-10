describe('Account', () => {
    it('displays user information and admin status', () => {
      cy.visit('/login');
      cy.get('[formcontrolname="email"]').type('yoga@studio.com');
      cy.get('[formcontrolname="password"]').type('test!1234');
      cy.get('button[type="submit"]').click();
      cy.wait(500);
  
      cy.contains('span', 'Account').click();
      cy.location('pathname').should('eq', '/me');
  
      cy.contains('h1', 'User information').should('be.visible');
      cy.contains('Name: Admin').should('be.visible');
      cy.contains('Email: yoga@studio.com').should('be.visible');
      cy.contains('You are admin').should('exist');
      cy.contains('button', 'Detail').should('not.exist');
    });
  
    it('creates and deletes an account', () => {
      const validFirstName = 'test';
      const validLastName = 'test2';
      const validEmail = 'testsupp5@gmail.com';
      const validPassword = 'password';
  
      cy.visit('/register');
      cy.get('[formcontrolname="firstName"]').type(validFirstName);
      cy.get('[formcontrolname="lastName"]').type(validLastName);
      cy.get('[formcontrolname="email"]').type(validEmail);
      cy.get('[formcontrolname="password"]').type(validPassword);
      cy.get('button[type="submit"]').click();
      cy.wait(500);

      cy.get('[formcontrolname="email"]').type('testsupp5@gmail.com');
      cy.get('[formcontrolname="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.wait(500);

      cy.contains('span', 'Account').click();
      cy.location('pathname').should('eq', '/me');
  
      cy.contains('button', 'Detail').should('be.visible');
      cy.contains('button', 'Detail').click();
      cy.on('window:confirm', () => true);
      cy.wait(500);
  
      cy.location('pathname').should('eq', '/');
      cy.contains('.mat-simple-snackbar', 'Your account has been deleted !').should('be.visible');
    });
  });