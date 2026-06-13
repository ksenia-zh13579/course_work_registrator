import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';
import { getIncidentById } from '../utils/BDgetters.js';

export const getIncidents = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.validatedQuery || req.query;

    const where = {};

    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
    }

    const incidents = await prisma.incident.findMany({
        where,
        include: {incident_type: true, incident_status: true},
        orderBy: {date: 'asc'}
    });

    /*
    if (incidents.length === 0)
        throw new AppError(404, "В данном временном промежутке происшествий не найдено.");
    */
    
    const data = incidents.map(incident => ({
        incident_id: incident.incident_id, 
        date: incident.date,
        incident_type: incident.incident_type.name,
        description: incident.description,
        incident_status: incident.incident_status.description,
        reg_number: incident.reg_number
    }));

    res.json({ 
        data
    });
});

export const createIncident = asyncHandler(async (req, res) => {
    const { date, incident_type_id, description, incident_status_id, reg_number } = req.body;

    const createdIncident = await prisma.incident.create({
        data: {
            date, 
            incident_type_id, 
            description, 
            incident_status_id, 
            reg_number
        },
        include: {incident_type: true, incident_status: true}
    });

    res.status(201).json({
        data: {
            incident_id: createdIncident.incident_id, 
            date: createdIncident.date,
            incident_type: createdIncident.incident_type.name,
            description: createdIncident.description,
            incident_status: createdIncident.incident_status.description,
            reg_number: createdIncident.reg_number
        }
    });
});

export const updateIncident = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingIncident = getIncidentById(id);
    if (!existingIncident) 
        throw new AppError(404, "Происшествие не найдено", [{ id }]);

    const { date, incident_type_id, description, incident_status_id, reg_number } = req.body;

    const updatedIncident = await prisma.incident.update({
        where: { incident_id: id },
        data: {
            date: date !== undefined? date: existingIncident.date, 
            incident_type_id: incident_type_id !== undefined? incident_type_id: existingIncident.incident_type_id, 
            description: description !== undefined? description: existingIncident.description, 
            incident_status_id: incident_status_id !== undefined? incident_status_id: existingIncident.incident_status_id, 
            reg_number: reg_number !== undefined? reg_number: existingIncident.reg_number
        },
        include: {incident_type: true, incident_status: true}
    });

    res.json({ 
        data: {
            incident_id: updatedIncident.incident_id, 
            date: updatedIncident.date,
            incident_type: updatedIncident.incident_type.name,
            description: updatedIncident.description,
            incident_status: updatedIncident.incident_status.description,
            reg_number: updatedIncident.reg_number
        } 
    });
});

export const deleteIncident = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingIncident = getIncidentById(id);
    if (!existingIncident) 
        throw new AppError(404, "Происшествие не найдено", [{ id }]);

    const deletedIncident = await prisma.incident.delete({
        where: {incident_id: id}
    });

    res.status(204).send();
});