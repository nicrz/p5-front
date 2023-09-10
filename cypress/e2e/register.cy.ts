describe('Register', () => {
    it('creates an account', () => {
      const validFirstName = 'test';
      const validLastName = 'test2';
      const validEmail = 'test63@gmail.com';
      const validPassword = 'password';
  
      cy.visit('/register');
      cy.get('[formcontrolname="firstName"]').type(validFirstName);
      cy.get('[formcontrolname="lastName"]').type(validLastName);
      cy.get('[formcontrolname="email"]').type(validEmail);
      cy.get('[formcontrolname="password"]').type(validPassword);
      cy.get('button[type="submit"]').click();
      cy.wait(500);

      cy.get('[formcontrolname="email"]').should('be.visible').type('test64@gmail.com');
      cy.get('[formcontrolname="password"]').type('password');
      cy.get('button[type="submit"]').click();

    });
  });
  