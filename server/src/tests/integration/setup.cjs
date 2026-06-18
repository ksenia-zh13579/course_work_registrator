const dotenv = require('dotenv');
const path = require('path');

const envTestPath = path.join(__dirname, '../../.env.test'); 

dotenv.config({ 
    path: envTestPath, 
    override: true // КРИТИЧЕСКИ ВАЖНО: принудительно перезаписывает DATABASE_URL
});

const { execSync } = require('child_process');
const { prisma } = require('../../client.js');

beforeAll(async () => {
    const serverRoot = path.join(__dirname, '../../..');
    
    // 2. Явно передаем process.env, чтобы prisma migrate подхватил новый DATABASE_URL
    execSync('npx prisma migrate deploy', {
        cwd: serverRoot,
        stdio: 'inherit',
        env: process.env 
    });
});

afterEach(async () => {
    try {
        const tables = await prisma.$queryRawUnsafe(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations';"
        );
        
        if (tables.length > 0) {
            const tableNames = tables.map(t => t.tablename);
            await prisma.$executeRawUnsafe(
                `TRUNCATE TABLE ${tableNames.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`
            );
        }
    } catch (error) {
        // Игнорируем ошибки, если таблицы еще не созданы или уже очищены
    }
});