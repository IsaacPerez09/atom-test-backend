export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
  meta?: Record<string, unknown>;
}

export class ResponseHelper {
  static success<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return { success: true, data, error: null, meta };
  }

  static error(code: string, message: string): ApiResponse<null> {
    return { success: false, data: null, error: { code, message } };
  }
}