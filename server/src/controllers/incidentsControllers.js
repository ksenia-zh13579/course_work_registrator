import { prisma } from '../client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/errors.js';
import { Math } from 'math';
import { getIncidentById } from '../utils/BDgetters.js';

export const getIncidents = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const incidents = await prisma.incident.findMany({
        where: {date: {gte: startDate, lte: endDate}},
        include: {incident_type: true, incident_status: true},
        orderBy: {date: 'asc'}
    });

    if (incidents.length === 0)
        throw AppError(404, "В данном временном промежутке происшествий не найдено.");

    const data = incidents.map(incident => {return {
        incident_id: incident.incident_id, 
        date: incident.date,
        incident_type: incident.incident_type.name,
        description: incident.description,
        incident_status: incident.incident_status.description,
        reg_number: incident.reg_number
    };});

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
        }
    });

    res.status(201).json({
        data: createdIncident
    });
});

export const updateIncident = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingIncident = getIncidentById(id);
    if (!existingIncident) 
        throw AppError(404, "Происшествие не найдено", [{ id }]);

    const { date, incident_type_id, description, incident_status_id, reg_number } = req.body;

    const updatedIncident = await prisma.incident.update({
        where: { incident_id: id },
        data: {
            date: date !== undefined? date: existingIncident.date, 
            incident_type_id: incident_type_id !== undefined? incident_type_id: existingIncident.incident_type_id, 
            description: description !== undefined? description: existingIncident.description, 
            incident_status_id: incident_status_id !== undefined? incident_status_id: existingIncident.incident_status_id, 
            reg_number: reg_number !== undefined? reg_number: existingIncident.reg_number
        }
    });

    res.json({ data: updatedIncident });
});

export const deleteIncident = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const existingIncident = getIncidentById(id);
    if (!existingIncident) 
        throw AppError(404, "Происшествие не найдено", [{ id }]);

    const deletedIncident = await prisma.incident.delete({
        where: {incident_id: id}
    });

    res.status(204).send();
});