import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute/ProtectedRoute.jsx';
import { useAuth } from '../../../context/AuthContext';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
    test('редиректит на /signin для неавторизованного пользователя', () => {
        useAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            loading: false,
        });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/signin" element={<div>Login Page</div>} />
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <div>Protected</div>
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('показывает дочерний компонент для авторизованного пользователя', () => {
        useAuth.mockReturnValue({
            user: { username: 'test' },
            isAuthenticated: true,
            loading: false,
        });
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <div>Protected Content</div>
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});