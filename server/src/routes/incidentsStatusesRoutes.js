import { Router } from 'express';
import * as incidentsStatusesController from '../controllers/incidentsStatusesController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export const incidentsStatusesRouter = Router();

incidentsStatusesRouter.use(authenticate);

incidentsStatusesRouter.get(
    '/',
    authorize('incidents_statuses:read'),
    incidentsStatusesController.getStatuses
);