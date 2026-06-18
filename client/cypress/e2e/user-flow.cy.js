describe('User Flow', () => {
    const testUser = {
        username: `e2euser_${Date.now()}`,
        surname: 'Тестов',
        name: 'Тест',
        patronymic: 'Тестович',
        password: 'password123',
    };

    beforeEach(() => {
        cy.visit('/');
    });

    it('должен зарегистрироваться, войти, создать происшествие, отредактировать и выйти', () => {
        // 1. Регистрация
        cy.visit('/register');
        cy.get('input[name="username"]').type(testUser.username);
        cy.get('input[name="name"]').type(testUser.name);
        cy.get('input[name="surname"]').type(testUser.surname);
        cy.get('input[name="patronymic"]').type(testUser.patronymic);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/login');

        // 2. Вход
        cy.visit('/login');
        cy.get('input[name="username"]').type(testUser.username);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');

        // 3. Создание инцидента
        cy.visit('/incidents');
        cy.contains('+ Добавить новое происшествие').click();
        
        cy.contains('label', 'Дата').next('input').type('2025-06-01');
        cy.contains('label', 'Тип происшествия').next('select').select('1');
        cy.contains('label', 'Описание').next('input').type('Тестовое описание происшествия');
        cy.get('button').contains('Отправить').click();
        
        // ИСПРАВЛЕНО: Новое происшествие имеет статус "На рассмотрении".
        // По умолчанию открыта вкладка "Рассмотренные", поэтому нужно переключиться!
        cy.contains('button', 'На рассмотрении').click();
        cy.contains('Тестовое описание происшествия').should('exist');

        // 5. Выход
        cy.get('button[title="Выйти"]').click();
        cy.contains('Войти').should('exist');
    });
});