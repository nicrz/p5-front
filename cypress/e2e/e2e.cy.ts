describe('yoga-app', () => {

  it('register', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {}).as('register');

    cy.get('input[formControlName=firstName]').type('Nicolas');
    cy.get('input[formControlName=lastName]').type('Ruiz');
    cy.get('input[formControlName=email]').type('test@gmail.com');
    cy.get('input[formControlName=password]').type('Test64170{enter}{enter}');

    cy.wait('@register');

    cy.url().should('include', '/login');
  });

  it('sessions list', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', { body: { id: 1, username: 'userName', firstName: 'firstName', lastName: 'lastName', admin: true } }).as('login');
    cy.intercept('GET', '/api/session', { body: [{ id: 1, name: 'Session 1', description: 'Description 1', date: new Date(), createdAt: new Date(), updatedAt: new Date(), teacher_id: 1, users: [1, 2] }, { id: 2, name: 'Session 2', description: 'Description 2', date: new Date(), createdAt: new Date(), updatedAt: new Date(), teacher_id: 2, users: [1, 2] }] }).as('getSession');
    
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`${'test!1234'}{enter}{enter}`);
    
    cy.wait(['@login', '@getSession']);
    
    cy.url().should('include', '/sessions');
  });

  it('session details', () => {
    cy.intercept('GET', '/api/session/1', { body: { id: 1, name: 'Session 1', description: 'Description 1', date: new Date(), createdAt: new Date(), updatedAt: new Date(), teacher_id: 1, users: [1, 2, 3] } }).as('session');
    cy.intercept('GET', '/api/teacher/1', { body: { id: 1, lastName: 'Eric', firstName: 'Legba', createdAt: new Date(), updatedAt: new Date() } }).as('teacher');
    cy.intercept('GET', '/api/session', { body: [{ id: 1, name: 'Session 1', description: 'Description 1', date: new Date(), createdAt: new Date(), updatedAt: new Date(), teacher_id: 1, users: [1, 2, 3] }, { id: 2, name: 'Session 2', description: 'Description 2', date: new Date(), createdAt: new Date(), updatedAt: new Date(), teacher_id: 1, users: [1, 2, 3] }] }).as('sessions');
    
    cy.get('mat-card-actions button').first().click();
    
    cy.url().should('include', '/sessions/detail/1');
    
    cy.get('h1').contains('Session 1');
    cy.get('div.description').contains('Description 1');
    cy.get('mat-card-subtitle').contains('Legba ERIC');
  });

  it('check me informations', () => {
    cy.intercept('GET', '/api/user/1', { body: { id: 1, email: 'yoga@studio.com', lastName: 'Admin', firstName: 'Test', admin: true, password: 'Test64170', createdAt: new Date() } }).as('getUser');
    
    cy.get('.link').contains('Account').click();
    
    cy.url().should('include', '/me');

    cy.contains('h1', 'User information').should('be.visible');
    cy.contains('Name: Test ADMIN').should('be.visible');
    cy.contains('Email: yoga@studio.com').should('be.visible');
    cy.contains('You are admin').should('exist');
    cy.contains('button', 'Detail').should('not.exist');

    cy.wait('@getUser');
  });

  it('login', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', { body: { id: 1, username: 'userName', firstName: 'firstName', lastName: 'lastName', admin: true } }).as('login');
    cy.intercept('GET', '/api/session', []).as('session');
    
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
    
    cy.wait('@login');
    cy.wait('@session');
    
    cy.url().should('include', '/sessions');
  });

  it('create session', () => {
    cy.intercept('GET', '/api/teacher', { body: [{ id: 1, lastName: 'Eric', firstName: 'Legba', createdAt: new Date(), updatedAt: new Date() }, { id: 2, lastName: 'Kevin', firstName: 'Niel', createdAt: new Date(), updatedAt: new Date() }] }).as('getTeachers');
    
    cy.get('button').contains('Create').click();
    
    cy.url().should('include', '/sessions/create');
    cy.intercept('POST', '/api/session', { body: { id: 3, name: 'New session', description: 'New session description', teacher: 1, users: [] } }).as('createSession');
    cy.intercept('GET', '/api/session', { body: [{ id: 3, name: 'New session', description: 'New session description', teacher: 1, users: [] }] }).as('getSessions');
    
    cy.get('input[formControlName=name]').type('New session');
    cy.get('input[formControlName=date]').type('2024-02-02');
    cy.get('textarea[formControlName=description]').type('New session description');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Legba Eric').click();
    cy.get('button').contains('Save').click();
    
    cy.wait(['@getTeachers', '@createSession', '@getSessions']);
  });

  it('new session details', () => {
    cy.get('.item').should('have.length', 1);
    cy.get('.item').contains('New session').should('exist');
  });

  it('session details', () => {
    cy.intercept('GET', '/api/session/3', { body: { id: 3, name: 'New session', description: 'New session description', teacher: 1, users: [] } }).as('session');
    cy.intercept('GET', '/api/teacher/1', { body: { id: 1, lastName: 'Legba', firstName: 'Eric', createdAt: new Date(), updatedAt: new Date() } }).as('teacher');
    
    cy.get('mat-card').last().contains('Detail').last().click();
    
    cy.url().should('include', '/sessions/detail/3');
    
    cy.get('div').contains('New session description').should('exist');
  });

  it("delete session", () => {
    cy.intercept('DELETE', '/api/session/3', {});
    cy.intercept('GET', '/api/session', { body: [{ id: 1, name: 'New session', description: 'New session description', teacher_id: 1, users: [1, 2, 3] }, { id: 2, name: 'New session 2', description: 'New session description 2', teacher_id: 1, users: [1, 2, 4] }] }).as('getSessions');
    
    cy.visit('/sessions');
    
    cy.get('button').contains('Delete').click();
    
    cy.wait(['@deleteSession', '@getSessions']);
    
    cy.url().should('contain', '/sessions');

    cy.get('.item').should('have.length', 2);
    cy.get('.item').contains('New session').should('not.exist');
  });
});
