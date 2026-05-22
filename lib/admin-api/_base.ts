// lib/admin-api/_base.ts
// Admin API fetch wrapper — injects x-admin-password on every request.

export const API_BASE  = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';
const ADMIN_PWD        = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

function h(extra: Record<string,string> = {}): Record<string,string> {
  return { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD, ...extra };
}

export async function adminGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: h() });
  if (!res.ok) throw new Error(`Admin GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function adminPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: h(), body: body !== undefined ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`Admin POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function adminPatch<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH', headers: h(), body: body !== undefined ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`Admin PATCH ${path} failed: ${res.status}`);
  return res.json();
}

export async function adminDelete<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: h() });
  if (!res.ok) throw new Error(`Admin DELETE ${path} failed: ${res.status}`);
  return res.json();
}

// Two-phase Cloudinary upload helper.
// 1. Gets signed params from backend
// 2. Uploads file directly to Cloudinary
// 3. Returns { image_url, cloudinary_public_id }
export async function adminUploadFile(
  uploadUrlPath: string,
  file: File,
): Promise<{ image_url: string; cloudinary_public_id: string }> {
  const { upload_url, params } = await adminPost<{ upload_url: string; params: Record<string,unknown> }>(
    uploadUrlPath, { filename: file.name }
  );
  const fd = new FormData();
  Object.entries(params).forEach(([k, v]) => fd.append(k, String(v)));
  fd.append('file', file);
  const up = await fetch(upload_url, { method: 'POST', body: fd });
  if (!up.ok) throw new Error('Cloudinary upload failed');
  const data = await up.json();
  return { image_url: data.secure_url, cloudinary_public_id: data.public_id };
}
