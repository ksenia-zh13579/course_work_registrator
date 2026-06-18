import axios from 'axios';
import { api, apiClient } from '../../../api/client';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('authRegister', () => {
        test('отправляет POST запрос на /auth/register', async () => {
            mockedAxios.post.mockResolvedValue({ data: { accessToken: 'token' } });
            await api.authRegister({ username: 'test', password: 'pass' });
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', { username: 'test', password: 'pass' });
        });
    });

    describe('authLogin', () => {
            test('отправляет POST запрос на /auth/login', async () => {
            mockedAxios.post.mockResolvedValue({ data: { accessToken: 'token' } });
            await api.authLogin({ username: 'test', password: 'pass' });
            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', { username: 'test', password: 'pass' });
        });
    });

    describe('authLogout', () => {
        test('очищает токен и отправляет DELETE запрос', async () => {
            localStorage.setItem('accessToken', 'oldToken');
            mockedAxios.delete.mockResolvedValue({ data: {} });
            await api.authLogout();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(mockedAxios.delete).toHaveBeenCalledWith('/auth/logout');
        });
    });
});