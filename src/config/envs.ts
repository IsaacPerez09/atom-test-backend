import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Esquema de validación para las variables de entorno.
 * Define los tipos y valores por defecto para la configuración del sistema.
 */
const envSchema = z.object({
  /** Puerto en el que correrá el servidor Express. */
  PORT: z.string().default('5001'),
  /** Lista de orígenes permitidos para CORS (separados por coma). */
  ALLOWED_ORIGINS: z.string().default('http://localhost:4200'),
  /** Entorno de ejecución actual. */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /** Clave secreta para la firma y verificación de tokens JWT. */
  JWT_SECRET: z.string().default('super-secret-default-key-for-dev-only'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

/**
 * Variables de entorno validadas y tipadas.
 * Exporta la configuración final del servidor.
 */
export const envs = _env.data;
