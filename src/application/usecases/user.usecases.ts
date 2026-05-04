import { IUserRepository } from '../../domain/interfaces/repository.interface';
import { User, FindUserSchema, AuthResponse, LookupResponse } from '../../domain/entities/user.entity';
import { ConflictError } from '../../shared/errors/app.error';
import { AppMessages } from '../../shared/enums/messages.enum';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';

export class UserUseCases {
  constructor(private readonly userRepository: IUserRepository) { }

  private generateAuthResponse(user: User, exists?: boolean | null): AuthResponse | LookupResponse {
    const token = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    return {
      user,
      token,
      ...(exists !== null && { exists })
    };
  }

  async findUserByEmail(email: string): Promise<LookupResponse> {

    const validatedData = FindUserSchema.parse({ email });

    const normalizedEmail = validatedData.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return { user: null, exists: false };
    }

    return this.generateAuthResponse(user, true) as LookupResponse;

  }

  async createUser(email: string): Promise<AuthResponse> {

    const validatedData = FindUserSchema.parse({ email });

    const normalizedEmail = validatedData.email.trim().toLowerCase();

    const existing = await this.userRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictError(AppMessages.USUARIO_YA_EXISTE);
    }

    const user = await this.userRepository.create(normalizedEmail);
    return this.generateAuthResponse(user) as AuthResponse;

  }
}