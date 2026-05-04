import { Response } from 'express';
import { UserUseCases } from '../../application/usecases/user.usecases';
import { ResponseHelper } from '../../shared/response';
import { logger } from '../../config/logger';

/**
 * Controlador para las operaciones relacionadas con los usuarios.
 * Maneja el registro y la búsqueda de usuarios vía email.
 */
export class UserController {
  /**
   * @param userUseCases Instancia de los casos de uso de usuarios.
   */
  constructor(private readonly userUseCases: UserUseCases) { }

  /**
   * Busca un usuario por su email.
   * @param req Petición Express con email en el query string.
   * @param res Respuesta Express.
   */
  findByEmail = async (req: any, res: Response): Promise<void> => {
    const email = req.query.email as string;
    logger.info({ email }, 'Looking up user by email');
    const { exists, ...data } = await this.userUseCases.findUserByEmail(email);
    res.json(ResponseHelper.success(data, { exists }));
  };

  /**
   * Crea (registra) un nuevo usuario.
   * @param req Petición Express con el email en el cuerpo.
   * @param res Respuesta Express (201 Created).
   */
  create = async (req: any, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await this.userUseCases.createUser(email);
    res.status(201).json(ResponseHelper.success(result));
  };
}