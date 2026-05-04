import { IUserRepository } from '../../domain/interfaces/repository.interface';
import { FindUserSchema, AuthResponse, LookupResponse } from '../../domain/entities/user.entity';
import { ConflictError } from '../../shared/errors/app.error';
import { AppMessages } from '../../shared/enums/messages.enum';
import { AuthService } from '../services/auth.service';

/**
 * Clase que orquesta la lógica de negocio para los usuarios.
 * Maneja el registro, búsqueda y generación de tokens JWT.
 */
export class UserUseCases {
  /**
   * @param userRepository Instancia del repositorio de usuarios.
   * @param authService Servicio de autenticación para manejo de tokens.
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService
  ) { }

  /**
   * Busca un usuario por email y retorna su información junto con un token si existe.
   * @param email Email a buscar.
   * @returns Resultado de la búsqueda con flag de existencia.
   */
  async findUserByEmail(email: string): Promise<LookupResponse> {
    const { email: normalizedEmail } = FindUserSchema.parse({ email });
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return { user: null, exists: false };
    }

    const token = this.authService.generateToken(user.id);
    return { user, token, exists: true };
  }

  /**
   * Registra un nuevo usuario y genera su token inicial.
   * @param email Email del nuevo usuario.
   * @throws {ConflictError} Si el email ya está registrado.
   * @returns Respuesta con el nuevo usuario y su token.
   */
  async createUser(email: string): Promise<AuthResponse> {
    const { email: normalizedEmail } = FindUserSchema.parse({ email });
    const existing = await this.userRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictError(AppMessages.USUARIO_YA_EXISTE);
    }

    const user = await this.userRepository.create(normalizedEmail);
    const token = this.authService.generateToken(user.id);
    return { user, token };
  }
}