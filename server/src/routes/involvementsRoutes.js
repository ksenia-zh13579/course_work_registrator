import { Router } from 'express';
import * as involvementsController from '../controllers/involvementsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { searchInvolvementsQuerySchema, createInvolvementSchema, updateInvolvementSchema } from '../validators/involvementsValidator.js';

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
    authorize('involvements:write'),
    validateRequest(createInvolvementSchema),
    involvementsController.createInvolvement
);

involvementsRouter.patch(
    '/:id',
    authorize('involvements:redact'),
    validateRequest(updateInvolvementSchema),
    involvementsController.updateInvolvement
);

involvementsRouter.delete(
    '/:id',
    authorize('involvements:delete'),
    involvementsController.deleteInvolvement
);