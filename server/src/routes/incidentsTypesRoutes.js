import { Router } from 'express';
import * as incidentsTypesController from '../controllers/incidentsTypesControllers.js';
import { authenticate, authorize } from '../middlewares/authMiddlewares.js';

export const incidentsTypesRouter = Router();

incidentsTypesRouter.use(authenticate);

incidentsTypesRouter.get(
    '/',
    authenticate,
    authorize('incidents_types:read'),
    incidentsTypesController.getTypes
);