'use client';
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { Car, Check, Download, Plus, RefreshCw, Search, Star, Trash2, Upload } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';

type Entry = { _id: string; kind: string; code: string; label: string; parentId?: string; vehicleType?: string; value?: number; releaseDate?: string; active: boolean; revision: number };
type Spec = { _id: string; catalogSpecificationId: string; typeId: string; variantId?: string; brandId: string; modelId: string; capacityId: string; yearId: string; premium?: boolean; active: boolean; availableInCatalog: boolean; revision: number; vehicleType: string; vehicleVariant: string; vehicleBrand: string; vehicleModel: string; vehicleYear: number; vehicleCapacity: number; typeLabel: string; variantLabel: string };
type Application = { _id: string; specificationId?: string; userId: string; status: string; revision: number; vehicleType: string; vehicleVariant: string; vehicleBrand: string; vehicleModel: string; vehicleYear: number; vehicleCapacity: number; reviewReason?: string; createdAt: string };
type Selection = { typeId: string; variantId: string; brandId: string; modelId: string; capacityId: string; yearId: string; premium: boolean };
type DeleteTarget = { resource: 'entries' | 'specifications'; id: string; revision: number; name: string };
const EMPTY: Selection = { typeId: '', variantId: '', brandId: '', modelId: '', capacityId: '', yearId: '', premium: false };
const KINDS = [['BRAND', 'Brands'], ['MODEL', 'Models'], ['RELEASE_YEAR', 'Release years'], ['CAPACITY', 'Seats / capacity'], ['TYPE', 'Vehicle types'], ['TRUCK_CATEGORY', 'Truck categories'], ['BODA_TYPE', 'Boda power types']];
const names: Record<string, string> = { BRAND: 'Brand name', MODEL: 'Model name', TYPE: 'Vehicle type name', TRUCK_CATEGORY: 'Truck category name', BODA_TYPE: 'Boda power type' };
const field = 'mt-2 min-h-11 w-full rounded-xl border border-[#DCE4EB] bg-white px-3 py-2 text-sm disabled:bg-slate-100';
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-40';
const primary = button + ' border-[#18334E] bg-[#18334E] text-white';
const describe = (s: { vehicleBrand: string; vehicleModel: string; vehicleYear: number; vehicleCapacity: number }) => `${s.vehicleBrand} ${s.vehicleModel} · ${s.vehicleYear} · ${s.vehicleCapacity ? s.vehicleCapacity + ' seats' : 'Cargo'}`;

