import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import SignIn from '../../pages/SignIn';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

function getInputByLabel(labelText) {
    const label = screen.getByText(new RegExp(labelText, 'i'));
    return label.nextElementSibling;
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SignIn Integration', () => {
    const renderWithProviders = () => {
        return render(
        <BrowserRouter>
            <AuthProvider>
            <SignIn />
            </AuthProvider>
        </BrowserRouter>
        );
    };

    test('отображает форму входа', () => {
        renderWithProviders();
        expect(screen.getByText(/Логин/i)).toBeInTheDocument();
        expect(screen.getByText(/Пароль/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
    });

    test('выполняет вход при корректных данных', async () => {
        renderWithProviders();

        const usernameInput = getInputByLabel('Логин');
        const passwordInput = getInputByLabel('Пароль');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

        await waitFor(() => {
        expect(window.location.pathname).toBe('/');
        });
    });

    test('отображает ошибку при неверных данных', async () => {
        server.use(
        http.post('/api/auth/login', () => {
            return new HttpResponse(
            JSON.stringify({ message: 'Неверный логин или пароль' }),
            { status: 401 }
            );
        })
        );

        renderWithProviders();

        const usernameInput = getInputByLabel('Логин');
        const passwordInput = getInputByLabel('Пароль');

        fireEvent.change(usernameInput, { target: { value: 'wrong' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });

        fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

        await waitFor(() => {
        expect(screen.getByText(/Неверный логин или пароль/i)).toBeInTheDocument();
        });
    });
});