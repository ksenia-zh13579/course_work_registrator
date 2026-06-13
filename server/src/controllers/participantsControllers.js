import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';
import { getParticipantById } from '../utils/BDgetters.js';

export const searchParticipants = asyncHandler(async (req, res) => {
    const { q } = req.validatedQuery || req.query;

    const words = q.trim().split(/\s+/);

    const wordConditions = words.map(word => ({
        OR: [
        { surname: { contains: word, mode: 'insensitive' } },
        { name: { contains: word, mode: 'insensitive' } },
        { patronymic: { contains: word, mode: 'insensitive' } },
        ],
    }));

    const where = { AND: wordConditions };

    const data = await prisma.participant.findMany({
        where,
        orderBy: { surname: 'asc' },
    });

    /*
    if (data.length === 0)
        throw new AppError(404, "По данному запросу ничего не найдено.");
    */
    
    res.json({ 
        data
    });
});

export const getParticipants = asyncHandler(async (req, res) => {
    const data = await prisma.participant.findMany({ 
        orderBy: { surname: 'asc' } 
    });

    /*
    if (data.length === 0)
        throw new AppError(404, "Пока не добавлено ни одного участника происшествий.");
    */
    
    res.json({ 
        data
    });
});

export const createParticipant = asyncHandler(async (req, res) => {
    const { surname, name, patronymic, address, crimial_records } = req.body;

    const createdParticipant = await prisma.participant.create({
        data: {
            surname, 
            name, 
            patronymic: patronymic ?? null, 
            address, 
            crimial_records
        }
    });

    res.status(201).json({ data: createdParticipant });
});

export const updateParticipant = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingParticipant = getParticipantById(id);
    if (!existingParticipant) 
        throw new AppError(404, "Участник не найден", [{ id }]);

    const { surname, name, patronymic, address, crimial_records } = req.body;

    const updatedParticipant = await prisma.participant.update({
        where: { participant_id: id },
        data: {
            surname: surname !== undefined? surname: existingParticipant.surname, 
            name: name !== undefined? name: existingParticipant.name, 
            patronymic: patronymic !== undefined? patronymic: existingParticipant.patronymic, 
            address: address !== undefined? address: existingParticipant.address, 
            crimial_records: crimial_records !== undefined? crimial_records: existingParticipant.crimial_records
        }
    });

    res.json({ data: updatedParticipant });
});

export const deleteParticipant = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingParticipant = getParticipantById(id);
    if (!existingParticipant) 
        throw new AppError(404, "Участник не найден", [{ id }]);

    const deletedParticipant = await prisma.participant.delete({
        where: { participant_id: id }
    });

    res.status(204).send();
});