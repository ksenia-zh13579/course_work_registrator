import { Router } from 'express';
import * as participantsController from '../controllers/participantsControllers.js';
import { authenticate, authorize } from '../middlewares/authMiddlewares.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { searchParticipantsQuerySchema, createParticipantSchema, updateParticipantSchema } from '../validators/participantsValidator.js';
import { idParamsSchema } from '../validators/index.js';

export const participantsRouter = Router();

participantsRouter.use(authenticate);

participantsRouter.get(
    '/search',
    authorize('participants:search'),
    validateRequest(searchParticipantsQuerySchema, 'query'),
    participantsController.searchParticipants
);

participantsRouter.get(
    '/',
    authorize('participants:read'),
    participantsController.getParticipants
);

participantsRouter.post(
    '/',
    authorize('participants:write'),
    validateRequest(createParticipantSchema),
    participantsController.createParticipant
);

participantsRouter.patch(
    '/:id',
    authorize('participant:redact'),
    validateRequest(idParamsSchema, 'params'),
    validateRequest(updateParticipantSchema),
    participantsController.updateParticipant
);

participantsRouter.delete(
    '/:id',
    authorize('participant:delete'),
    validateRequest(idParamsSchema, 'params'),
    participantsController.deleteParticipant
);