import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';

/**
 * Servicio encargado de la lógica de autenticación y manejo de tokens JWT.
 */
export class AuthService {
  /**
   * Genera un token JWT para un usuario.
   * @param userId ID del usuario a codificar en el token.
   * @returns Token JWT firmado.
   */
  generateToken(userId: string): string {
    return jwt.sign({ userId }, envs.JWT_SECRET);
  }
}
