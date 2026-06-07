import { Router } from 'express';
import * as incidentsController from '../controllers/incidentsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { getIncidentsQuerySchema, createIncidentSchema, updateIncidentSchema } from '../validators/incidentsValidator.js';
import { idParamsSchema } from '../validators/index.js';

export const incidentsRouter = Router();

incidentsRouter.get(
    '/', 
    validateRequest(getIncidentsQuerySchema, 'query'), 
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
    validateRequest(idParamsSchema, 'params'),
    validateRequest(updateIncidentSchema),
    incidentsController.updateIncident
);

incidentsRouter.delete(
    '/:id',
    authenticate,
    authorize('incidents:delete'),
    validateRequest(idParamsSchema, 'params'),
    incidentsController.deleteIncident
);