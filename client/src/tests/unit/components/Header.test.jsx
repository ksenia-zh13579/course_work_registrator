import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/Header';
import { useAuth } from '../../../context/AuthContext';

// Мокаем хук useAuth
vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
    test('отображает ссылку на вход для неавторизованного пользователя', () => {
        useAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
        });
        renderWithRouter(<Header />);
        expect(screen.getByText('Вход')).toBeInTheDocument();
        expect(screen.getByText('Регистрация')).toBeInTheDocument();
    });

    test('отображает имя пользователя для авторизованного', () => {
        useAuth.mockReturnValue({
            user: { username: 'testuser' },
            isAuthenticated: true,
            isAdmin: false,
        });
        renderWithRouter(<Header />);
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    test('отображает админ-ссылку для администратора', () => {
        useAuth.mockReturnValue({
            user: { username: 'admin', role: 'ADMIN' },
            isAuthenticated: true,
            isAdmin: true,
        });
        renderWithRouter(<Header />);
        expect(screen.getByText('Участники')).toBeInTheDocument();
    });
});