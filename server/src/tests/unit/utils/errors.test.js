import { AppError } from '../../../utils/errors.js';

describe('AppError', () => {
    test('должен создавать экземпляр с правильными свойствами', () => {
        const error = new AppError(404, 'Not found', ['detail1'], 'CUSTOM_CODE');
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(404);
        expect(error.message).toBe('Not found');
        expect(error.details).toEqual(['detail1']);
        expect(error.code).toBe('CUSTOM_CODE');
    });

    test('должен иметь значения по умолчанию для details и code', () => {
        const error = new AppError(400, 'Bad request');
        expect(error.details).toEqual([]);
        expect(error.code).toBeNull();
    });
});