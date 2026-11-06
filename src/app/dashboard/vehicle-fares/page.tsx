'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { CircleDollarSign, Pencil, Plus, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import { normalizeVehicleOption, vehicleFareSelections, type RegisteredVehicleSpecification } from '@/lib/vehicle-fare-options';

type Specification = { vehicleBrand?: string; vehicleModel?: string; vehicleYear?: number; vehicleCapacity: number };
type Fare = Specification & { premiumPickupThresholdKm?: number; _id: string; vehicleType: string; vehicleVariant: string; baseFareUGX: number; perKmUGX: number; additionalPassengerPercent?: number; active: boolean; revision: number; updatedAt?: string };
type VehicleType = { type: string; label: string; variants: { id: string; label: string }[] };
const description = (spec: Specification) => spec.vehicleBrand ? `${spec.vehicleBrand} ${spec.vehicleModel} · ${spec.vehicleYear} · ${spec.vehicleCapacity ? spec.vehicleCapacity + ' passenger seats' : 'Cargo'}` : `Boda · ${spec.vehicleCapacity ? spec.vehicleCapacity + ' passenger(s)' : 'Delivery'}`;
const ugx = (amount: number) => 'UGX ' + amount.toLocaleString('en-UG');
const fieldClass = 'mt-2 min-h-[44px] w-full rounded-xl border border-[#DCE4EB] bg-white px-3 py-2 text-sm text-[#18334E] disabled:bg-[#F3F6F8]';

