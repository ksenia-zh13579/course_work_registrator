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
        // ИСПРАВЛЕНО: Используем req.reply с заголовками, чтобы Axios распознал 401
        cy.intercept('GET', '/api/profile', (req) => {
            req.reply({
                statusCode: 401,
                body: { message: 'Token expired' },
                headers: { 'content-type': 'application/json' }
            });
        }).as('profile401');

        cy.intercept('POST', '/api/auth/refresh', {
            statusCode: 200,
            body: { accessToken: 'new-access-token' }
        }).as('refreshRequest');

        cy.intercept('GET', '/api/profile', {
            statusCode: 200,
            body: { data: { username: testUser.username, role: 'ADMIN' } }
        }).as('profile200');

        cy.visit('/profile');

        // Ждем, что первый запрос упал с 401
        cy.wait('@profile401');
        
        // Ждем, что сработал механизм refresh
        cy.wait('@refreshRequest');

        // Ждем, что профиль успешно загрузился после обновления токена
        cy.wait('@profile200');
        cy.contains(testUser.username).should('exist');
    });
});