import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { searchParticipantsQuerySchema, createParticipantSchema, updateParticipantSchema } from '../validators/participantsValidator.js';

export const participantsRouter = Router();

participantsRouter.use(authenticate);

participantsRouter.get(
    '/search',
    authorize('participants:read'),
    validateRequest(searchParticipantsQuerySchema, 'query'),
    participantController.searchParticipants
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
    authorize('participants:redact'),
    validateRequest(updateParticipantSchema),
    participantsController.updateParticipant
);

participantsRouter.delete(
    '/:id',
    authorize('participants:delete'),
    participantsController.deleteParticipant
);