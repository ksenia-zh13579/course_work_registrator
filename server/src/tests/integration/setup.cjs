const dotenv = require('dotenv');
const { execSync } = require('child_process');
const path = require('path');
const { prisma } = require('../../client.js');

dotenv.config({ path: './.env.test' });

beforeAll(async () => {
    // (Опционально) удаляем старую тестовую БД
    try {
        execSync('del test.db', { cwd: path.join(__dirname, '../..'), stdio: 'ignore' });
    } catch (_) {}

    // Применяем миграции к тестовой БД
    execSync('npx prisma migrate deploy', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'inherit',
    });
});

afterEach(async () => {
    // Очищаем все таблицы (кроме системных)
    const tablenames = await prisma.$queryRaw`
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        AND name NOT LIKE 'sqlite_%' 
        AND name NOT LIKE '_prisma_migrations';
    `;
    for (const { name } of tablenames) {
        await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
        await prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name="${name}";`);
    }
});

afterAll(async () => {
    await prisma.$disconnect();
});