export default function VehicleCatalogPage() {
  const [entries, setEntries] = useState<Entry[]>([]), [specs, setSpecs] = useState<Spec[]>([]), [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState('Master data'), [kind, setKind] = useState('BRAND'), [status, setStatus] = useState('PENDING'), [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState(''), [search, setSearch] = useState('');
  const [label, setLabel] = useState(''), [parent, setParent] = useState(''), [vehicleGroup, setVehicleGroup] = useState('CAR'), [value, setValue] = useState(''), [date, setDate] = useState('');
  const [editing, setEditing] = useState<Entry | null>(null), [active, setActive] = useState(true);
  const [selection, setSelection] = useState<Selection>(EMPTY), [reviewing, setReviewing] = useState<Application | null>(null), [reason, setReason] = useState('');
  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);
  const [file, setFile] = useState<{ name: string; base64: string } | null>(null), [preview, setPreview] = useState<{ rows: Record<string, string | number>[]; errors: { row: number; message: string }[]; imported: number } | null>(null);
  const generation = useRef(0), lock = useRef(false), fileReadGeneration = useRef(0);
  const load = useCallback(async () => {
    const current = ++generation.current; setLoading(true); setError('');
    try {
      const [catalog, pending] = await Promise.all([api.adminGet<{ data: { entries: Entry[]; specifications: Spec[] } }>('/operators/catalog/admin'), api.adminGet<{ data: Application[] }>(`/operators/catalog/admin/applications?status=${status}&page=${page}`)]);
      if (current !== generation.current) return;
      setEntries(catalog.data.entries); setSpecs(catalog.data.specifications); setApplications(pending.data);
    } catch (e) { if (current === generation.current) setError(e instanceof Error ? e.message : 'Could not load vehicle catalog'); }
    finally { if (current === generation.current) setLoading(false); }
  }, [status, page]);
  useEffect(() => { void load(); return () => { generation.current++; }; }, [load]);
  async function action(work: () => Promise<void>, success: string) {
    if (lock.current) return; lock.current = true; setBusy(true); setError(''); setMessage('');
    try { await work(); setMessage(success); await load(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not save changes'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    await action(async () => {
      await api.adminDelete(`/operators/catalog/admin/${target.resource}/${target.id}?revision=${target.revision}`);
      setDeleting(null);
      if (editing?._id === target.id) clearEntry();
      setSelection(EMPTY);
    }, 'Vehicle catalog updated. Deleted vehicles are removed from new registration and booking choices.');
  }
  const byKind = (k: string) => entries.filter(e => e.kind === k && e.active);
  const parentKind = ['TYPE', 'MODEL'].includes(kind) ? 'BRAND' : kind === 'RELEASE_YEAR' ? 'MODEL' : kind === 'CAPACITY' ? 'RELEASE_YEAR' : ['TRUCK_CATEGORY', 'BODA_TYPE'].includes(kind) ? 'TYPE' : '';
  const parentsFor = (k: string) => {
    const brands = byKind('BRAND');
    const models = byKind('MODEL').filter(e => brands.some(b => b._id === e.parentId));
    if (k === 'MODEL' || k === 'TYPE') return brands;
    if (k === 'RELEASE_YEAR') return models;
    if (k === 'CAPACITY') return byKind('RELEASE_YEAR').filter(e => models.some(m => m._id === e.parentId));
    return byKind('TYPE').filter(e => brands.some(b => b._id === e.parentId) && e.vehicleType === (k === 'TRUCK_CATEGORY' ? 'TRUCK' : 'BODA'));
  };
  const parents = parentKind ? parentsFor(kind) : [];
  const entryLabel = (entry: Entry) => {
    const labels = [entry.label];
    let ancestor = entries.find(e => e._id === entry.parentId);
    while (ancestor && labels.length < 4) {
      labels.unshift(ancestor.label);
      const nextId = ancestor.parentId;
      ancestor = entries.find(e => e._id === nextId);
    }
    return labels.join(' · ');
  };
  const numeric = kind === 'CAPACITY' || kind === 'RELEASE_YEAR';
  const canCreate = !parentKind || parents.some(e => e._id === parent);
  function clearEntry(nextKind = kind) { setKind(nextKind); setEditing(null); setLabel(''); setParent(''); setValue(''); setDate(''); setActive(true); }
  async function saveEntry(e: FormEvent) {
    e.preventDefault();
    if (!editing && !canCreate) return;
    await action(async () => {
      if (editing) await api.adminPut(`/operators/catalog/admin/entries/${editing._id}`, { label: numeric ? editing.label : label.trim(), active, revision: editing.revision });
      else {
        const numberLabel = kind === 'CAPACITY' ? (Number(value) === 0 ? 'Cargo only' : `${value} passenger seats`) : value;
        const name = numeric ? numberLabel : label.trim();
        const code = numeric ? value : name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40).replace(/_$/, '');
        await api.adminPost('/operators/catalog/admin/entries', {
          kind, label: name, code,
          ...(parentKind ? { parentId: parent } : {}),
          ...(kind === 'TYPE' ? { vehicleType: vehicleGroup } : {}),
          ...(numeric ? { value: Number(value) } : {}),
          ...(kind === 'RELEASE_YEAR' && date ? { releaseDate: date } : {}),
        });
      }
      clearEntry();
    }, 'Catalog entry saved.');
  }
  const selectedType = entries.find(e => e._id === selection.typeId);
  const existingSelection = specs.some(spec => spec.availableInCatalog && ['brandId', 'modelId', 'yearId', 'capacityId', 'typeId', 'variantId'].every(key => (spec[key as keyof Spec] || '') === (selection[key as keyof Selection] || '')));
  const categoryKind = selectedType?.vehicleType === 'TRUCK' ? 'TRUCK_CATEGORY' : selectedType?.vehicleType === 'BODA' ? 'BODA_TYPE' : '';
  const selectionValid = !!selection.typeId && !!selection.brandId && !!selection.modelId && !!selection.capacityId && !!selection.yearId && (!categoryKind || !!selection.variantId);
  function startReview(application: Application) {
    setReviewing(application); setReason(''); setSelection(EMPTY); setMessage(''); setError('');
    const match = specs.find(s => s._id === application.specificationId) || specs.find(s => s.availableInCatalog && s.vehicleType === application.vehicleType && s.vehicleVariant === application.vehicleVariant && s.vehicleBrand.toLowerCase() === application.vehicleBrand.toLowerCase() && s.vehicleModel.toLowerCase() === application.vehicleModel.toLowerCase() && s.vehicleYear === application.vehicleYear && s.vehicleCapacity === application.vehicleCapacity);
    if (match) setSelection({ ...match, variantId: match.variantId || '', premium: match.premium === true });
  }
  async function publish(e: FormEvent) {
    e.preventDefault(); if (!selectionValid) return;
    const application = tab === 'Applications' ? reviewing : null;
    await action(async () => {
      const { brandId, modelId, yearId, capacityId, typeId, variantId, premium } = selection;
      const specification = { brandId, modelId, yearId, capacityId, typeId, variantId: variantId || undefined, premium };
      if (application) await api.adminPost(`/operators/catalog/admin/applications/${application._id}/review`, { revision: application.revision, decision: 'APPROVE', reason, specification });
      else await api.adminPost('/operators/catalog/admin/specifications', specification);
      setSelection(EMPTY); setReviewing(null); setReason('');
    }, application ? 'Application approved. The vehicle is listed for future riders. This rider can now complete their availability checks.' : 'Vehicle specification published. Configure its fare on Vehicle fares.');
  }
  async function selectFile(selected?: File) {
    const fileVersion = ++fileReadGeneration.current;
    setFile(null); setPreview(null); setError('');
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.xlsx') || selected.size > 2 * 1024 * 1024) { setError('Choose an .xlsx workbook up to 2 MB.'); return; }
    const reader = new FileReader(); reader.onerror = () => { if (fileVersion === fileReadGeneration.current) setError('Could not read this file'); }; reader.onload = () => { if (fileVersion === fileReadGeneration.current) setFile({ name: selected.name, base64: String(reader.result).split(',')[1] }); }; reader.readAsDataURL(selected);
  }
  const chooser = <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Select label="Brand" value={selection.brandId} options={byKind('BRAND')} onChange={v => setSelection({ ...EMPTY, brandId: v })} />
    {selection.brandId && <Select label="Model" value={selection.modelId} options={byKind('MODEL').filter(e => e.parentId === selection.brandId)} onChange={v => setSelection({ ...EMPTY, brandId: selection.brandId, modelId: v })} />}
    {selection.modelId && <Select label="Release year" value={selection.yearId} options={byKind('RELEASE_YEAR').filter(e => e.parentId === selection.modelId || existingSelection && e._id === selection.yearId)} onChange={v => setSelection({ ...selection, yearId: v, capacityId: '', typeId: '', variantId: '' })} />}
    {selection.yearId && <Select label="Passenger seats / capacity" value={selection.capacityId} options={byKind('CAPACITY').filter(e => e.parentId === selection.yearId || existingSelection && e._id === selection.capacityId)} onChange={v => setSelection({ ...selection, capacityId: v, typeId: '', variantId: '' })} />}
    {selection.capacityId && <Select label="Vehicle type" value={selection.typeId} options={byKind('TYPE').filter(e => e.parentId === selection.brandId || existingSelection && e._id === selection.typeId)} onChange={v => setSelection({ ...selection, typeId: v, variantId: '' })} />}
    {categoryKind && <Select label={categoryKind === 'BODA_TYPE' ? 'Boda power type' : 'Truck category'} value={selection.variantId} options={byKind(categoryKind).filter(e => e.parentId === selection.typeId)} disabled={!selection.typeId} onChange={v => setSelection({ ...selection, variantId: v })} />}
    {selectionValid && <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm"><input type="checkbox" checked={selection.premium} onChange={e => setSelection({ ...selection, premium: e.target.checked })} /><Star size={16} className="text-amber-600" />Premium vehicle</label>}
  </div>;
  return <><Header title="Vehicle catalog" subtitle="Publish the vehicles your riders can select" /><main className="space-y-6 p-5 text-[#18334E] sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-3xl text-sm leading-6 text-slate-500">Create brands, models and vehicle specifications here. Review rider applications before publishing them. Manage prices separately in <Link className="font-medium text-[#18334E] underline" href="/dashboard/vehicle-fares">Vehicle fares</Link>.</p><button className={button} disabled={busy || loading} onClick={() => void load()}><RefreshCw size={16} />Refresh</button></div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Vehicle catalog sections">{['Master data', 'Specifications', 'Applications', 'Excel import'].map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? primary : button + ' bg-white'} onClick={() => { setTab(t); setSearch(''); }} disabled={busy}>{t}</button>)}</div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    {loading && <p role="status" className="text-sm text-slate-500">Loading catalog…</p>}
    {tab === 'Master data' && <><Section title="Create and manage master data" description="Create each level in order: brand, vehicle type and model under that brand, release year under the model, then seats or cargo capacity under that year. Controls remain unavailable until their parent exists.">
      <div className="mb-5 flex flex-wrap gap-2">{KINDS.filter(([k]) => k === 'BRAND' || parentsFor(k).length || entries.some(e => e.kind === k)).map(([k, l]) => <button className={kind === k ? primary : button} key={k} onClick={() => clearEntry(k)}>{l}</button>)}</div>
      <form onSubmit={saveEntry}><fieldset disabled={busy || loading} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parentKind && !editing && <Select label={kind === 'TYPE' || kind === 'MODEL' ? 'Brand' : kind === 'RELEASE_YEAR' ? 'Model' : kind === 'CAPACITY' ? 'Release year' : 'Vehicle type'} value={parent} options={parents.map(e => ({ ...e, label: entryLabel(e) }))} onChange={setParent} />}
        {(canCreate || editing) && <>
        {!numeric && (kind === 'BODA_TYPE' && !editing
          ? <Select label="Boda power type" value={label} options={[{ _id: 'Electric', label: 'Electric' }, { _id: 'Non-electric', label: 'Non-electric' }]} onChange={setLabel} />
          : <label className="text-sm">{names[kind]}<input className={field} required maxLength={80} value={label} onChange={e => setLabel(e.target.value)} /></label>)}
        {kind === 'TYPE' && <label className="text-sm">Operational group<select className={field} value={vehicleGroup} disabled={!!editing} onChange={e => setVehicleGroup(e.target.value)}>{['CAR', 'VAN', 'TRUCK', 'BODA'].map(g => <option key={g}>{g}</option>)}</select><span className="text-xs text-slate-500">Use CAR for SUV and saloon types.</span></label>}
        {['CAPACITY', 'RELEASE_YEAR'].includes(kind) && <label className="text-sm">{kind === 'CAPACITY' ? 'Seats excluding driver' : 'Release year'}<input type="number" required className={field} disabled={!!editing} min={kind === 'CAPACITY' ? 0 : 1900} max={kind === 'CAPACITY' ? 60 : new Date().getUTCFullYear() + 1} value={value} onChange={e => setValue(e.target.value)} /></label>}
        {kind === 'RELEASE_YEAR' && <label className="text-sm">Release date · optional<input type="date" className={field} disabled={!!editing} value={date} onChange={e => setDate(e.target.value)} /></label>}
        {editing && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />Active</label>}
        <div className="flex items-end gap-2"><button type="submit" className={primary}><Plus size={16} />{editing ? 'Save changes' : 'Create entry'}</button>{editing && <button type="button" className={button} onClick={() => clearEntry()}>Cancel edit</button>}</div>
        </>}
      </fieldset></form>
    </Section>
    <Section title={KINDS.find(([k]) => k === kind)?.[1] || ''}>
      <SearchField value={search} onChange={setSearch} />
      <div className="mt-4 divide-y">
        {entries.filter(entry => entry.kind === kind && entryLabel(entry).toLowerCase().includes(search.toLowerCase())).map(entry =>
          <div key={entry._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-sm font-medium">{entryLabel(entry)}</p>
              <p className="text-xs text-slate-500">{entry.code} · {entry.active ? 'Active' : 'Paused'}{entry.releaseDate ? ' · ' + entry.releaseDate : ''}</p>
            </div>
            <div className="flex gap-2">
              <button disabled={busy || loading} className={button} onClick={() => {
                setEditing(entry); setLabel(entry.label); setParent(entry.parentId || ''); setVehicleGroup(entry.vehicleType || 'CAR');
                setValue(entry.value == null ? '' : String(entry.value)); setDate(entry.releaseDate || ''); setActive(entry.active);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>Edit</button>
              <button disabled={busy || loading} className={button + ' border-red-200 text-red-700'} aria-label={`Delete ${entryLabel(entry)}`}
                onClick={() => setDeleting({ resource: 'entries', id: entry._id, revision: entry.revision, name: entryLabel(entry) })}>
                <Trash2 size={16} />Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {!entries.some(entry => entry.kind === kind) && <p className="mt-5 text-sm text-slate-500">No entries yet. Create one above or import an Excel workbook.</p>}
    </Section></>}
    {tab === 'Specifications' && <>
      <Section title="Publish a vehicle specification" description="Choose each field from master data. Add missing entries in Master data first. Set Premium cars’ prices and pickup-distance policies separately in Vehicle fares.">
        <form onSubmit={publish}><fieldset disabled={busy || loading} className="space-y-5">{chooser}<button className={primary} disabled={!selectionValid}><Plus size={16} />Publish listing</button></fieldset></form>
      </Section>
      <Section title="Published specifications">
        <SearchField value={search} onChange={setSearch} />
        <div className="mt-4 divide-y">
          {specs.filter(spec => `${describe(spec)} ${spec.typeLabel} ${spec.variantLabel}`.toLowerCase().includes(search.toLowerCase())).map(spec =>
            <div key={spec._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold"><Car size={17} />{describe(spec)}{spec.premium && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Premium</span>}</p>
                <p className="mt-1 text-xs text-slate-500">{spec.typeLabel} · {spec.variantLabel} · {spec.availableInCatalog ? 'Published' : 'Paused or parent inactive'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={button} disabled={busy || loading} onClick={() => void action(async () => {
                  await api.adminPut(`/operators/catalog/admin/specifications/${spec._id}`, { active: spec.active, premium: !spec.premium, revision: spec.revision });
                }, 'Premium label updated.')}>{spec.premium ? 'Remove premium' : 'Mark premium'}</button>
                <button className={button} disabled={busy || loading} onClick={() => void action(async () => {
                  await api.adminPut(`/operators/catalog/admin/specifications/${spec._id}`, { active: !spec.active, revision: spec.revision });
                }, 'Listing availability updated.')}>{spec.active ? 'Pause' : 'Activate'}</button>
                <button className={button + ' border-red-200 text-red-700'} disabled={busy || loading} aria-label={`Delete ${describe(spec)}`}
                  onClick={() => setDeleting({ resource: 'specifications', id: spec._id, revision: spec.revision, name: describe(spec) })}>
                  <Trash2 size={16} />Delete
                </button>
              </div>
            </div>
          )}
        </div>
        {!specs.length && <p className="mt-5 text-sm text-slate-500">No published vehicles yet. Create master data, then publish your first specification.</p>}
      </Section>
    </>}
    {tab === 'Applications' && <><Section title="Rider listing applications" description="Pending riders can save registration but cannot go online until approval. Select the corrected specification below; the approved catalog details replace their proposed details."><div className="flex gap-3"><label className="text-sm">Status<select className={field} value={status} onChange={e => { setStatus(e.target.value); setPage(1); setReviewing(null); }}>{['PENDING', 'APPROVING', 'APPROVED', 'REJECTED', 'ALL'].map(s => <option key={s}>{s}</option>)}</select></label></div><div className="mt-4 divide-y">{applications.map(a => <div key={a._id} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="text-sm font-semibold">{describe(a)}</p><p className="mt-1 text-xs text-slate-500">{a.vehicleType} · {a.vehicleVariant} · {a.status} · {new Date(a.createdAt).toLocaleDateString()}</p><p className="mt-1 text-xs text-slate-500">{a.reviewReason || 'Awaiting catalog review'}</p></div>{['PENDING', 'APPROVING'].includes(a.status) && <button className={button} disabled={busy} onClick={() => startReview(a)}>Review listing</button>}</div>)}</div>{!applications.length && <p className="mt-5 text-sm text-slate-500">No applications in this view.</p>}<div className="mt-5 flex items-center gap-3"><button className={button} disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button><span className="text-sm">Page {page}</span><button className={button} disabled={applications.length < 100 || loading} onClick={() => setPage(p => p + 1)}>Next</button></div></Section>
      {reviewing && <Section title="Review and correct vehicle details" description={`Rider proposed: ${describe(reviewing)} · ${reviewing.vehicleType} / ${reviewing.vehicleVariant}. Create missing master entries first, then return here to select the corrected details.`}><button className={button + ' mb-4'} onClick={() => setTab('Master data')}>Open master data</button><form onSubmit={publish}><fieldset disabled={busy || loading} className="space-y-5">{chooser}<label className="block text-sm">Review note / rejection reason<textarea maxLength={500} className={field} value={reason} onChange={e => setReason(e.target.value)} /></label><div className="flex flex-wrap gap-3"><button className={primary} disabled={!selectionValid}><Check size={16} />Approve and publish</button><button className={button} type="button" disabled={!reason.trim() || reviewing.status !== 'PENDING'} onClick={() => void action(async () => { await api.adminPost(`/operators/catalog/admin/applications/${reviewing._id}/review`, { revision: reviewing.revision, decision: 'REJECT', reason }); setReviewing(null); }, 'Application rejected with the reason provided.')}>Reject with reason</button><button className={button} type="button" onClick={() => setReviewing(null)}>Cancel review</button></div></fieldset></form></Section>}</>}
    {tab === 'Excel import' && <Section title="Import vehicle specifications from Excel" description="Download the template, enter up to 500 rows and preview before importing. Existing identities are reused; fares are never imported. Imports stop on a conflict and can safely be repeated after correction."><div className="flex flex-wrap gap-3"><button className={button} disabled={busy} onClick={() => void action(async () => { const r = await api.adminGet<{ data: { workbookBase64: string } }>('/operators/catalog/admin/excel-template'); const blob = new Blob([Uint8Array.from(atob(r.data.workbookBase64), c => c.charCodeAt(0))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'lookiy-vehicle-catalog.xlsx'; a.click(); URL.revokeObjectURL(url); }, 'Excel template downloaded.')}><Download size={16} />Download template</button><label className={button + ' cursor-pointer'}><Upload size={16} />Choose .xlsx<input className="sr-only" aria-label="Excel workbook" type="file" accept=".xlsx" disabled={busy} onChange={e => void selectFile(e.target.files?.[0])} /></label></div>{file && <p className="mt-4 text-sm">{file.name}</p>}<div className="mt-4 flex gap-3"><button className={primary} disabled={!file || busy} onClick={() => void action(async () => { const r = await api.adminPost<{ data: NonNullable<typeof preview> }>('/operators/catalog/admin/excel-import', { workbookBase64: file!.base64, commit: false }); setPreview(r.data); }, 'Workbook checked. Review the rows and any errors below.')}><Search size={16} />Preview workbook</button><button className={primary} disabled={!file || !preview || !!preview.errors.length || !preview.rows.length || busy} onClick={() => void action(async () => { const r = await api.adminPost<{ data: NonNullable<typeof preview> }>('/operators/catalog/admin/excel-import', { workbookBase64: file!.base64, commit: true }); setPreview(r.data); if (r.data.errors.length) throw new Error('Catalog changed. Resolve the errors and preview again.'); }, 'Vehicle specifications imported.')}>Import {preview?.rows.length || ''} rows</button></div>{preview && <div className="mt-5 space-y-3"><p className="text-sm">{preview.rows.length} valid rows · {preview.errors.length} errors · {preview.imported} imported</p>{preview.errors.map(e => <p className="text-sm text-red-700" key={e.row}>Row {e.row}: {e.message}</p>)}<div className="max-h-96 overflow-auto rounded-xl border"><table className="w-full text-left text-xs"><thead className="bg-slate-50"><tr>{['Row', 'Type', 'Group', 'Category', 'Brand', 'Model', 'Seats', 'Year'].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{preview.rows.map(r => <tr className="border-t" key={r.row}>{['row', 'type', 'vehicleGroup', 'category', 'brand', 'model', 'seats', 'releaseYear'].map(k => <td className="p-3" key={k}>{r[k]}</td>)}</tr>)}</tbody></table></div></div>}</Section>}
    {deleting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5">
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-vehicle-title" aria-describedby="delete-vehicle-description"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onKeyDown={event => {
          if (event.key === 'Escape' && !busy) setDeleting(null);
          if (event.key === 'Tab') {
            const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }
        }}>
        <h2 id="delete-vehicle-title" className="text-lg font-semibold">Delete {deleting.name}?</h2>
        <p id="delete-vehicle-description" className="mt-3 text-sm leading-6 text-slate-600">
          {deleting.resource === 'entries'
            ? 'This entry and the vehicle choices that depend on it will be removed from the catalog.'
            : 'This vehicle will be removed from the catalog and new registration and booking choices.'}
          {' '}Linked rider and journey records will be retained. Riders using a deleted listing must choose another listed vehicle before going online again.
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button autoFocus className={button} disabled={busy} onClick={() => setDeleting(null)}>Cancel</button>
          <button className={button + ' border-red-700 bg-red-700 text-white'} disabled={busy} onClick={() => void confirmDelete()}>
            <Trash2 size={16} />{busy ? 'Deleting…' : 'Delete vehicle'}
          </button>
        </div>
      </div>
    </div>}
  </main></>;
}
function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) { return <section className="rounded-2xl border border-[#E2E8EE] bg-white p-5 sm:p-6"><h2 className="mb-2 text-lg font-semibold">{title}</h2>{description && <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}{children}</section>; }
function Select({ label, value, options, onChange, disabled }: { label: string; value: string; options: { _id: string; label: string }[]; onChange: (v: string) => void; disabled?: boolean }) { return <label className="text-sm">{label}<select aria-label={label} required className={field} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}><option value="">Choose {label.toLowerCase()}</option>{options.map(e => <option key={e._id} value={e._id}>{e.label}</option>)}</select></label>; }
function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <label className="block max-w-md text-sm">Search catalog<input type="search" className={field} value={value} onChange={e => onChange(e.target.value)} placeholder="Brand, model or year" /></label>; }
