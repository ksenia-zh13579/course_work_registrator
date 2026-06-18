import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Incidents from '../../pages/Incidents';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

function getInputByLabel(labelText) {
    const label = screen.getByText(new RegExp(labelText, 'i'));
    return label.nextElementSibling;
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Incidents Page Integration', () => {
    const renderWithProviders = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <Incidents />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    test('отображает список происшествий', async () => {
        renderWithProviders();
        await waitFor(() => {
            expect(screen.getByText('Кража')).toBeInTheDocument();
            expect(screen.getByText('Нападение')).toBeInTheDocument();
        });
    });

    test('создание нового инцидента', async () => {
        renderWithProviders();
        await screen.findByText('Кража');

        fireEvent.click(screen.getByText('+ Добавить новое происшествие'));
        expect(screen.getByText('Добавить новое происшествие')).toBeInTheDocument();

        const typeSelect = getInputByLabel('Тип происшествия');
        const dateInput = getInputByLabel('Дата');
        const descriptionInput = getInputByLabel('Описание');

        fireEvent.change(typeSelect, { target: { value: '1' } });
        fireEvent.change(dateInput, { target: { value: '2025-06-01' } });
        fireEvent.change(descriptionInput, { target: { value: 'Новое происшествие' } });

        fireEvent.click(screen.getByText('Сохранить'));

        await waitFor(() => {
            expect(screen.getByText('Новое происшествие')).toBeInTheDocument();
        });
    });

    test('редактирование происшествия', async () => {
        renderWithProviders();
        await screen.findByText('Кража');

        const editButtons = screen.getAllByText('Редактировать');
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument();
        });

        const descriptionInput = getInputByLabel('Описание');
        fireEvent.change(descriptionInput, { target: { value: 'Обновленное описание' } });

        fireEvent.click(screen.getByText('Сохранить'));

        await waitFor(() => {
            expect(screen.getByText('Обновленное описание')).toBeInTheDocument();
        });
    });

    test('удаление происшествия', async () => {
        renderWithProviders();
        await screen.findByText('Кража');

        const deleteButtons = screen.getAllByText('Удалить');
        fireEvent.click(deleteButtons[0]);
        fireEvent.click(screen.getByText('Подтвердить'));

        await waitFor(() => {
            expect(screen.queryByText('Кража')).not.toBeInTheDocument();
        });
    });

    test('отображение ошибки при неудачном создании', async () => {
        server.use(
            http.post('/api/incidents', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderWithProviders();
        await screen.findByText('Кража');

        fireEvent.click(screen.getByText('+ Добавить новое происшествие'));

        const typeSelect = getInputByLabel('Тип происшествия');
        const dateInput = getInputByLabel('Дата');

        fireEvent.change(typeSelect, { target: { value: '1' } });
        fireEvent.change(dateInput, { target: { value: '2025-06-01' } });

        fireEvent.click(screen.getByText('Сохранить'));

        await waitFor(() => {
            expect(screen.getByText(/Ошибка при создании/i)).toBeInTheDocument();
        });
    });
});