import { Router } from 'express';
import * as involvementsController from '../controllers/involvementsControllers.js';
import { authenticate, authorize } from '../middlewares/authMiddlewares.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { searchInvolvementsQuerySchema, createInvolvementSchema, updateInvolvementSchema } from '../validators/involvementsValidator.js';
import { idParamsSchema } from '../validators/index.js';

export const involvementsRouter = Router();

involvementsRouter.get(
    '/search',
    validateRequest(searchInvolvementsQuerySchema, 'query'),
    involvementsController.searchInvolvements
);

involvementsRouter.get(
    '/',
    involvementsController.getInvolvements
);

involvementsRouter.post(
    '/',
    authenticate,
    authorize('involvements:write'),
    validateRequest(createInvolvementSchema),
    involvementsController.createInvolvement
);

involvementsRouter.patch(
    '/:id',
    authenticate,
    authorize('involvement:redact'),
    validateRequest(idParamsSchema, 'params'),
    validateRequest(updateInvolvementSchema),
    involvementsController.updateInvolvement
);

involvementsRouter.delete(
    '/:id',
    authenticate,
    authorize('involvement:delete'),
    validateRequest(idParamsSchema, 'params'),
    involvementsController.deleteInvolvement
);