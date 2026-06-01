import { Router } from 'express';
import * as incidentsController from '../controllers/incidentsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { getIncidentsSchema, createIncidentSchema, updateIncidentSchema } from '../validators/incidentsValidator.js';

export const incidentsRouter = Router();

incidentsRouter.get(
    '/', 
    validateRequest(getIncidentsSchema), 
    incidentsController.getIncidents
);
incidentsRouter.post(
    '/',
    authenticate,
    authorize('incidents:write'),
    validateRequest(createIncidentSchema),
    incidentsController.createIncident
);
incidentsRouter.patch(
    '/:id',
    authenticate,
    authorize('incidents:redact'),
    validateRequest(updateIncidentSchema),
    incidentsController.updateIncident
);
incidentsRouter.delete(
    '/:id',
    authenticate,
    authorize('incidents:delete'),
    incidentsController.deleteIncident
);