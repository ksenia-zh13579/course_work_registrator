import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { getParticipantsQuerySchema, createParticipantSchema, updateParticipantSchema } from '../validators/participantsValidator.js';

export const participantsRouter = Router();