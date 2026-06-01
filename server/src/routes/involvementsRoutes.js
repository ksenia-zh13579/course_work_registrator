import { Router } from 'express';
import * as involvementsController from '../controllers/involvementsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { getInvolvementsQuerySchema, createInvolvementSchema, updateInvolvementSchema } from '../validators/involvementsValidator.js';

export const involvementsRouter = Router();