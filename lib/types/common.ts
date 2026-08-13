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
  // ── ARC OB · charter OB-P · THE REFUSAL BODY, CARRIED ────────────────────
  // ADDITIVE, and additive is the whole point: ten existing call sites read
  // message/status/reason and none of them can notice this field. It exists
  // because the estate's 400 INCOMPLETE contract carries MACHINE fields beside
  // its sentence — `missing[]`, and on the vendor lane `allowed[]` — and a
  // thrown error that keeps only the sentence discards exactly the half a form
  // renders its boxes from. Without this the bride form would have to bypass
  // this module with a raw status-aware fetch, which is F-OB.11 re-committed
  // rather than cured.
  //
  // Typed `unknown`, deliberately: this is the SERVER's shape, not ours, and a
  // client-side interface asserting what a refusal contains would be a second
  // definition of the contract — the exact class this arc exists to collapse.
  // Readers narrow it at the point of use and stay honest about the guess.
  body?: unknown;
  constructor(message: string, status: number, reason?: string, body?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.reason = reason;
    this.body = body;
  }
}
