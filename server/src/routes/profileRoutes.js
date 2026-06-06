import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';

export const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.get(
    '/',
    authorize('profile:read'),
    profileController.getProfile
);

profileRouter.patch(
    '/',
    authorize('profile:redact'),
    profileController.updateProfile
);