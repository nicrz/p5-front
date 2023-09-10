describe('Register', () => {
    it('creates an account', () => {
      const validFirstName = 'test';
      const validLastName = 'test2';
      const validEmail = 'test71@gmail.com';
      const validPassword = 'password';
  
      cy.visit('/register');
      cy.get('[formcontrolname="firstName"]').type(validFirstName);
      cy.get('[formcontrolname="lastName"]').type(validLastName);
      cy.get('[formcontrolname="email"]').type(validEmail);
      cy.get('[formcontrolname="password"]').type(validPassword);
      cy.get('button[type="submit"]').click();
      cy.wait(1000);

      cy.get('[formcontrolname="email"]').should('be.visible').type('test71@gmail.com');
      cy.get('[formcontrolname="password"]').type('password');
      cy.get('button[type="submit"]').click();

    });
  });
  
describe('Login spec', () => {
    it('Login successfull', () => {
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true
        },
      })
  
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []).as('session')
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })
  });

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
      const validEmail = 'testsupp6@gmail.com';
      const validPassword = 'password';
  
      cy.visit('/register');
      cy.get('[formcontrolname="firstName"]').type(validFirstName);
      cy.get('[formcontrolname="lastName"]').type(validLastName);
      cy.get('[formcontrolname="email"]').type(validEmail);
      cy.get('[formcontrolname="password"]').type(validPassword);
      cy.get('button[type="submit"]').click();
      cy.wait(500);

      cy.get('[formcontrolname="email"]').type('testsupp6@gmail.com');
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

  describe('Sessions list', () => {
    
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
        cy.wait(2000); 
        cy.get('span.ml1').contains('Edit').should('be.visible').click();
        cy.location('pathname').should('include', '/sessions/update/');
    });

    it('Vérifier la navigation vers la page de détails', () => {
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('yoga@studio.com');
        cy.get('[formcontrolname="password"]').type('test!1234');
        cy.get('button[type="submit"]').click();
        cy.wait(1000); 
        cy.get('span.ml1').contains('Detail').should('be.visible').click();
        cy.location('pathname').should('include', '/sessions/detail/');
    });

    it('Vérifier que le bouton "Create" et "Update" n\'est pas visible pour un utilisateur non-admin', () => {
        // Se connecter avec un utilisateur non-admin
        cy.visit('/login');
        cy.get('[formcontrolname="email"]').type('ruiz.nico64@gmail.com');
        cy.get('[formcontrolname="password"]').type('Test64170');
        cy.get('button[type="submit"]').click();
        cy.wait(2000); 
        cy.get('button[routerLink="create"]').should('not.exist');
        cy.get('span.ml1').contains('Edit').should('not.exist');
    });
});

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