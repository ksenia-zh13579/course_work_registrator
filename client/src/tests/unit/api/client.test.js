import { api } from '../../../api/client.js';
import axios from 'axios';

// vi.hoisted позволяет объявить переменную, которая будет доступна внутри vi.mock
const { mockAxiosInstance } = vi.hoisted(() => {
    return {
        mockAxiosInstance: {
            post: vi.fn(),
            get: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
            defaults: { headers: { common: {} } },
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        }
    };
});

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
}));

describe('API Client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('authRegister', () => {
        test('отправляет POST запрос на /auth/register', async () => {
            mockAxiosInstance.post.mockResolvedValue({ data: { accessToken: 'token' } });
            await api.authRegister({ username: 'test', password: 'pass' });
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', { username: 'test', password: 'pass' });
        });
    });

    describe('authLogin', () => {
        test('отправляет POST запрос на /auth/login', async () => {
            mockAxiosInstance.post.mockResolvedValue({ data: { accessToken: 'token' } });
            await api.authLogin({ username: 'test', password: 'pass' });
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', { username: 'test', password: 'pass' });
        });
    });

    describe('authLogout', () => {
        test('очищает токен и отправляет DELETE запрос', async () => {
            localStorage.setItem('accessToken', 'oldToken');
            mockAxiosInstance.delete.mockResolvedValue({ data: {} });
            await api.authLogout();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/auth/logout');
        });
    });
});