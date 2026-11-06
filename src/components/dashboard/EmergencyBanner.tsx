'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function EmergencyBanner() {
  const [count, setCount] = useState(0), [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true, running = false, current: AbortController | null = null;
    async function poll() {
      if (running || !active) return;
      running = true; const controller = new AbortController(); current = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      try { const result = await api.adminGet('/journeys/admin/emergencies?summary=true', { signal: controller.signal }); if (active) { setCount(result.openCount || 0); setUnavailable(false); } }
      catch { if (active) setUnavailable(true); }
      finally { clearTimeout(timeout); current = null; running = false; }
    }
    void poll(); const timer = setInterval(poll, 5000);
    return () => { active = false; current?.abort(); clearInterval(timer); };
  }, []);
  if (!count && !unavailable) return null;
  return <Link href="/dashboard/emergencies" role="alert" className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-900"><AlertTriangle size={20} /><span>{count ? `${count} emergency ${count === 1 ? 'journey needs' : 'journeys need'} attention. Open emergency board.` : 'Emergency monitoring is unavailable. Open the board to retry.'}{count > 0 && unavailable ? ' Updates are temporarily unavailable.' : ''}</span></Link>;
}
