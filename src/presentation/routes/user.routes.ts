import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserUseCases } from '../../application/usecases/user.usecases';
import { AuthService } from '../../application/services/auth.service';
import { db } from '../../config/firebase.config';
import { asyncHandler } from '../../shared/utils/async.wrapper';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';
import { CreateUserSchema, FindUserSchema } from '../../domain/entities/user.entity';

const userRepository = new UserRepository(db);
const authService = new AuthService();
const userUseCases = new UserUseCases(userRepository, authService);
const userController = new UserController(userUseCases);

export const userRouter = Router();

userRouter.get('/lookup', authLimiter, validateQuery(FindUserSchema), asyncHandler(userController.findByEmail));
userRouter.post('/', authLimiter, validateBody(CreateUserSchema), asyncHandler(userController.create));