'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, CircleDollarSign, ExternalLink, Filter, MapPinned, RefreshCw, Search, ShieldCheck, UserRound, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import IdentityVerificationPanel from './IdentityVerificationPanel';
import SystemWalletPanel from './SystemWalletPanel';

type Kind = 'journeys' | 'riders' | 'clients' | 'fleets' | 'shops' | 'wallet' | 'verifications' | 'staff';
type Item = Record<string, any>;
type Tab = { label: string; key: string; path: string; filter?: (item: Item) => boolean };
const qs = (params: Record<string, string | number | undefined>) => new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)])).toString();
const idOf = (item: Item) => String(item._id || item.id || item.userId || '');
const text = (value: unknown) => value === undefined || value === null || value === '' ? '—' : String(value);
const date = (value: unknown) => value ? new Date(String(value)).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const number = (value: unknown) => Number(value || 0).toLocaleString('en-UG');
const role = (item: Item) => Array.isArray(item.roles) ? item.roles.join(' · ') : '';
const name = (item: Item) => [item.firstName, item.lastName].filter(Boolean).join(' ') || item.name || item.businessName || item.title || item.userId || idOf(item).slice(-8);
const journeyRoute = (item: Item) => [item.pickupLocation?.address || item.pickup?.address || 'Pickup', item.destination?.address || item.destinationLocation?.address || 'Destination'].join(' → ');

const tabs: Record<Kind, Tab[]> = {
  journeys: [
    { label: 'All', key: 'all', path: '/journeys/admin/all' },
    { label: 'Unmatched', key: 'unmatched', path: '/journeys/admin/all?status=CREATED,SEARCHING_OPERATOR,NEGOTIATING' },
    { label: 'Matched', key: 'matched', path: '/journeys/admin/all?status=MATCHED,EN_ROUTE,ARRIVED' },
    { label: 'Paired', key: 'paired', path: '/journeys/admin/all?status=LOCKED' },
    { label: 'Ongoing', key: 'ongoing', path: '/journeys/admin/all?status=STARTED,ACTIVE' },
    { label: 'Completed', key: 'completed', path: '/journeys/admin/all?status=COMPLETED' },
    { label: 'Cancelled', key: 'cancelled', path: '/journeys/admin/all?status=CANCELLED' },
    { label: 'Shared', key: 'shared', path: '/journeys/admin/all?shared=true' },
  ],
  riders: [
    { label: 'All riders', key: 'all', path: '/operators' }, { label: 'Online', key: 'online', path: '/operators?status=ONLINE' },
    { label: 'Verified', key: 'verified', path: '/operators?verified=true' }, { label: 'Unverified', key: 'unverified', path: '/operators?verified=false' },
    { label: 'Identity failed', key: 'identity-failed', path: '/operators?identityVerificationStatus=REJECTED' },
    { label: 'Fee due', key: 'fee', path: '/operators?feeStatus=OVERDUE' },
  ],
  clients: [{ label: 'All clients', key: 'all', path: '/auth/admin/users?role=CLIENT' }],
  fleets: [{ label: 'All fleets', key: 'all', path: '/companies' }, { label: 'Approved', key: 'approved', path: '/companies?approved=true' }, { label: 'Pending', key: 'pending', path: '/companies?approved=false' }],
  shops: [{ label: 'Shops', key: 'shops', path: '/ads/admin/businesses' }, { label: 'Running ads', key: 'running', path: '/ads/admin/ads?status=running' }, { label: 'All ads', key: 'ads', path: '/ads/admin/ads' }, { label: 'Campaigns', key: 'campaigns', path: '/ads/admin/campaigns' }],
  wallet: [{ label: 'Transactions', key: 'all', path: '/wallet/admin/transactions' }, { label: 'Wallets', key: 'wallets', path: '/wallet/admin/wallets' }, { label: 'Top-ups', key: 'topups', path: '/wallet/admin/transactions?type=WALLET_TOPUP' }, { label: 'Withdrawals', key: 'withdrawals', path: '/wallet/admin/transactions?type=WITHDRAWAL' }, { label: 'Fares', key: 'fares', path: '/wallet/admin/transactions?type=JOURNEY_PAYMENT' }, { label: 'Weekly fees', key: 'weekly', path: '/wallet/admin/transactions?type=TRANSFER&purpose=weekly' }, { label: 'System wallet', key: 'system', path: '/wallet/admin/system' }],
  verifications: [{ label: 'Admin review', key: 'pending', path: '/verification/admin/all?status=PENDING' }, { label: 'All requests', key: 'all', path: '/verification/admin/all' }, { label: 'Processing', key: 'processing', path: '/verification/admin/all?status=PROCESSING' }, { label: 'Verified', key: 'verified', path: '/verification/admin/all?status=VERIFIED' }, { label: 'Rejected', key: 'rejected', path: '/verification/admin/all?status=REJECTED' }, { label: 'Service unavailable', key: 'unavailable', path: '/verification/admin/all?status=UNAVAILABLE' }],
  staff: [{ label: 'Staff', key: 'staff', path: '/auth/admin/users?role=STAFF' }, { label: 'Administrators', key: 'admins', path: '/auth/admin/users?role=ADMIN' }, { label: 'All accounts', key: 'accounts', path: '/auth/admin/users' }],
};
const copy: Record<Kind, { title: string; subtitle: string; noun: string }> = {
  journeys: { title: 'Journeys', subtitle: 'Every request, match, pairing and completed route.', noun: 'journey' },
  riders: { title: 'Riders', subtitle: 'Availability, verification, vehicles, earnings and work history.', noun: 'rider' },
  clients: { title: 'Clients', subtitle: 'Accounts, bookings, shared journeys and wallet activity.', noun: 'client' },
  fleets: { title: 'Fleets', subtitle: 'Fleet accounts and connected riders in one place.', noun: 'fleet' },
  shops: { title: 'Shops & ads', subtitle: 'Business profiles, promotions and impressions.', noun: 'record' },
  wallet: { title: 'Wallet & finance', subtitle: 'Balances, fare settlement, top-ups and rider fees.', noun: 'record' },
  verifications: { title: 'Verification', subtitle: 'Review identity and rider verification requests.', noun: 'request' },
  staff: { title: 'Staff', subtitle: 'Manage the people who operate the control center.', noun: 'member' },
};

