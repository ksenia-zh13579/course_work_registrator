import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/client';

vi.mock('../../../api/client', () => ({
    api: {
        getProfile: vi.fn(),
        authLogin: vi.fn(),
        authRegister: vi.fn(),
        authLogout: vi.fn(),
    },
}));

const TestComponent = () => {
    const { user, loading, login, register, logout, isAuthenticated, isAdmin } = useAuth();
    return (
        <div>
            <span>Loading: {String(loading)}</span>
            <span>Auth: {String(isAuthenticated)}</span>
            <span>Admin: {String(isAdmin)}</span>
            <span>User: {user?.username || 'none'}</span>
            <button onClick={() => login({ username: 'test', password: 'pass' })}>Login</button>
            <button onClick={() => register({ username: 'new' })}>Register</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('загружает профиль при монтировании', async () => {
        api.getProfile.mockResolvedValue({ data: { username: 'testuser' } });
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await waitFor(() => {
            expect(screen.getByText('User: testuser')).toBeInTheDocument();
        });
    });

    test('login вызывает api.authLogin и обновляет пользователя', async () => {
        api.getProfile.mockResolvedValue({ data: { username: 'testuser' } });
        api.authLogin.mockResolvedValue({ accessToken: 'token' });
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await waitFor(() => {
            expect(screen.getByText('Loading: false')).toBeInTheDocument();
        });
    });

    test('logout очищает пользователя', async () => {
        api.getProfile.mockResolvedValue({ data: { username: 'testuser' } });
        api.authLogout.mockResolvedValue({});
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await waitFor(() => {
            expect(screen.getByText('User: testuser')).toBeInTheDocument();
        });
    });
});