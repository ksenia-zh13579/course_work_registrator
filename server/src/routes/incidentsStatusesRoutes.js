import { Router } from 'express';
import * as incidentsStatusesController from '../controllers/incidentsStatusesControllers.js';
import { authenticate, authorize } from '../middlewares/authMiddlewares.js';

export const incidentsStatusesRouter = Router();

incidentsStatusesRouter.use(authenticate);

incidentsStatusesRouter.get(
    '/',
    authenticate,
    authorize('incidents_statuses:read'),
    incidentsStatusesController.getStatuses
);