// lib/types/common.ts
// Shared API response types. Mirrors dream-os contract convention:
//   Success: { ok: true, ...data }
//   Error:   { ok: false, error: "message" }

export type ApiSuccess<T> = { ok: true } & T;
export type ApiError = { ok: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export class ApiClientError extends Error {
  status: number;
  reason?: string;
  constructor(message: string, status: number, reason?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.reason = reason;
  }
}
