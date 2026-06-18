describe('Token Refresh Flow', () => {
    const testUser = {
        username: `refreshuser_${Date.now()}`,
        surname: 'Тестов',
        name: 'Тест',
        password: 'password123',
    };

    beforeEach(() => {
        cy.visit('/register');
        cy.get('input[name="username"]').type(testUser.username);
        cy.get('input[name="name"]').type(testUser.name);
        cy.get('input[name="surname"]').type(testUser.surname);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();

        cy.visit('/login');
        cy.get('input[name="username"]').type(testUser.username);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();
    });

    it('должен автоматически обновить токен при истечении', () => {
        cy.intercept('GET', '/api/profile', (req) => {
            req.reply({
                statusCode: 401,
                body: { message: 'Token expired' },
            });
        }).as('expiredRequest');

        cy.intercept('POST', '/api/auth/refresh', {
            statusCode: 200,
            body: { accessToken: 'new-access-token' },
        }).as('refreshRequest');

        cy.visit('/profile');
        cy.wait('@refreshRequest');
        cy.contains('Профиль').should('exist');
    });
});