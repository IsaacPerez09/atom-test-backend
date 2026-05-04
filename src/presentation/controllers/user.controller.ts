import { Response } from 'express';
import { UserUseCases } from '../../application/usecases/user.usecases';
import { ResponseHelper } from '../../shared/response';
import { logger } from '../../config/logger';

export class UserController {
  constructor(private readonly userUseCases: UserUseCases) { }

  findByEmail = async (req: any, res: Response): Promise<void> => {
    const email = req.query.email as string;
    logger.info({ email }, 'Looking up user by email');
    const { exists, ...data } = await this.userUseCases.findUserByEmail(email);
    res.json(ResponseHelper.success(data, { exists }));
  };

  create = async (req: any, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await this.userUseCases.createUser(email);
    res.status(201).json(ResponseHelper.success(result));
  };
}