export default function VehicleFaresPage() {
  const [fares, setFares] = useState<Fare[]>([]), [catalog, setCatalog] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [type, setType] = useState('CAR'), [variant, setVariant] = useState('SUV');
  const [brand, setBrand] = useState(''), [model, setModel] = useState(''), [year, setYear] = useState(''), [seats, setSeats] = useState('');
  const [editing, setEditing] = useState<Fare | null>(null);
  const [pickupThreshold, setPickupThreshold] = useState('');
  const [base, setBase] = useState(''), [perKm, setPerKm] = useState(''), [active, setActive] = useState(true), [search, setSearch] = useState('');
  const [extraPercent, setExtraPercent] = useState(''), [previewPassengers, setPreviewPassengers] = useState('1');
  const [registered, setRegistered] = useState<{ key: string; rows: RegisteredVehicleSpecification[] }>({ key: '', rows: [] });
  const [optionsLoading, setOptionsLoading] = useState(false), [optionsError, setOptionsError] = useState(''), [optionsRevision, setOptionsRevision] = useState(0);
  const optionsKey = `${type}|${variant}`;
  const generation = useRef(0);
  const editor = useRef<HTMLElement | null>(null);
  const load = useCallback(async () => {
    const version = ++generation.current;
    setLoading(true); setError('');
    try {
      const response = await api.adminGet<{ data: Fare[]; meta: { vehicles: VehicleType[] } }>('/geo/admin/vehicle-fares');
      if (version !== generation.current) return;
      setFares(response.data); setCatalog(response.meta.vehicles);
    } catch (error) { if (version === generation.current) setError(error instanceof Error ? error.message : 'Could not load vehicle fares.'); }
    finally { if (version === generation.current) setLoading(false); }
  }, []);
  useEffect(() => { void load(); const requests = generation; return () => { requests.current++; }; }, [load]);
  useEffect(() => {
    if (editing || type === 'BODA' || !catalog.length) return;
    let current = true;
    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);
    setOptionsLoading(true); setOptionsError('');
    const params = new URLSearchParams({ vehicleType: type, vehicleVariant: variant });
    void api.adminGet<{ data: RegisteredVehicleSpecification[] }>(`/operators/admin/vehicle-options?${params}`, { signal: controller.signal })
      .then(response => { if (current) setRegistered({ key: optionsKey, rows: response.data }); })
      .catch(error => { if (current) { setRegistered({ key: optionsKey, rows: [] }); setOptionsError(timedOut ? 'Loading vehicle choices timed out. Please retry.' : error instanceof Error ? error.message : 'Could not load published catalog vehicles.'); } })
      .finally(() => { clearTimeout(timeout); if (current) setOptionsLoading(false); });
    return () => { current = false; clearTimeout(timeout); controller.abort(); };
  }, [type, variant, optionsKey, editing, catalog, optionsRevision]);
  const existingOptions = registered.key === optionsKey ? registered.rows : [];
  const selections = vehicleFareSelections(existingOptions, brand, model, year);
  function reset() { setPickupThreshold(''); setEditing(null); setBrand(''); setModel(''); setYear(''); setSeats(type === 'TRUCK' ? '0' : type === 'BODA' ? '1' : ''); setBase(''); setPerKm(''); setExtraPercent(type === 'BODA' ? '0' : ''); setPreviewPassengers('1'); setActive(true); }
  function edit(fare: Fare) {
    setPickupThreshold(fare.premiumPickupThresholdKm == null ? '' : String(fare.premiumPickupThresholdKm)); setEditing(fare); setType(fare.vehicleType); setVariant(fare.vehicleVariant); setBrand(fare.vehicleBrand || ''); setModel(fare.vehicleModel || ''); setYear(fare.vehicleYear ? String(fare.vehicleYear) : ''); setSeats(String(fare.vehicleCapacity)); setExtraPercent(fare.additionalPassengerPercent == null ? '' : String(fare.additionalPassengerPercent)); setPreviewPassengers('1');
    setBase(String(fare.baseFareUGX)); setPerKm(String(fare.perKmUGX)); setActive(fare.active); setError(''); setMessage('');
    editor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const validAmounts = base.trim() !== '' && perKm.trim() !== '' && Number.isSafeInteger(Number(base)) && Number(base) >= 0 && Number(base) <= 10000000 && Number.isSafeInteger(Number(perKm)) && Number(perKm) >= 1 && Number(perKm) <= 10000000 && extraPercent.trim() !== '' && Number.isInteger(Number(extraPercent)) && Number(extraPercent) >= 0 && Number(extraPercent) <= 1000;
  const maxYear = new Date().getUTCFullYear() + 1;
  const registeredSelection = existingOptions.some(row => normalizeVehicleOption(row.vehicleBrand) === normalizeVehicleOption(brand) && normalizeVehicleOption(row.vehicleModel) === normalizeVehicleOption(model) && row.vehicleYear === Number(year) && row.vehicleCapacity === Number(seats));
  const validSpecification = (type === 'BODA' ? ['0', '1', '2'].includes(seats) && Number(extraPercent) === 0 : (!!editing || !optionsLoading && !optionsError && registeredSelection) && !!brand.trim() && brand.trim().length <= 80 && !!model.trim() && model.trim().length <= 80 && /^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= maxYear && /^\d+$/.test(seats) && Number(seats) >= (type === 'TRUCK' ? 0 : 1) && Number(seats) <= 60) && !!catalog.find(item => item.type === type)?.variants.some(item => item.id === variant);
  const previewCount = type === 'BODA' ? Number(seats) : Number(seats) === 0 ? 0 : Number(previewPassengers);
  const validPreview = Number.isInteger(previewCount) && previewCount >= 0 && previewCount <= Number(seats);
  const previewFare = validAmounts && validPreview ? Math.ceil(((Number(base) + 5 * Number(perKm)) * (1 + Number(extraPercent) / 100 * Math.max(0, previewCount - 1))) / 500) * 500 : null;
  async function save(event: FormEvent) {
    event.preventDefault();
    if (loading || saving || !validSpecification || !validAmounts) return;
    if (pickupThreshold && (!Number.isFinite(Number(pickupThreshold)) || Number(pickupThreshold) < 0.1 || Number(pickupThreshold) > 10)) { setError('Set a Premium pickup distance between 0.1 and 10 km.'); return; }
    setSaving(true); setError(''); setMessage('');
    try {
      const amounts = { ...(type === 'CAR' && pickupThreshold ? { premiumPickupThresholdKm: Number(pickupThreshold) } : {}), baseFareUGX: Number(base), perKmUGX: Number(perKm), additionalPassengerPercent: Number(extraPercent), active };
      const response = editing
        ? await api.adminPut<{ data: Fare }>(`/geo/admin/vehicle-fares/${editing._id}`, { ...amounts, revision: editing.revision })
        : await api.adminPost<{ data: Fare }>('/geo/admin/vehicle-fares', { ...amounts, vehicleType: type, vehicleVariant: variant, ...(type !== 'BODA' ? { catalogSpecificationId: existingOptions.find(row => normalizeVehicleOption(row.vehicleBrand) === normalizeVehicleOption(brand) && normalizeVehicleOption(row.vehicleModel) === normalizeVehicleOption(model) && row.vehicleYear === Number(year) && row.vehicleCapacity === Number(seats))?.catalogSpecificationId, vehicleBrand: brand.trim().replace(/\s+/g, ' '), vehicleModel: model.trim().replace(/\s+/g, ' '), vehicleYear: Number(year) } : {}), vehicleCapacity: Number(seats) });
      setFares(previous => [...previous.filter(fare => fare._id !== response.data._id), response.data].sort((a, b) => description(a).localeCompare(description(b))));
      setMessage('Fare saved. New estimates use this rate; existing journeys keep their recorded fare.'); reset();
    } catch (error) { setError(error instanceof Error ? error.message : 'The fare could not be saved.'); }
    finally { setSaving(false); }
  }
  const selectedType = catalog.find(item => item.type === type);
  const label = (fare: Fare) => `${catalog.find(item => item.type === fare.vehicleType)?.label || fare.vehicleType} · ${catalog.find(item => item.type === fare.vehicleType)?.variants.find(item => item.id === fare.vehicleVariant)?.label || fare.vehicleVariant}`;
  const filtered = fares.filter(fare => `${label(fare)} ${description(fare)}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <><Header title="Vehicle fares" subtitle="Manage all vehicle rates and passenger adjustments" />
    <main className="space-y-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl text-sm leading-6 text-[#6B7D8C]">Set base fare, kilometre rate and additional-passenger percentage here. Boda rates are shared by both power types, with separate rules for one passenger, two passengers and delivery. No prices are filled in automatically.</p><button disabled={loading || saving} onClick={() => { reset(); void load(); }} className="flex min-h-[44px] items-center gap-2 rounded-xl border bg-white px-4 text-sm disabled:opacity-50"><RefreshCw size={16} />Refresh</button></div>
      {error && <p role="alert" className="rounded-xl border border-[#F0D9D2] bg-[#FFF6F3] p-4 text-sm text-[#A35C52]">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-[#E8F5F0] p-4 text-sm text-[#248066]">{message}</p>}
      <section ref={editor} className="scroll-mt-28 rounded-2xl border border-[#E1E7EC] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2"><CircleDollarSign size={20} className="text-[#D98B2B]" /><h2 className="text-lg font-semibold text-[#102B48]">{editing ? 'Edit vehicle fare' : 'Add vehicle fare'}</h2></div>
        <form onSubmit={save} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-xs font-semibold text-[#506174]">Vehicle type<select aria-label="Vehicle type" className={fieldClass} value={type} disabled={!!editing || loading || saving} onChange={event => { const next = catalog.find(item => item.type === event.target.value)!; setType(next.type); setVariant(next.variants[0].id); setBrand(''); setModel(''); setYear(''); setSeats(next.type === 'TRUCK' ? '0' : next.type === 'BODA' ? '1' : ''); setExtraPercent(next.type === 'BODA' ? '0' : ''); setBase(''); setPerKm(''); setPickupThreshold(''); setPreviewPassengers('1'); }}>
            {catalog.map(item => <option key={item.type} value={item.type}>{item.label}</option>)}
          </select></label>
          <label className="text-xs font-semibold text-[#506174]">Category<select aria-label="Vehicle category" className={fieldClass} value={variant} disabled={!!editing || loading || saving} onChange={event => { setVariant(event.target.value); setBrand(''); setModel(''); setYear(''); setSeats(''); }}>
            {selectedType?.variants.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select></label>
          {type !== 'BODA' && <><label className="text-xs font-semibold text-[#506174]">Brand<select aria-label="Vehicle brand" required className={fieldClass} value={brand} disabled={!!editing || loading || saving || optionsLoading || !existingOptions.length} onChange={event => { setBrand(event.target.value); setModel(''); setYear(''); setSeats(''); }}><option value="">{optionsLoading ? 'Loading existing brands…' : 'Choose an existing brand'}</option>{(editing ? [brand] : selections.brands).map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="text-xs font-semibold text-[#506174]">Model<select aria-label="Vehicle model" required className={fieldClass} value={model} disabled={!!editing || loading || saving || optionsLoading || !brand} onChange={event => { setModel(event.target.value); setYear(''); setSeats(''); }}><option value="">{brand ? 'Choose an existing model' : 'Choose a brand first'}</option>{(editing ? [model] : selections.models).map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className="text-xs font-semibold text-[#506174]">Release year<select aria-label="Vehicle release year" required className={fieldClass} value={year} disabled={!!editing || loading || saving || optionsLoading || !model} onChange={event => { setYear(event.target.value); setSeats(''); }}><option value="">{model ? 'Choose an existing year' : 'Choose a model first'}</option>{(editing ? [Number(year)] : selections.years).map(value => <option key={value} value={value}>{value}</option>)}</select></label></>}
          {type === 'BODA' ? <label className="text-xs font-semibold text-[#506174]">Boda rate applies to<select aria-label="Boda passenger rate" className={fieldClass} value={seats} disabled={!!editing || loading || saving} onChange={event => setSeats(event.target.value)}><option value="1">1 passenger</option><option value="2">2 passengers</option><option value="0">Delivery · no passengers</option></select></label> : <label className="text-xs font-semibold text-[#506174]">Passenger seats<select aria-label="Passenger seats excluding driver" required className={fieldClass} value={seats} disabled={!!editing || loading || saving || optionsLoading || !year} onChange={event => setSeats(event.target.value)}><option value="">{year ? 'Choose registered seats' : 'Choose a year first'}</option>{(editing ? [Number(seats)] : selections.seats).map(value => <option key={value} value={value}>{value === 0 ? '0 · Cargo' : value}</option>)}</select><span className="mt-1 block font-normal text-[#718092]">Actual registered capacity, excluding the driver.</span></label>}
          {type !== 'BODA' && !editing && <p className="text-sm text-[#718092] md:col-span-2 xl:col-span-3">{optionsError || (optionsLoading ? 'Loading published vehicle details…' : existingOptions.length ? 'Choices include published catalog vehicles even when their operators are offline.' : 'No complete published catalog vehicles for this category yet. Operators can add or update their vehicle details from their account.')} <button type="button" disabled={optionsLoading || saving} onClick={() => setOptionsRevision(value => value + 1)} className="underline">Reload vehicle choices</button></p>}
          {editing && <p className="text-sm text-[#718092] md:col-span-2 xl:col-span-3">Vehicle details identify this fare and stay fixed while editing rates. Add a new fare for another vehicle specification.</p>}
          <label className="text-xs font-semibold text-[#506174]">Base fare · UGX<input aria-label="Base fare in UGX" required type="number" min="0" max="10000000" step="1" className={fieldClass} value={base} disabled={saving} onChange={event => setBase(event.target.value)} placeholder="Enter base fare" /></label>
          <label className="text-xs font-semibold text-[#506174]">Per kilometre · UGX<input aria-label="Fare per kilometre in UGX" required type="number" min="1" max="10000000" step="1" className={fieldClass} value={perKm} disabled={saving} onChange={event => setPerKm(event.target.value)} placeholder="Enter kilometre rate" /></label>
          {type !== 'BODA' && <label className="text-xs font-semibold text-[#506174]">Each additional passenger · %<input aria-label="Additional passenger percentage" required type="number" min="0" max="1000" step="1" className={fieldClass} value={extraPercent} disabled={saving} onChange={event => setExtraPercent(event.target.value)} placeholder="Enter percentage; 0 for no surcharge" /><span className="mt-1 block font-normal text-[#718092]">Applied once to both base and distance charges. Delivery has no passenger adjustment.</span></label>}
          {type !== 'BODA' && Number(seats) > 0 && <label className="text-xs font-semibold text-[#506174]">Preview passengers<input aria-label="Preview passenger count" type="number" min="1" max={Number(seats)} step="1" className={fieldClass} value={previewPassengers} onChange={event => setPreviewPassengers(event.target.value)} /></label>}
          {type === 'CAR' && <label className="text-xs font-semibold text-[#506174]">Premium pickup distance · km<input aria-label="Premium pickup distance in km" type="number" min="0.1" max="10" step="0.1" className={fieldClass} value={pickupThreshold} disabled={saving} onChange={event => setPickupThreshold(event.target.value)} placeholder="Set distance for Premium cars" /><span className="mt-2 block text-xs font-normal leading-5 text-[#718092]">Required before a Premium car can be booked. Drivers farther than this distance need client approval for a 10% pickup fee. Other cars have no pickup surcharge.</span></label>}
          <div className="flex flex-col justify-center gap-3"><label className="flex min-h-[44px] items-center gap-3 text-sm text-[#334D62]"><input type="checkbox" checked={active} disabled={saving} onChange={event => setActive(event.target.checked)} />Active for new estimates</label><p className="text-xs leading-5 text-[#718092]">Fare = (base + kilometres × rate) × passenger adjustment, rounded up once to UGX 500. {previewFare != null ? `A 5 km ${previewCount ? `trip for ${previewCount} passenger(s)` : 'delivery'} would cost ${ugx(previewFare)}.` : ''}</p></div>
          <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3"><button type="submit" disabled={loading || saving || !validSpecification || !validAmounts} className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#102B48] px-5 text-sm font-semibold text-white disabled:opacity-40"><Plus size={16} />{saving ? 'Saving…' : editing ? 'Save changes' : 'Save fare'}</button>{editing && <button type="button" disabled={saving} onClick={reset} className="min-h-[44px] rounded-xl border px-5 text-sm">Cancel edit</button>}</div>
        </form>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#E1E7EC] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5"><h2 className="font-semibold text-[#102B48]">Configured fares</h2><label className="text-xs text-[#718092]">Search fares<input aria-label="Search configured fares" className={fieldClass} value={search} onChange={event => setSearch(event.target.value)} placeholder="Brand, category, model or year" /></label></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[1080px] text-left text-sm"><thead className="border-y bg-[#F5F7F9] text-xs text-[#718092]"><tr>{['Vehicle / category', 'Brand', 'Model', 'Release year', 'Seats', 'Base fare', 'Per km', 'Extra passenger', 'Premium pickup', 'Status', 'Actions'].map(name => <th key={name} className="px-5 py-3 font-medium">{name}</th>)}</tr></thead><tbody>{filtered.map(fare => <tr key={fare._id} className="border-b border-[#EDF0F3]"><td className="px-5 py-4 text-[#334D62]"><p>{label(fare)}</p><p className="mt-1 text-xs text-[#8A98A5]">Revision {fare.revision}</p></td><td className="px-5 py-4 font-medium text-[#18334E]">{fare.vehicleBrand || 'Both power types'}</td><td className="px-5 py-4">{fare.vehicleModel || '—'}</td><td className="px-5 py-4">{fare.vehicleYear || '—'}</td><td className="px-5 py-4">{fare.vehicleCapacity === 0 ? '0 · Cargo' : fare.vehicleCapacity}</td><td className="px-5 py-4">{ugx(fare.baseFareUGX)}</td><td className="px-5 py-4">{ugx(fare.perKmUGX)}</td><td className="px-5 py-4">{fare.additionalPassengerPercent == null ? 'Set percentage' : fare.additionalPassengerPercent + '%'}</td><td className="px-5 py-4">{fare.premiumPickupThresholdKm == null ? 'Not set' : fare.premiumPickupThresholdKm + ' km · +10%'}</td><td className="px-5 py-4"><span className={fare.active ? 'rounded-lg bg-[#E8F5F0] px-2 py-1 text-xs text-[#248066]' : 'rounded-lg bg-[#F0F2F5] px-2 py-1 text-xs text-[#718092]'}>{fare.active ? 'Active' : 'Paused'}</span></td><td className="px-5 py-4"><button aria-label={`Edit fare for ${description(fare)}`} disabled={saving} onClick={() => edit(fare)} className="flex min-h-[44px] items-center gap-2 rounded-lg border px-3 text-xs"><Pencil size={14} />Edit</button></td></tr>)}</tbody></table></div>
        {loading ? <p role="status" className="p-8 text-sm text-[#718092]">Loading fares…</p> : !filtered.length && <p className="p-8 text-sm text-[#718092]">No matching fares. Add a rate for a vehicle specification.</p>}
      </section>
    </main>
  </>;
}
