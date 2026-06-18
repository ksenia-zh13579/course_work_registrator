describe('Admin Flow', () => {
    const adminUser = {
        username: 'admin1',
        password: 'adminpass',
    };

    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[name="username"]').type(adminUser.username);
        cy.get('input[name="password"]').type(adminUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');
    });

    it('должен создать, отредактировать и удалить участника', () => {
        cy.visit('/participants');

        // Создание участника
        cy.contains('+ Добавить информацию об участнике').click();
        cy.contains('label', 'Фамилия').next('input').type('Тестов');
        cy.contains('label', 'Имя').next('input').type('Участник');
        cy.contains('label', 'Адрес').next('input').type('ул. Тестовая, 1');
        cy.contains('label', 'Количество судимостей').next('select').select('0');
        cy.get('button').contains('Отправить').click();
        
        // ИСПРАВЛЕНО: Ищем просто фамилию, так как ФИО в разных ячейках
        cy.contains('Тестов').should('exist');

        // Редактирование участника
        // ИСПРАВЛЕНО: Ищем кнопку внутри всей строки таблицы
        cy.contains('div.table-row', 'Тестов').contains('Редактировать').click();
        cy.contains('label', 'Фамилия').next('input').clear().type('ТестовИзм');
        cy.get('button').contains('Отправить').click();
        cy.contains('ТестовИзм').should('exist');

        // Удаление участника
        cy.on('window:confirm', () => true); // Мокаем нативный confirm
        cy.contains('div.table-row', 'ТестовИзм').contains('Удалить').click();
        cy.contains('ТестовИзм').should('not.exist');
    });

    it('должен управлять статусами участников происшествий', () => {
        cy.visit('/involvements');

        // Создание статуса
        cy.contains('+ Добавить новый статус участника').click();
        cy.contains('label', 'ID происшествия').next('input').type('1');
        cy.contains('label', 'ID участника').next('input').type('1');
        cy.contains('label', 'Статус участника').next('select').select('SUSPECT');
        cy.get('button').contains('Отправить').click();
        cy.contains('Подозреваемый').should('exist');

        // Редактирование статуса
        // ИСПРАВЛЕНО: Ищем кнопку внутри всей строки таблицы
        cy.contains('div.table-row', 'Подозреваемый').contains('Редактировать').click();
        cy.contains('label', 'Статус участника').next('select').select('VICTIM');
        cy.get('button').contains('Отправить').click();
        cy.contains('Потерпевший').should('exist');
    });
});