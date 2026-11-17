'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const field = 'mt-2 block min-h-12 w-full rounded-xl border border-[#DCE3E8] px-3 text-sm outline-none focus:border-[#102B48] focus:ring-2 focus:ring-[#102B48]/10';

export default function StaffInviteDialog({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      await api.adminPost('/auth/admin/staff-invitations', { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
      onSent();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not send the invitation. Please retry.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return <Dialog open onOpenChange={open => { if (!open && !submitting.current) onClose(); }}>
    <DialogContent className="max-h-[90svh] overflow-y-auto rounded-2xl bg-white text-[#18354F]" onEscapeKeyDown={event => { if (busy) event.preventDefault(); }} onPointerDownOutside={event => { if (busy) event.preventDefault(); }}>
      <DialogTitle>Invite staff</DialogTitle>
      <DialogDescription>Send a staff invitation by email. The recipient has 24 hours to accept and use their Lookiy password or create one.</DialogDescription>
      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={busy} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">First name<input className={field} autoComplete="given-name" required maxLength={80} value={firstName} onChange={event => setFirstName(event.target.value)} /></label>
            <label className="block text-sm">Last name<input className={field} autoComplete="family-name" required maxLength={80} value={lastName} onChange={event => setLastName(event.target.value)} /></label>
          </div>
          <label className="block text-sm">Email address<input className={field} type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" disabled={busy} onClick={onClose} className="min-h-11 rounded-xl border border-[#DCE3E8] px-4 text-sm disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102B48] px-4 text-sm font-semibold text-white disabled:opacity-50">
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Mail size={16} aria-hidden />}
            {busy ? 'Sending invitation…' : 'Send invitation'}
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}
