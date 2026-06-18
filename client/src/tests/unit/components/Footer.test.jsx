import { render, screen } from '@testing-library/react';
import Footer from '../../../components/Footer';

describe('Footer', () => {
    test('отображает информацию об авторе', () => {
        render(<Footer />);
        expect(screen.getByText(/Автор/i)).toBeInTheDocument();
    });
});