import request from 'supertest';
import { app } from '../../server.js';

describe('Profile Integration', () => {
    let accessToken;

    beforeEach(async () => {
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            surname: 'Тестов',
            name: 'Тест',
            patronymic: 'Тестович',
            password: 'password123',
        });
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });
        accessToken = loginRes.body.accessToken;
    });

    describe('GET /api/profile', () => {
        test('должен вернуть профиль пользователя', async () => {
            const response = await request(app)
                .get('/api/profile')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('username', 'testuser');
        });

        test('должен вернуть 401 без токена', async () => {
            const response = await request(app).get('/api/profile');
            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /api/profile', () => {
        test('должен обновить профиль', async () => {
            const response = await request(app)
                .patch('/api/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    surname: 'НовыйТестов',
                    old_password: 'password123',
                    new_password: 'newPassword123',
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('surname', 'НовыйТестов');
        });
    });
});