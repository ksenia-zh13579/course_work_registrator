import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';
import { getInvolvementById } from '../utils/BDgetters.js';

export const searchInvolvements = asyncHandler(async (req, res) => {
    const { q } = req.validatedQuery || req.query;
    
    if (!q || !q.trim()) return res.json({ data: [] });

    const words = q.trim().split(/\s+/).filter(Boolean);

    const participantWordConditions = words.map(word => ({
        OR: [
            { surname: { contains: word, mode: 'insensitive' } },
            { name: { contains: word, mode: 'insensitive' } },
            { patronymic: { contains: word, mode: 'insensitive' } },
        ],
    }));

    const incidentWordConditions = words.map(word => ({ 
        name: { contains: word, mode: 'insensitive' } 
    }));

    const involvements = await prisma.involvement.findMany({
        where: {
            OR: [
                { participant: { OR: participantWordConditions } },
                { incident: { incident_type: { OR: incidentWordConditions } } }
            ]
        },
        include: {
            incident: { 
                select: {
                    incident_type: { select: {name: true} },
                    date: true
                } 
            },
            participant: {
                select: {
                    surname: true,
                    name: true,
                    patronymic: true
                }
            },
        },
        orderBy: { incident: { date: 'asc'} },
    });

    /*
    if (involvements.length === 0)
        throw new AppError(404, "По данному запросу ничего не найдено.");
    */

    const data = involvements.map(involvement => ({
        involvement_id: involvement.involvement_id,
        incident_id: involvement.incident.incident_id,
        incident_type: involvement.incident.incident_type.name,
        participant_id: involvement.participant_id,
        full_name: `${involvement.participant.surname} ${involvement.participant.name[0]}. ${involvement.participant.patronymic? involvement.participant.patronymic[0] + '.' : ''}`,
        status: involvement.status
    }));

    res.json({ 
        data
    });
});

export const getInvolvements = asyncHandler(async (req, res) => {
    const involvements = await prisma.involvement.findMany({
        include: {
            incident: { 
                select: {
                    incident_type: { select: {name: true} },
                    date: true
                } 
            },
            participant: {
                select: {
                    surname: true,
                    name: true,
                    patronymic: true
                }
            },
        },
        orderBy: { incident: { date: 'asc'} },
    });

    /*
    if (involvements.length === 0)
        throw new AppError(404, "Пока не добавлено ни одного статуса для участников происшествий.");
    */
    
    const data = involvements.map(involvement => ({
        involvement_id: involvement.involvement_id,
        incident_id: involvement.incident.incident_id,
        incident_date: involvement.incident.date,
        incident_type: involvement.incident.incident_type.name,
        participant_id: involvement.participant_id,
        full_name: `${involvement.participant.surname} ${involvement.participant.name[0]}. ${involvement.participant.patronymic? involvement.participant.patronymic[0] + '.' : ''}`,
        status: involvement.status
    }));

    res.json({ 
        data
    });
});

export const createInvolvement = asyncHandler(async (req, res) => {
    const { incident_id, participant_id, status } = req.body;

    const createdInvolvement = await prisma.involvement.create({
        data: {
            incident_id, 
            participant_id, 
            status
        },
        include: {
            incident: { 
                select: {
                    incident_type: { select: {name: true} },
                    date: true
                } 
            },
            participant: {
                select: {
                    surname: true,
                    name: true,
                    patronymic: true
                }
            },
        }
    });

    res.status(201).json({
        data: {
            involvement_id: createdInvolvement.involvement_id,
            incident_id: createdInvolvement.incident.incident_id,
            incident_date: createdInvolvement.incident.date,
            incident_type: createdInvolvement.incident.incident_type.name,
            participant_id: createdInvolvement.participant_id,
            full_name: `${createdInvolvement.participant.surname} ${createdInvolvement.participant.name[0]}. ${createdInvolvement.participant.patronymic? createdInvolvement.participant.patronymic[0] + '.' : ''}`,
            status: createdInvolvement.status
        }
    });
});

export const updateInvolvement = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingInvolvement = getInvolvementById(id);
    if (!existingInvolvement) 
        throw new AppError(404, "Статус участника не найден", [{ id }]);
    
    const { incident_id, participant_id, status } = req.body;

    const updatedInvolvement = await prisma.involvement.update({
        where: { involvement_id: id }, 
        data: {
            incident_id: incident_id !== undefined ? incident_id : existingInvolvement.incident_id, 
            participant_id: participant_id !== undefined ? participant_id : existingInvolvement.participant_id, 
            status: status !== undefined ? status : existingInvolvement.status
        },
        include: {
            incident: { 
                select: {
                    incident_type: { select: {name: true} },
                    date: true
                } 
            },
            participant: {
                select: {
                    surname: true,
                    name: true,
                    patronymic: true
                }
            },
        }
    });

    res.json({
        data: {
            involvement_id: updatedInvolvement.involvement_id,
            incident_id: updatedInvolvement.incident.incident_id,
            incident_date: updatedInvolvement.incident.date,
            incident_type: updatedInvolvement.incident.incident_type.name,
            participant_id: updatedInvolvement.participant_id,
            full_name: `${updatedInvolvement.participant.surname} ${updatedInvolvement.participant.name[0]}. ${updatedInvolvement.participant.patronymic? updatedInvolvement.participant.patronymic[0] + '.' : ''}`,
            status: updatedInvolvement.status
        }
    });
});

export const deleteInvolvement = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingInvolvement = getInvolvementById(id);
    if (!existingInvolvement) 
        throw new AppError(404, "Статус участника не найден", [{ id }]);

    const deletedInvolvement = await prisma.involvement.delete({
        where: { involvement_id: id }
    });

    res.status(204).send();
});