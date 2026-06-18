import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Registration from '../../pages/Registration';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

// Вспомогательная функция для поиска input по тексту лейбла
function getInputByLabel(labelText) {
  const label = screen.getByText(new RegExp(labelText, 'i'));
  return label.nextElementSibling;
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Registration Integration', () => {
    const renderWithProviders = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <Registration />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    test('отображает форму регистрации', () => {
        renderWithProviders();
        expect(screen.getByText(/Логин/i)).toBeInTheDocument();
        expect(screen.getByText(/Имя/i)).toBeInTheDocument();
        expect(screen.getByText(/Фамилия/i)).toBeInTheDocument();
        expect(screen.getByText(/Отчество/i)).toBeInTheDocument();
        expect(screen.getByText(/Пароль/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Отправить/i })).toBeInTheDocument();
    });

    test('выполняет регистрацию при корректных данных', async () => {
        renderWithProviders();

        const usernameInput = getInputByLabel('Логин');
        const nameInput = getInputByLabel('Имя');
        const surnameInput = getInputByLabel('Фамилия');
        const patronymicInput = getInputByLabel('Отчество');
        const passwordInput = getInputByLabel('Пароль');

        fireEvent.change(usernameInput, { target: { value: 'newuser' } });
        fireEvent.change(nameInput, { target: { value: 'Новый' } });
        fireEvent.change(surnameInput, { target: { value: 'Пользователь' } });
        fireEvent.change(patronymicInput, { target: { value: 'Тестович' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Отправить/i }));

        await waitFor(() => {
            expect(window.location.pathname).toBe('/login');
        });
    });

    test('отображает ошибку при неудачной регистрации (409)', async () => {
        server.use(
            http.post('/api/auth/register', () => {
                return new HttpResponse(
                    JSON.stringify({ message: 'Пользователь уже существует' }),
                    { status: 409 }
                );
            })
        );

        renderWithProviders();

        const usernameInput = getInputByLabel('Логин');
        const nameInput = getInputByLabel('Имя');
        const surnameInput = getInputByLabel('Фамилия');
        const passwordInput = getInputByLabel('Пароль');

        fireEvent.change(usernameInput, { target: { value: 'existing' } });
        fireEvent.change(nameInput, { target: { value: 'Существ' } });
        fireEvent.change(surnameInput, { target: { value: 'Пользователь' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Отправить/i }));

        await waitFor(() => {
            expect(screen.getByText(/Пользователь уже существует/i)).toBeInTheDocument();
        });
    });
});