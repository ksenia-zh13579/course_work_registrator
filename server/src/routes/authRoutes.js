import {Router} from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middlewares/validateMiddlewares.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', validateRequest(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.delete(
    '/logout', 
    authenticate,
    authorize('logout:delete'),
    authController.logout
);