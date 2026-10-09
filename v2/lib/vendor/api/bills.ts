// v2/lib/vendor/api/bills.ts · CE-47 · PRO · P2 app · Bills into Expenses: her doors (dream-os src/api/vendor/bills.js).
// The bill goes from her phone straight into her private folder by a one-time upload address; TDW reads it, she
// corrects or confirms, and it is written to Expenses with its GST. Screens import from here, never raw fetch.
import { getJson, postJson, deleteJson } from '@/lib/vendor/api/_base';

export type ApiErr = { ok: false; error: string };
export type BillFields = { supplier_name?: string | null; supplier_gstin?: string | null; bill_number?: string | null; expense_date?: string | null;
  amount?: number | null; taxable_value?: number | null; cgst?: number | null; sgst?: number | null; igst?: number | null; gst_amount?: number | null; gst_rate?: number | null; printed_rate?: number | null };
export type BillDraft = { id: string; fields: BillFields; problems: string[]; confirmed: boolean; days_left: number; keep_line: string };
export const BILL_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;

export const fetchBills = (vendorId: string): Promise<{ ok: true; drafts: BillDraft[] } | ApiErr> => getJson(`/api/v2/vendor/bills/${vendorId}`);
export const readBill = (vendorId: string, draftId: string): Promise<{ ok: true; draft: BillDraft } | ApiErr> => postJson(`/api/v2/vendor/bills/${vendorId}/drafts/${draftId}/read`, {});
export const confirmBill = (vendorId: string, draftId: string, body: BillFields & { category: string }): Promise<{ ok: true; expense: { id: string } } | ApiErr> =>
  postJson(`/api/v2/vendor/bills/${vendorId}/drafts/${draftId}/confirm`, body);
export const discardBill = (vendorId: string, draftId: string): Promise<{ ok: true } | ApiErr> => deleteJson(`/api/v2/vendor/bills/${vendorId}/drafts/${draftId}`);
export const billFileUrl = (vendorId: string, expenseId: string): Promise<{ ok: true; url: string } | ApiErr> => getJson(`/api/v2/vendor/bills/${vendorId}/expenses/${expenseId}/file`);

/** Add one bill: an upload address, the file PUT straight to her private folder, then TDW reads it. */
export async function addBill(vendorId: string, file: File): Promise<{ ok: true; draft: BillDraft } | ApiErr> {
  if (!(BILL_MIME as readonly string[]).includes(file.type)) return { ok: false, error: 'Add a photo (JPG, PNG or WEBP) or a PDF of the bill.' };
  if (file.size > 10 * 1024 * 1024) return { ok: false, error: 'The file is larger than 10 MB. Add a smaller photo or PDF.' };
  const u = await postJson<{ ok: true; draft_id: string; upload_url: string } | ApiErr>(`/api/v2/vendor/bills/${vendorId}/upload-url`, { mime: file.type });
  if (!u.ok) return u as ApiErr;
  const ok = u as { draft_id: string; upload_url: string };
  try {
    const put = await fetch(ok.upload_url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    if (!put.ok) return { ok: false, error: 'TDW could not upload the bill. Please try again.' };
  } catch { return { ok: false, error: 'TDW could not upload the bill. Please try again.' }; }
  return readBill(vendorId, ok.draft_id);
}