function rowTitle(kind: Kind, item: Item, tab: string) {
  if (kind === 'journeys') return journeyRoute(item);
  if (kind === 'wallet') return tab === 'wallets' ? `${text(item.walletType)} wallet` : text(item.description || item.type);
  if (kind === 'verifications') return `${text(item.type)} verification`;
  return name(item);
}
function rowDescription(kind: Kind, item: Item) {
  if (kind === 'journeys') return `#${idOf(item).slice(-8)} · ${text(item.vehicleType || item.journeyType)} · ${date(item.createdAt)}`;
  if (kind === 'riders') return [item.vehicleType, item.vehicleModel, item.vehicleNumber || item.licensePlate].filter(Boolean).join(' · ');
  if (kind === 'clients' || kind === 'staff') return [item.email, item.phone, role(item)].filter(Boolean).join(' · ');
  if (kind === 'fleets') return [item.ownerId && `Owner ${String(item.ownerId).slice(-8)}`, item.operatorCount != null && `${item.operatorCount} riders`].filter(Boolean).join(' · ');
  if (kind === 'shops') return [item.businessId && `Shop ${String(item.businessId).slice(-8)}`, item.category, item.ownerId && `Owner ${String(item.ownerId).slice(-8)}`].filter(Boolean).join(' · ');
  if (kind === 'wallet') return [item.userId || item.fromWalletId || item.toWalletId, date(item.createdAt)].filter(Boolean).join(' · ');
  return [item.userId, date(item.submittedAt || item.createdAt)].filter(Boolean).join(' · ');
}
function rowMetric(kind: Kind, item: Item) {
  if (kind === 'journeys') return item.agreedPrice || item.proposedPrice || item.estimatedPrice ? formatCurrency(item.agreedPrice || item.proposedPrice || item.estimatedPrice) : '';
  if (kind === 'wallet') return item.balance !== undefined ? formatCurrency(item.balance) : item.amount !== undefined ? formatCurrency(item.amount) : '';
  if (kind === 'riders') return item.totalEarnings != null ? formatCurrency(item.totalEarnings) : item.rating ? `${item.rating} ★` : '';
  if (kind === 'shops') return item.impressions != null ? `${number(item.impressions)} views` : '';
  return '';
}
function status(kind: Kind, item: Item) {
  if (kind === 'riders') return item.identityVerificationStatus === 'REJECTED' ? 'Verification failed' : item.isVerified ? 'Verified' : item.status || 'Unverified';
  if (kind === 'clients' || kind === 'staff') return item.isActive === false ? 'Inactive' : item.isVerified ? 'Verified' : 'Active';
  if (kind === 'wallet') return item.walletType || item.status || item.type;
  return item.status || (item.approved === true ? 'Approved' : item.approved === false ? 'Pending' : '');
}
function Pill({ value }: { value: string }) {
  const key = value.toUpperCase(); const positive = ['COMPLETED', 'VERIFIED', 'APPROVED', 'ACTIVE', 'ONLINE', 'RUNNING'].includes(key);
  const negative = ['CANCELLED', 'REJECTED', 'FAILED', 'BLOCKED', 'OVERDUE'].includes(key);
  return value ? <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${positive ? 'bg-[#E8F5F0] text-[#1B8063]' : negative ? 'bg-[#FFF0EE] text-[#BA5754]' : 'bg-[#EEF2F6] text-[#566578]'}`}>{value.replace(/_/g, ' ')}</span> : null;
}

function Detail({ kind, item, tab, onClose, onChanged, onRefresh }: { kind: Kind; item: Item; tab: string; onClose: () => void; onChanged: () => void; onRefresh: () => void }) {
  const [related, setRelated] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [canManageStaff, setCanManageStaff] = useState(false);
  const itemId = idOf(item);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [onClose]);
  useEffect(() => { if (kind === 'staff') api.getMe().then(response => setCanManageStaff((response?.data?.roles || []).some((value: string) => String(value).toUpperCase() === 'ADMIN'))).catch(() => setCanManageStaff(false)); }, [kind]);
  useEffect(() => {
    let active = true;
    const userId = String(item.userId || (kind === 'clients' || kind === 'staff' ? itemId : ''));
    const paths: Record<string, string> = {};
    if (kind === 'riders') { paths.Profile = `/operators/admin/${encodeURIComponent(itemId)}/detail`; paths.Journeys = `/journeys/admin/all?operatorId=${encodeURIComponent(itemId)}&limit=8`; paths.Wallets = `/wallet/admin/wallets?userId=${encodeURIComponent(userId)}&limit=8`; paths['Wallet actions'] = `/wallet/admin/transactions?userId=${encodeURIComponent(userId)}&limit=8`; paths['Weekly payments'] = `/wallet/admin/transactions?userId=${encodeURIComponent(userId)}&type=TRANSFER&purpose=weekly&limit=8`; }
    if (kind === 'clients') { paths.Bookings = `/journeys/admin/all?clientId=${encodeURIComponent(userId)}&limit=8`; paths.Shared = `/journeys/admin/all?sharedUserId=${encodeURIComponent(userId)}&limit=8`; paths.Wallets = `/wallet/admin/wallets?userId=${encodeURIComponent(userId)}&limit=8`; paths['Wallet actions'] = `/wallet/admin/transactions?userId=${encodeURIComponent(userId)}&limit=8`; }
    if (kind === 'fleets') paths['Connected riders'] = `/companies/admin/${encodeURIComponent(itemId)}/workspace`;
    if (kind === 'shops' && tab === 'shops') { paths.Wallets = `/wallet/admin/wallets?userId=${encodeURIComponent(String(item.ownerId || ''))}&type=BUSINESS,AD_AIRTIME&limit=8`; paths['Wallet actions'] = `/wallet/admin/transactions?userId=${encodeURIComponent(String(item.ownerId || ''))}&walletType=BUSINESS,AD_AIRTIME&limit=8`; paths.Ads = '/ads/admin/ads?limit=100'; paths.Campaigns = '/ads/admin/campaigns?limit=100'; }
    if (kind === 'journeys') paths.Route = `/tracking/admin/journey/${encodeURIComponent(itemId)}/route`;
    Promise.allSettled(Object.entries(paths).map(async ([key, path]) => [key, await api.adminGet(path)] as const)).then(results => { if (!active) return; const next: Record<string, any> = {}; results.forEach((result, index) => { const key = Object.keys(paths)[index]; next[key] = result.status === 'fulfilled' ? result.value[1]?.data : null; }); setRelated(next); });
    return () => { active = false; };
  }, [kind, itemId, item.userId, tab]);
  const details: Array<[string, unknown]> = kind === 'journeys' ? [['Status', item.status], ['Client ID', item.clientId], ['Rider ID', item.operatorId], ['Vehicle', item.vehicleType], ['Journey type', item.journeyType], ['Price', rowMetric(kind, item)], ['Created', date(item.createdAt)], ['Started', date(item.startedAt)], ['Completed', date(item.completedAt)], ['Cancellation', item.cancellationReason || item.cancelReason]] : kind === 'riders' ? [['Rider ID', itemId], ['Account ID', item.userId], ['Phone', item.phone], ['Vehicle', [item.vehicleType, item.vehicleModel].filter(Boolean).join(' · ')], ['Plate', item.vehicleNumber || item.licensePlate], ['Status', item.status], ['Verified', item.isVerified ? 'Yes' : 'No'], ['Weekly fee', item.feeStatus], ['Joined', date(item.createdAt)], ['Rating', item.rating], ['Journeys', item.totalJourneys]] : kind === 'clients' || kind === 'staff' ? [['Account ID', itemId], ['Email', item.email], ['Phone', item.phone], ['Roles', role(item)], ['Verified', item.isVerified ? 'Yes' : 'No'], ['Active', item.isActive === false ? 'No' : 'Yes'], ['Joined', date(item.createdAt)], ['Last sign-in', date(item.lastLoginAt)]] : kind === 'fleets' ? [['Fleet ID', itemId], ['Owner', item.ownerId], ['Connected riders', item.operatorCount], ['Status', item.approved ? 'Approved' : item.status], ['Registered', date(item.createdAt)]] : kind === 'shops' ? [['ID', itemId], ['Owner', item.ownerId], ['Business', item.businessId], ['Category', item.category], ['Status', item.status], ['Impressions', item.impressions], ['Clicks', item.clicks], ['Created', date(item.createdAt)]] : kind === 'wallet' ? [['ID', itemId], ['Account ID', item.userId], ['Type', item.walletType || item.type], ['Amount / balance', rowMetric(kind, item)], ['Reserved', item.reserved && formatCurrency(item.reserved)], ['From wallet', item.fromWalletId], ['To wallet', item.toWalletId], ['Journey', item.journeyId], ['Status', item.status], ['Created', date(item.createdAt)]] : [['Request ID', itemId], ['Account ID', item.userId], ['Type', item.type], ['Status', item.status], ['Submitted', date(item.submittedAt)], ['Result', item.result?.matchResult]];
  async function action(path: string, body: unknown, label: string, method: 'post' | 'put' = 'post') {
    setBusy(true); setMessage('');
    try { if (method === 'post') await api.adminPost(path, body); else await api.adminPut(path, body); setMessage(`${label} submitted.`); onChanged(); }
    catch (failure) { setMessage(failure instanceof Error ? failure.message : 'Action failed.'); }
    finally { setBusy(false); }
  }
  const relatedList = (value: any): Item[] => Array.isArray(value) ? value : [];
  return <div className="fixed inset-0 z-[70] flex justify-end bg-[#102B48]/20 backdrop-blur-[2px]" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" aria-label={`${copy[kind].noun} details`} className="h-full w-full max-w-[510px] overflow-y-auto bg-white shadow-[-18px_0_80px_rgba(16,43,72,.16)]"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E7EAEE] bg-white/95 p-6 backdrop-blur-xl"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#D78726]">{copy[kind].noun} detail</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.05em] text-[#102B48]">{rowTitle(kind, item, tab)}</h2><p className="mt-2 text-xs text-[#758394]">{rowDescription(kind, item)}</p></div><button onClick={onClose} aria-label="Close details" className="rounded-xl border border-[#E7EAEE] p-2 text-[#66778A]"><X size={19} /></button></div>{kind === 'shops' && tab === 'shops' && item.coverImageUrl && <img src={item.coverImageUrl} alt="" className="h-44 w-full object-cover" />}<div className="space-y-6 p-6"><div className="rounded-[22px] border border-[#E7EAEE] bg-[#FAFBFC] p-5"><div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#758394]">At a glance</span><Pill value={String(status(kind, item) || '')} /></div><dl className="grid grid-cols-2 gap-x-5 gap-y-4">{details.filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => <div key={label}><dt className="text-[11px] text-[#8290A0]">{label}</dt><dd className="mt-1 break-words text-xs font-semibold text-[#233B52]">{text(value)}</dd></div>)}</dl></div>
    {kind === 'journeys' && ['MATCHED', 'EN_ROUTE', 'ARRIVED', 'LOCKED', 'STARTED', 'ACTIVE'].includes(String(item.status)) && <Link href={`/dashboard/map?journey=${encodeURIComponent(itemId)}`} className="flex items-center justify-between rounded-2xl bg-[#102B48] p-4 text-sm font-semibold text-white"><span className="flex items-center gap-2"><MapPinned size={17} />View on tracking map</span><ArrowRight size={17} /></Link>}
    {(kind === 'riders' || kind === 'verifications') && <IdentityVerificationPanel userId={String(item.userId || '')} initial={kind === 'verifications' ? item as any : undefined} onChanged={onRefresh} />}
    {kind === 'shops' && tab === 'shops' && <section><h3 className="mb-3 text-sm font-semibold text-[#102B48]">Inventory</h3><div className="grid grid-cols-2 gap-3">{relatedList(item.inventory).slice(0, 12).map(product => <div key={idOf(product)} className="overflow-hidden rounded-xl border border-[#E7EAEE]">{(product.imageUrl || product.imageUrls?.[0]) && <img src={product.imageUrl || product.imageUrls[0]} alt="" className="h-24 w-full object-cover" />}<div className="p-3"><strong className="block truncate text-xs text-[#203B53]">{product.name}</strong><span className="mt-1 block text-[11px] text-[#7B8997]">{product.price != null ? formatCurrency(product.price) : 'Price not set'} · {product.stock ?? '—'} in stock</span></div></div>)}{!item.inventory?.length && <p className="text-xs text-[#8996A3]">No inventory uploaded.</p>}</div></section>}
    {kind === 'staff' && canManageStaff && <div className="rounded-2xl border border-[#E7EAEE] p-4"><p className="text-xs font-semibold">Manage access</p><p className="mt-1 text-xs text-[#758394]">Choose a team role for this existing account.</p><div className="mt-4 flex flex-wrap gap-2">{['STAFF', 'ADMIN'].map(target => <button key={target} disabled={busy || item.roles?.includes(target)} onClick={() => { const roles = Array.from(new Set<string>([...(item.roles || []).filter((value: string) => !['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(value)), target])); if (window.confirm(`Set ${name(item)} to ${target.toLowerCase()}?`)) void action(`/auth/admin/users/${encodeURIComponent(itemId)}/roles`, { roles }, 'Role update', 'put'); }} className="rounded-xl border border-[#DCE3E8] px-3 py-2 text-xs font-semibold disabled:opacity-40">Set {target.toLowerCase()}</button>)}{(item.roles || []).some((value: string) => ['STAFF', 'ADMIN'].includes(value)) && <button disabled={busy} onClick={() => { const roles = (item.roles || []).filter((value: string) => !['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(value)); if (window.confirm(`Remove team access for ${name(item)}?`)) void action(`/auth/admin/users/${encodeURIComponent(itemId)}/roles`, { roles: roles.length ? roles : ['CLIENT'] }, 'Access removal', 'put'); }} className="rounded-xl border border-[#E9D6D4] px-3 py-2 text-xs font-semibold text-[#A75E59] disabled:opacity-40">Remove access</button>}</div></div>}
    {message && <p role="status" className="rounded-xl bg-[#EDF4F7] p-3 text-xs text-[#234D66]">{message}</p>}
    {kind === 'riders' && related.Profile && <section><h3 className="mb-3 text-sm font-semibold text-[#102B48]">Rider account & documents</h3><div className="rounded-2xl border border-[#E7EAEE] bg-[#FAFBFC] p-4 text-xs text-[#516477]"><p>Vehicle: {[related.Profile.vehicleType, related.Profile.vehicleVariant, related.Profile.vehicleModel, related.Profile.vehicleColor, related.Profile.vehicleYear].filter(Boolean).join(' · ') || 'Not provided'}</p><p className="mt-2">Capacity: {text(related.Profile.vehicleCapacity)} seats · Fleet: {text(related.Profile.companyId)}</p><p className="mt-2">Grace deadline: {date(related.Profile.workingGraceDeadline)} · Last weekly fee: {date(related.Profile.lastFeePaidAt)}</p><p className="mt-2">Total earnings: {formatCurrency(related.Profile.totalEarnings || 0)} · {number(related.Profile.totalJourneys)} journeys</p></div><div className="mt-3 space-y-2">{relatedList(related.Profile.documents).map(document => <div key={idOf(document)} className="flex items-center justify-between gap-3 rounded-xl border border-[#E7EAEE] p-3 text-xs"><span><strong>{text(document.type).replace(/_/g, ' ')}</strong><span className="ml-2 text-[#8493A2]">{text(document.verificationStatus)}</span></span>{document.fileUrl && <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2D6B91]">View file</a>}</div>)}{!related.Profile.documents?.length && <p className="text-xs text-[#8894A1]">No documents submitted.</p>}</div></section>}
    {kind === 'fleets' && related['Connected riders']?.earnings && <section><h3 className="mb-3 text-sm font-semibold text-[#102B48]">Fleet earnings history</h3><div className="space-y-3">{relatedList(related['Connected riders'].earnings.riders).map(rider => <div key={rider.operatorUserId} className="rounded-2xl border border-[#E7EAEE] p-4 text-xs"><div className="flex justify-between gap-3"><strong>{rider.rider?.name || rider.operatorUserId}</strong><span>{formatCurrency(rider.collected || 0)} collected</span></div><p className="mt-1 text-[#8291A0]">{number(rider.journeys)} journeys · {formatCurrency(rider.gross || 0)} gross</p><div className="mt-3 space-y-1">{Object.entries(rider.daily || {}).slice(0, 7).map(([day, value]: [string, any]) => <p key={day} className="flex justify-between text-[#617285]"><span>{day} · {number(value.journeys)} journeys</span><span>{formatCurrency(value.collected || 0)}</span></p>)}</div></div>)}{!related['Connected riders'].earnings.riders?.length && <p className="text-xs text-[#8894A1]">No collected earnings recorded yet.</p>}</div></section>}
    {Object.entries(related).filter(([key]) => key !== 'Profile').map(([key, value]) => <section key={key}><h3 className="mb-3 text-sm font-semibold text-[#102B48]">{key}</h3>{key === 'Connected riders' ? <div className="space-y-2">{relatedList(value?.riders).map(member => <div key={member._id || member.operatorUserId} className="rounded-xl border border-[#E7EAEE] p-3 text-xs"><strong>{member.rider?.name || member.operatorUserId}</strong><p className="mt-1 text-[#6F7F90]">{[member.rider?.vehicleType, member.rider?.vehicleNumber, member.collectionsPaused ? 'Collections paused' : 'Collections active'].filter(Boolean).join(' · ')}</p></div>)}{!value?.riders?.length && <p className="text-xs text-[#8894A1]">No connected riders.</p>}</div> : key === 'Route' ? <p className="text-xs text-[#66778A]">{value ? `${number(value.coveredKm)} km covered · ${value.remainingKm == null ? 'Remaining distance unavailable' : `${number(value.remainingKm)} km remaining`}` : 'Route data unavailable.'}</p> : <div className="space-y-2">{relatedList(value).filter(row => kind !== 'shops' || key === 'Wallets' || key === 'Wallet actions' || String(row.businessId) === itemId).slice(0, 8).map(row => <div key={idOf(row)} className="flex justify-between gap-3 rounded-xl border border-[#E7EAEE] p-3 text-xs"><span className="min-w-0"><strong className="block truncate">{row.pickupLocation ? journeyRoute(row) : row.description || row.name || row.walletType || row.title || idOf(row).slice(-8)}</strong><span className="mt-1 block text-[#8794A2]">{date(row.createdAt)} · {row.status || row.type || ''}</span></span><span className="shrink-0 font-semibold">{row.amount != null ? formatCurrency(row.amount) : row.balance != null ? formatCurrency(row.balance) : ''}</span></div>)}{!relatedList(value).length && <p className="text-xs text-[#8894A1]">No records available.</p>}</div>}</section>)}
  </div></aside></div>;
}

export default function AdminWorkspace({ kind }: { kind: Kind }) {
  const [tab, setTab] = useState(tabs[kind][0].key);
  const [canViewSystemWallet, setCanViewSystemWallet] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Item | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (kind !== 'wallet') return;
    let active = true;
    void api.getMe().then(response => {
      if (active) setCanViewSystemWallet((response?.data?.roles || []).some((value: string) => String(value).toUpperCase() === 'ADMIN'));
    }).catch(() => { if (active) setCanViewSystemWallet(false); });
    return () => { active = false; };
  }, [kind]);
  useEffect(() => { if (kind === 'wallet' && tab === 'system' && !canViewSystemWallet) setTab('all'); }, [kind, tab, canViewSystemWallet]);
  const visibleTabs = kind === 'wallet' ? tabs[kind].filter(entry => entry.key !== 'system' || canViewSystemWallet) : tabs[kind];
  const activeTab = visibleTabs.find(entry => entry.key === tab) || visibleTabs[0];
  const serverQuery = kind === 'clients' || kind === 'staff' ? query : '';
  const load = useCallback(async () => {
    if (kind === 'wallet' && tab === 'system') { setBusy(false); return; }
    setBusy(true); setError('');
    try { const separator = activeTab.path.includes('?') ? '&' : '?'; const response = await api.adminGet(`${activeTab.path}${separator}${qs({ page, limit: 25, search: serverQuery || undefined })}`); setItems(Array.isArray(response?.data) ? response.data : []); setTotal(Number(response?.pagination?.total || response?.meta?.total || 0)); }
    catch (failure) { setItems([]); setTotal(0); setError(failure instanceof Error ? failure.message : 'Could not load records.'); }
    finally { setBusy(false); }
  }, [activeTab.path, page, serverQuery, kind, tab]);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => items.filter(item => activeTab.filter?.(item) ?? true).filter(item => !query || kind === 'clients' || kind === 'staff' || JSON.stringify([name(item), rowDescription(kind, item), item.status, idOf(item)]).toLowerCase().includes(query.toLowerCase())), [items, activeTab, query, kind]);
  return <div className="min-h-screen bg-[#F5F6F7]"><Header title={copy[kind].title} subtitle={copy[kind].subtitle} /><div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#E0912B]">Operations directory</p><h2 className="mt-1 text-[28px] font-semibold tracking-[-.05em] text-[#102B48]">{copy[kind].title}</h2><p className="mt-1 text-xs text-[#728093]">{busy ? 'Loading…' : kind === 'wallet' && tab === 'system' ? 'Platform revenue and owner payouts' : `${number(total || visible.length)} ${copy[kind].noun}${(total || visible.length) === 1 ? '' : 's'}`}</p></div><button onClick={() => void load()} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-4 py-2.5 text-xs font-semibold text-[#334D62] hover:bg-[#F9FAFB]"><RefreshCw size={15} />Refresh</button></div>
    <div className="rounded-[23px] border border-[#E5E9EC] bg-white p-3 shadow-[0_8px_34px_rgba(16,43,72,.04)]"><div className="flex gap-2 overflow-x-auto pb-1">{visibleTabs.map(entry => <button key={entry.key} onClick={() => { setTab(entry.key); setPage(1); setSelected(null); }} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${entry.key === tab ? 'bg-[#102B48] text-white' : 'text-[#69798B] hover:bg-[#F2F5F7]'}`}>{entry.label}</button>)}</div></div>
    {kind === 'wallet' && tab === 'system' && <SystemWalletPanel />}<div className={`overflow-hidden rounded-[24px] border border-[#E5E9EC] bg-white shadow-[0_8px_34px_rgba(16,43,72,.04)]${kind === 'wallet' && tab === 'system' ? ' hidden' : ''}`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF0F2] p-4 sm:p-5"><div className="relative min-w-[230px] flex-1 sm:max-w-[380px]"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8794A3]" /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder={kind === 'clients' || kind === 'staff' ? `Search all ${copy[kind].noun}s` : `Filter this page`} className="w-full rounded-xl border border-[#E7EBEE] bg-[#F8FAFB] py-2.5 pl-10 pr-3 text-xs outline-none focus:border-[#9CB2C4]" /></div><span className="flex items-center gap-2 text-xs text-[#8794A3]"><Filter size={15} />{activeTab.label}</span></div>{error ? <div className="p-12 text-center"><p className="text-sm font-semibold text-[#A94D4B]">Could not load this view</p><p className="mt-2 text-xs text-[#7B8998]">{error}</p><button onClick={() => void load()} className="mt-5 rounded-xl bg-[#102B48] px-4 py-2 text-xs font-semibold text-white">Try again</button></div> : busy ? <div className="p-12 text-center text-xs text-[#8090A0]">Loading records…</div> : visible.length ? <div className="divide-y divide-[#EDF0F2]">{visible.map(item => <button key={idOf(item)} onClick={() => setSelected(item)} className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-[#F8FAFB] sm:gap-5 sm:px-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2F5] text-[#536B80]">{(kind === 'shops' && tab === 'shops' && item.coverImageUrl) || ((kind === 'clients' || kind === 'staff') && item.avatar) ? <img src={kind === 'shops' ? item.coverImageUrl : item.avatar} alt="" className="h-full w-full object-cover" /> : kind === 'journeys' ? <MapPinned size={19} /> : kind === 'wallet' ? <CircleDollarSign size={19} /> : kind === 'verifications' ? <ShieldCheck size={19} /> : <UserRound size={19} />}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[13px] font-semibold text-[#18354F]">{rowTitle(kind, item, tab)}</strong><span className="mt-1 block truncate text-[11px] text-[#8391A1]">{rowDescription(kind, item)}</span></span><span className="hidden shrink-0 text-xs font-semibold text-[#233C55] md:block">{rowMetric(kind, item)}</span><Pill value={String(status(kind, item) || '')} /><ChevronRight size={17} className="shrink-0 text-[#A4AEB9]" /></button>)}</div> : <div className="p-14 text-center"><p className="text-sm font-semibold text-[#425A70]">No {copy[kind].noun}s in this view</p><p className="mt-2 text-xs text-[#8A97A4]">Records will appear when the connected API returns them.</p></div>}<div className="flex items-center justify-between border-t border-[#EDF0F2] px-5 py-4 text-xs text-[#7A8998]"><span>Page {page}{total ? ` · ${number(total)} total` : ''}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-[#E5E9EC] p-2 disabled:opacity-35" aria-label="Previous page"><ChevronLeft size={16} /></button><button disabled={items.length < 25 || (total > 0 && page * 25 >= total)} onClick={() => setPage(page + 1)} className="rounded-lg border border-[#E5E9EC] p-2 disabled:opacity-35" aria-label="Next page"><ChevronRight size={16} /></button></div></div></div>
  </div>{selected && <Detail kind={kind} item={selected} tab={tab} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); void load(); }} onRefresh={() => void load()} />}</div>;
}
