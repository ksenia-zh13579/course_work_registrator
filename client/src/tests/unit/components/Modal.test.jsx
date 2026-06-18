import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../components/Modal/Modal.jsx';

describe('Modal', () => {
    const mockOnClose = vi.fn();

    test('не отображается, когда isOpen=false', () => {
        render(
            <Modal isOpen={false} onClose={mockOnClose} title="Test">
                Content
            </Modal>
        );
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('отображается, когда isOpen=true', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                Content
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('вызывает onClose при клике на крестик', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test">
                Content
            </Modal>
        );
        fireEvent.click(screen.getByRole('button', { name: /Закрыть/i }));
        expect(mockOnClose).toHaveBeenCalled();
    });
});