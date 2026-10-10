'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type RecordItem = { _id: string; type?: string; status: string; submittedAt?: string; rejectionReason?: string; submissionSource?: string; identityData?: { nin?: string; cardNumber?: string; surname?: string; givenNames?: string; dateOfBirth?: string }; submittedDocuments?: { docType: string; fileUrl?: string }[] };
const labels: Record<string, string> = { front_image: 'National ID front', back_image: 'National ID back', selfie_image: 'Selfie' };

function imageData(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Use a JPEG, PNG or WebP image under 5 MB.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
}

export default function IdentityVerificationPanel({ userId, initial, onChanged }: { userId: string; initial?: RecordItem; onChanged?: () => void }) {
  const [records, setRecords] = useState<RecordItem[]>(initial?.type === 'IDENTITY' ? [initial] : []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [nin, setNin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [surname, setSurname] = useState('');
  const [givenNames, setGivenNames] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [canSubmit, setCanSubmit] = useState(false);
  const refresh = async () => {
    if (!userId) return;
    const response = await api.adminGet<{ data: RecordItem[] }>(`/verification/user/${encodeURIComponent(userId)}`);
    setRecords((response.data || []).filter(record => record.type === 'IDENTITY'));
  };
  useEffect(() => { void refresh().catch(e => setError(e instanceof Error ? e.message : 'Could not load verification history')); }, [userId]);
  useEffect(() => { void api.getMe().then(response => setCanSubmit((response?.data?.roles || []).some((role: string) => String(role).toUpperCase() === 'ADMIN'))).catch(() => setCanSubmit(false)); }, []);
  async function submit() {
    setBusy(true); setError(''); setNotice('');
    try {
      if (!files.front_image || !files.back_image || !files.selfie_image) throw new Error('Add the ID front, ID back and a fresh selfie.');
      const [front_image, back_image, selfie_image] = await Promise.all(['front_image', 'back_image', 'selfie_image'].map(key => imageData(files[key]!)));
      await api.adminPost(`/verification/admin/user/${encodeURIComponent(userId)}/submit`, { type: 'IDENTITY', nin, cardNumber, surname, givenNames, dateOfBirth, front_image, back_image, selfie_image });
      setFiles({}); setNotice('Provider checks queued. The rider can see progress in the app.');
      await refresh(); onChanged?.();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not submit documents'); }
    finally { setBusy(false); }
  }
  async function retry(id: string) {
    setBusy(true); setError(''); setNotice('');
    try { await api.adminPost(`/verification/admin/${encodeURIComponent(id)}/retry`, {}); setNotice('Provider checks queued again.'); await refresh(); onChanged?.(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not retry verification'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-4 rounded-2xl border border-[#E1E7EB] bg-[#F8FAFB] p-4">
    <div><h3 className="text-sm font-semibold text-[#102B48]">Identity verification</h3><p className="mt-1 text-xs text-[#6E7D8C]">National ID and selfie face match. Admin submissions waive the verification fee; provider results control the badge.</p></div>
    {records.map((record, index) => <div key={record._id} className="rounded-xl border border-[#E2E8ED] bg-white p-3 text-xs">
      <div className="flex items-center justify-between gap-3"><strong className="text-[#193852]">{record.status.replace(/_/g, ' ')}</strong><span className="text-[#8A96A3]">{record.submissionSource?.replace(/_/g, ' ') || 'Rider'} · {record.submittedAt ? new Date(record.submittedAt).toLocaleDateString('en-UG') : ''}</span></div>
      {record.rejectionReason && <p className="mt-2 text-[#A64949]">{record.rejectionReason}</p>}
      {record.identityData && <p className="mt-2 text-[#637587]">NIN {record.identityData.nin || '—'} · Card {record.identityData.cardNumber || '—'} · {record.identityData.givenNames} {record.identityData.surname}</p>}
      <div className="mt-3 grid grid-cols-3 gap-2">{(record.submittedDocuments || []).map(document => document.fileUrl ? <a key={document.docType} href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-[#E2E8ED] text-center"><img src={document.fileUrl} alt={labels[document.docType] || document.docType} className="h-20 w-full object-cover" /><span className="block p-1 text-[10px] font-semibold text-[#2C668D]">{labels[document.docType] || document.docType}</span></a> : null)}</div>
      {canSubmit && index === 0 && record.status !== 'PROCESSING' && record.status !== 'VERIFIED' && <button disabled={busy} onClick={() => void retry(record._id)} className="mt-3 rounded-lg bg-[#102B48] px-3 py-2 font-semibold text-white disabled:opacity-50">{record.submissionSource === 'RIDER_CORRECTION' ? 'Verify corrected documents' : 'Retry provider checks'}</button>}
    </div>)}
    {!records.length && <p className="text-xs text-[#8492A0]">No identity documents submitted yet.</p>}
    {canSubmit && <details className="rounded-xl border border-[#E2E8ED] bg-white p-3"><summary className="cursor-pointer text-xs font-semibold text-[#193852]">Submit new documents as admin</summary><div className="mt-4 grid grid-cols-2 gap-2">
      <input aria-label="NIN" placeholder="NIN · 14 characters" value={nin} maxLength={14} onChange={e => setNin(e.target.value.toUpperCase())} className="rounded-lg border p-2 text-xs" />
      <input aria-label="Card number" placeholder="Card number · 9 digits" value={cardNumber} inputMode="numeric" maxLength={9} onChange={e => setCardNumber(e.target.value)} className="rounded-lg border p-2 text-xs" />
      <input aria-label="Given names" placeholder="Given names" value={givenNames} onChange={e => setGivenNames(e.target.value)} className="rounded-lg border p-2 text-xs" />
      <input aria-label="Surname" placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} className="rounded-lg border p-2 text-xs" />
      <label className="col-span-2 text-[11px] text-[#718092]">Date of birth<input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="mt-1 w-full rounded-lg border p-2 text-xs" /></label>
      {Object.entries(labels).map(([key, label]) => <label key={key} className="col-span-2 text-[11px] text-[#718092]">{label}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFiles(previous => ({ ...previous, [key]: e.target.files?.[0] }))} className="mt-1 block w-full rounded-lg border p-2 text-xs" /></label>)}
      <button disabled={busy || !nin || !cardNumber} onClick={() => void submit()} className="col-span-2 rounded-lg bg-[#102B48] p-3 text-xs font-semibold text-white disabled:opacity-50">Submit to verification provider</button>
    </div></details>}
    {error && <p role="alert" className="rounded-lg bg-[#FFF0EE] p-2 text-xs text-[#A64949]">{error}</p>}{notice && <p role="status" className="rounded-lg bg-[#EAF5EF] p-2 text-xs text-[#24634A]">{notice}</p>}
  </section>;
}
