import { Router } from 'express';
import * as incidentsTypesController from '../controllers/incidentsTypesController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

export const incidentsTypesRouter = Router();

incidentsTypesRouter.use(authenticate);

incidentsTypesRouter.get(
    '/',
    authorize('incidents_types:read'),
    incidentsTypesController.getTypes
);