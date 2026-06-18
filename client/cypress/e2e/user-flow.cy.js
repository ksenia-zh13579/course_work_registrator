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
        cy.get('input[name="username"]').type(testUser.username);
        cy.get('input[name="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');

        // 3. Создание инцидента
        cy.visit('/incidents');
        cy.contains('+ Добавить новое происшествие').click();
        // В модалке поля по лейблам
        cy.contains('label', 'Дата').next('input').type('2025-06-01');
        cy.contains('label', 'Тип происшествия').next('select').select('1'); // предположим тип с id 1
        cy.contains('label', 'Описание').next('input').type('Тестовое описание происшествия');
        cy.get('button').contains('Сохранить').click();
        cy.contains('Тестовое описание происшествия').should('exist');

        // 4. Редактирование происшествия
        cy.contains('Тестовое описание происшествия')
        .parent()
        .contains('Редактировать')
        .click();
        cy.contains('label', 'Описание').next('input').clear().type('Обновленное описание');
        cy.get('button').contains('Сохранить').click();
        cy.contains('Обновленное описание').should('exist');

        // 5. Выход
        cy.contains('Выйти').click();
        cy.contains('Вход').should('exist');
    });
});