import rateLimit from 'express-rate-limit';
import { ResponseHelper } from '../../shared/response';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Límite global para todas las rutas del API.
 * Configuración: 100 peticiones cada 15 minutos por dirección IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 peticiones por `window`
  standardHeaders: true, // Devuelve información del límite en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json(
      ResponseHelper.error('TOO_MANY_REQUESTS', AppMessages.DEMASIADAS_PETICIONES)
    );
  },
});

/**
 * Límite estricto diseñado para rutas de autenticación (Login/Registro).
 * Configuración: 5 peticiones cada 15 minutos por dirección IP.
 * Previene ataques de fuerza bruta.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limitar cada IP a 5 peticiones por `window` (para login/registro)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      ResponseHelper.error('TOO_MANY_REQUESTS', AppMessages.DEMASIADOS_INTENTOS_AUTH)
    );
  },
});
