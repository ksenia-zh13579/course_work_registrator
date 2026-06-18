import request from 'supertest';
import { app } from '../../server.js';

describe('Auth Integration', () => {
    const testUser = {
        username: 'testuser',
        surname: 'Тестов',
        name: 'Тест',
        patronymic: 'Тестович',
        password: 'password123',
    };

    describe('POST /api/auth/register', () => {
        test('должен зарегистрировать нового пользователя', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body.user).toHaveProperty('username', 'testuser');
            expect(response.headers['set-cookie']).toBeDefined();
        });

        test('должен вернуть 409 при регистрации существующего пользователя', async () => {
            await request(app).post('/api/auth/register').send(testUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(testUser);
        });

        test('должен выполнить вход с правильными данными', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: testUser.username, password: testUser.password });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        });

        test('должен вернуть 401 при неверном пароле', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: testUser.username, password: 'wrong' });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/refresh', () => {
        let refreshToken;

        beforeEach(async () => {
            const registerRes = await request(app).post('/api/auth/register').send(testUser);
            const cookie = registerRes.headers['set-cookie'][0];
            refreshToken = cookie.split(';')[0].split('=')[1];
        });

        test('должен обновить access token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .set('Cookie', [`refreshToken=${refreshToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        });

        test('должен вернуть 401 при отсутствии refresh token', async () => {
            const response = await request(app).post('/api/auth/refresh');
            expect(response.status).toBe(401);
        });
    });
});