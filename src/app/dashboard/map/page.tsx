'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Activity, ArrowRight, Circle, Eye, MapPin, Navigation2, RefreshCw, Search, Signal, SignalZero } from 'lucide-react';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';

interface Point { lat: number; lng: number; timestamp?: string }
interface LiveRider extends Point { operatorId: string; activeJourneyId?: string | null; speed?: number; heading?: number; timestamp?: string }
interface Journey { _id: string; operatorId?: string; clientId?: string; status: string; pickupLocation?: Point & { address?: string }; destination?: Point & { address?: string }; createdAt?: string; agreedPrice?: number }
interface Route { journeyId: string; plannedRoute: Point[]; actualRoute: Point[]; coveredKm: number; remainingKm: number | null }
const routeColor = (id: string) => { let hash = 2166136261; for (let index = 0; index < id.length; index++) hash = Math.imul(hash ^ id.charCodeAt(index), 16777619); return `hsl(${(hash >>> 0) % 360} 68% 43%)`; };
const short = (id?: string) => id ? `#${id.slice(-6).toUpperCase()}` : '—';
let mapsLoader: Promise<any> | null = null;
function loadGoogleMaps(key: string) {
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Map) return Promise.resolve((window as any).google);
  if (!mapsLoader) mapsLoader = new Promise((resolve, reject) => {
    const callback = 'lookiyAdminMapsReady';
    const script = document.createElement('script');
    const timer = window.setTimeout(() => { script.remove(); mapsLoader = null; reject(new Error('Google Maps timed out.')); }, 15000);
    (window as any)[callback] = () => { window.clearTimeout(timer); delete (window as any)[callback]; resolve((window as any).google); };
    script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, v: 'weekly', libraries: 'marker', loading: 'async', callback })}`;
    script.async = true;
    script.onerror = () => { window.clearTimeout(timer); mapsLoader = null; reject(new Error('Google Maps could not load.')); };
    document.head.appendChild(script);
  });
  return mapsLoader;
}
function distance(a: Point, b: Point) { const y = (b.lat - a.lat) * 111; const x = (b.lng - a.lng) * 111 * Math.cos(a.lat * Math.PI / 180); return x * x + y * y; }
function remainingPath(route: Route) { const planned = route.plannedRoute || [], actual = route.actualRoute || []; if (!planned.length || !actual.length) return planned; const last = actual[actual.length - 1]; let nearest = 0; planned.forEach((point, index) => { if (distance(point, last) < distance(planned[nearest], last)) nearest = index; }); return [last, ...planned.slice(nearest + 1)]; }
function LiveMap({ riders, journeys, routes, selected, onSelect }: { riders: LiveRider[]; journeys: Journey[]; routes: Record<string, Route>; selected: string; onSelect: (id: string) => void }) {
  const node = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
  useEffect(() => { if (!key || !node.current) return; let active = true; loadGoogleMaps(key).then(google => { if (!active || !node.current) return; map.current = new google.maps.Map(node.current, { center: { lat: .3476, lng: 32.5825 }, zoom: 12, mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID', disableDefaultUI: true, zoomControl: true, clickableIcons: false, gestureHandling: 'greedy' }); setReady(true); }).catch(failure => { if (active) setError(failure.message); }); return () => { active = false; }; }, [key]);
  useEffect(() => { if (!ready || !map.current) return; const google = (window as any).google; const overlays: any[] = []; const bounds = new google.maps.LatLngBounds(); const addMarker = (position: Point, color: string, title: string, id: string, glyph?: string) => { if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) return; const pin = new google.maps.marker.PinElement({ background: color, borderColor: '#FFFFFF', glyphColor: '#FFFFFF', glyph: glyph || '●', scale: id === selected ? 1.35 : 1.05 }); const marker = new google.maps.marker.AdvancedMarkerElement({ map: map.current, position, title, content: pin.element || pin }); marker.addListener('click', () => onSelect(id)); overlays.push(marker); bounds.extend(position); };
    journeys.forEach(journey => { const route = routes[journey._id]; const color = routeColor(journey._id); if (route?.actualRoute?.length > 1) { const line = new google.maps.Polyline({ map: map.current, path: route.actualRoute, strokeColor: color, strokeOpacity: selected && selected !== journey._id ? .38 : .95, strokeWeight: selected === journey._id ? 6 : 4, zIndex: selected === journey._id ? 3 : 1 }); overlays.push(line); route.actualRoute.forEach(point => bounds.extend(point)); } const remaining = route ? remainingPath(route) : []; if (remaining.length > 1) { const dots = new google.maps.Polyline({ map: map.current, path: remaining, strokeOpacity: 0, icons: [{ icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: color, fillOpacity: selected && selected !== journey._id ? .4 : .9, strokeOpacity: 0, scale: selected === journey._id ? 3 : 2.5 }, offset: '0', repeat: '13px' }], zIndex: 2 }); overlays.push(dots); remaining.forEach(point => bounds.extend(point)); } if (journey.pickupLocation && !route?.actualRoute?.length) addMarker(journey.pickupLocation, color, `${short(journey._id)} pickup`, journey._id, 'P'); });
    riders.forEach(rider => addMarker(rider, rider.activeJourneyId ? routeColor(rider.activeJourneyId) : '#40566C', `Rider ${short(rider.operatorId)}`, rider.activeJourneyId || rider.operatorId, 'R'));
    if (!bounds.isEmpty() && !(map.current as any).__lookiyFit) { map.current.fitBounds(bounds, 65); (map.current as any).__lookiyFit = true; }
    return () => overlays.forEach(overlay => { if ('setMap' in overlay) overlay.setMap(null); else overlay.map = null; });
  }, [ready, riders, journeys, routes, selected, onSelect]);
  useEffect(() => { if (!ready || !selected || !map.current) return; const journey = journeys.find(item => item._id === selected); const rider = riders.find(item => item.activeJourneyId === selected || item.operatorId === selected); const point = rider || routes[selected]?.actualRoute?.at(-1) || journey?.pickupLocation; if (point) { map.current.panTo({ lat: point.lat, lng: point.lng }); if (map.current.getZoom() < 13) map.current.setZoom(13); } }, [selected, ready, riders, journeys, routes]);
  return <div className="relative min-h-[430px] flex-1 overflow-hidden bg-[#E9EEF1]"><div ref={node} className="absolute inset-0" />{!ready && <div className="absolute inset-0 grid place-items-center bg-[#E9EEF1]"><div className="max-w-xs rounded-2xl border border-white/80 bg-white/90 p-6 text-center shadow-sm"><MapPin size={23} className="mx-auto text-[#52738B]" /><p className="mt-3 text-sm font-semibold text-[#102B48]">{!key ? 'Google Maps key needed' : error || 'Connecting to Google Maps…'}</p><p className="mt-2 text-xs leading-5 text-[#728295]">{!key ? 'Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to the admin environment to display live map tiles.' : 'Journey and rider lists remain available while the map connects.'}</p></div></div>}</div>;
}
export default function LiveMapPage() {
  const searchParams = useSearchParams();
  const [riders, setRiders] = useState<LiveRider[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [selected, setSelected] = useState(searchParams.get('journey') || '');
  const [search, setSearch] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const refreshInProgress = useRef(false);
  const refresh = useCallback(async () => {
    if (refreshInProgress.current) return;
    refreshInProgress.current = true;
    setRefreshing(true); setError('');
    try {
      const status = 'MATCHED,EN_ROUTE,ARRIVED,LOCKED,STARTED,ACTIVE';
      const [locationResult, firstPage] = await Promise.all([
        api.adminGet('/tracking/admin/locations'),
        api.adminGet(`/journeys/admin/all?status=${status}&limit=100&page=1`),
      ]);
      const live = Array.isArray(locationResult?.data) ? locationResult.data : [];
      const active: Journey[] = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];
      const total = Number(firstPage?.pagination?.total ?? firstPage?.meta?.total ?? active.length);
      for (let page = 2; page <= Math.ceil(total / 100); page += 1) {
        const result = await api.adminGet(`/journeys/admin/all?status=${status}&limit=100&page=${page}`);
        if (!Array.isArray(result?.data) || !result.data.length) break;
        active.push(...result.data);
      }
      const chunks: Journey[][] = [];
      for (let index = 0; index < active.length; index += 100) chunks.push(active.slice(index, index + 100));
      const results = await Promise.allSettled(chunks.map(chunk => api.adminPost('/tracking/admin/routes', { journeyIds: chunk.map(journey => journey._id) })));
      const next: Record<string, Route> = {};
      results.forEach(result => { if (result.status === 'fulfilled' && Array.isArray(result.value?.data)) result.value.data.forEach((route: Route) => { next[route.journeyId] = route; }); });
      setRiders(live); setJourneys(active); setRoutes(next); setUpdatedAt(new Date());
      if (results.some(result => result.status === 'rejected')) setError('Some routes could not be loaded. Live rider locations and journeys are still shown.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not load tracking data.'); }
    finally { refreshInProgress.current = false; setRefreshing(false); }
  }, []);
  useEffect(() => { void refresh(); const interval = window.setInterval(() => void refresh(), 12000); return () => window.clearInterval(interval); }, [refresh]);
  const active = useMemo(() => journeys.filter(journey => !search || [journey._id, journey.pickupLocation?.address, journey.destination?.address, journey.operatorId].some(value => String(value || '').toLowerCase().includes(search.toLowerCase()))).filter(journey => !onlyActive || ['STARTED', 'ACTIVE'].includes(journey.status)), [journeys, search, onlyActive]);
  const selectedJourney = journeys.find(journey => journey._id === selected);
  const selectedRider = riders.find(rider => rider.activeJourneyId === selected || rider.operatorId === selected);
  const selectedRoute = routes[selected];
  return <div className="min-h-screen bg-[#F5F6F7]"><Header title="Live tracking" subtitle="All active journeys and riders, on one map." /><div className="p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#E0912B]">Operations map</p><h2 className="mt-1 text-[25px] font-semibold tracking-[-.05em] text-[#102B48]">A live view of Uganda</h2></div><div className="flex items-center gap-2"><span className="hidden text-xs text-[#7A8998] md:block">{updatedAt ? `Updated ${updatedAt.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for data'}</span><button onClick={() => void refresh()} disabled={refreshing} className="flex items-center gap-2 rounded-xl border border-[#E1E6EA] bg-white px-3 py-2.5 text-xs font-semibold text-[#334D62] disabled:opacity-50"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />Refresh</button></div></div>{error && <div role="alert" className="mb-4 rounded-xl border border-[#F2D7D4] bg-[#FFF4F2] p-3 text-xs text-[#A64D49]">{error}</div>}<div className="grid min-h-[630px] overflow-hidden rounded-[25px] border border-[#E4E9ED] bg-white shadow-[0_10px_40px_rgba(16,43,72,.06)] xl:grid-cols-[310px_minmax(0,1fr)_280px]"><section className="flex max-h-[650px] flex-col border-b border-[#E7EBEE] xl:border-b-0 xl:border-r"><div className="border-b border-[#EDF0F2] p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-[#102B48]">Journeys in motion</p><p className="mt-1 text-[11px] text-[#8693A1]">{active.length} journeys · {riders.length} live riders</p></div><Signal size={18} className="text-[#1B9B7E]" /></div><div className="relative mt-4"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9AAA]" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find journey or rider" className="w-full rounded-xl border border-[#E7EBEE] bg-[#F8FAFB] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#8CB1C7]" /></div><label className="mt-3 flex items-center gap-2 text-xs text-[#647789]"><input type="checkbox" checked={onlyActive} onChange={event => setOnlyActive(event.target.checked)} className="accent-[#102B48]" />Only journeys underway</label></div><div className="max-h-[460px] flex-1 overflow-y-auto p-2">{active.length ? active.map(journey => { const route = routes[journey._id]; const rider = riders.find(item => item.activeJourneyId === journey._id); const color = routeColor(journey._id); return <button key={journey._id} onClick={() => setSelected(journey._id)} className={`mb-2 w-full rounded-[17px] border p-3 text-left transition ${selected === journey._id ? 'border-[#B7CAD8] bg-[#F5F9FB] shadow-sm' : 'border-transparent hover:border-[#E7EBEE] hover:bg-[#FAFBFC]'}`}><div className="flex items-center justify-between"><strong className="text-xs text-[#183650]">{short(journey._id)}</strong><span className="rounded-full bg-[#EDF2F5] px-2 py-1 text-[10px] font-semibold text-[#5E7082]">{journey.status.replace(/_/g, ' ')}</span></div><div className="mt-3 flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /><span className="min-w-0 flex-1 truncate text-xs font-medium text-[#4C6174]">{journey.pickupLocation?.address || 'Pickup'} → {journey.destination?.address || 'Destination'}</span></div><div className="mt-3 flex items-center justify-between border-t border-[#EDF0F2] pt-3 text-[11px] text-[#8292A1]"><span>{rider ? 'Rider location live' : 'Awaiting rider location'}</span><span>{route ? `${route.coveredKm || 0} km covered` : 'Route pending'}</span></div></button>; }) : <p className="p-6 text-center text-xs text-[#8795A3]">No journeys currently match this view.</p>}</div></section><LiveMap riders={riders} journeys={journeys} routes={routes} selected={selected} onSelect={setSelected} /><aside className="border-t border-[#E7EBEE] p-5 xl:border-l xl:border-t-0"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#D98829]">Selected journey</p>{selectedJourney ? <div><div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: routeColor(selectedJourney._id) }}><Navigation2 size={21} /></div><h3 className="mt-4 text-xl font-semibold tracking-[-.04em] text-[#102B48]">{short(selectedJourney._id)}</h3><p className="mt-1 text-xs text-[#78899A]">{selectedJourney.status.replace(/_/g, ' ')}</p><div className="mt-6 space-y-4 border-y border-[#E8ECEF] py-5"><div><p className="text-[10px] text-[#8897A5]">Pickup</p><p className="mt-1 text-xs font-semibold text-[#31506A]">{selectedJourney.pickupLocation?.address || 'Location available on map'}</p></div><div><p className="text-[10px] text-[#8897A5]">Destination</p><p className="mt-1 text-xs font-semibold text-[#31506A]">{selectedJourney.destination?.address || 'Location available on map'}</p></div><div><p className="text-[10px] text-[#8897A5]">Rider</p><p className="mt-1 text-xs font-semibold text-[#31506A]">{selectedRider ? `Live · ${short(selectedRider.operatorId)}` : selectedJourney.operatorId ? short(selectedJourney.operatorId) : 'Not assigned'}</p></div></div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#F2F6F8] p-3"><p className="text-[10px] text-[#8190A0]">Covered</p><p className="mt-2 text-lg font-semibold text-[#102B48]">{selectedRoute ? `${selectedRoute.coveredKm.toFixed(1)} km` : '—'}</p></div><div className="rounded-xl bg-[#F2F6F8] p-3"><p className="text-[10px] text-[#8190A0]">Remaining</p><p className="mt-2 text-lg font-semibold text-[#102B48]">{selectedRoute?.remainingKm != null ? `${selectedRoute.remainingKm.toFixed(1)} km` : '—'}</p></div></div><div className="mt-5 flex items-center gap-3 text-[11px] text-[#78899A]"><span className="h-0 w-8 border-t-[3px]" style={{ borderColor: routeColor(selectedJourney._id) }} />Covered <span className="ml-2 h-0 w-8 border-t-[3px] border-dotted" style={{ borderColor: routeColor(selectedJourney._id) }} />Remaining</div></div> : selectedRider ? <div className="mt-6"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102B48] text-white"><Circle size={19} /></div><h3 className="mt-4 text-lg font-semibold text-[#102B48]">Rider {short(selectedRider.operatorId)}</h3><p className="mt-2 text-xs text-[#78899A]">Online at {selectedRider.lat.toFixed(4)}, {selectedRider.lng.toFixed(4)}</p><p className="mt-1 text-xs text-[#78899A]">No active journey assigned.</p></div> : <div className="mt-12 text-center text-[#8190A0]"><MapPin size={24} className="mx-auto" /><p className="mt-3 text-xs">Select a journey or map marker to see its details.</p></div>}</aside></div><p className="mt-3 text-[11px] text-[#8896A4]">Solid lines show recorded movement. Dots show the remaining stored route. A route appears only when tracking data exists.</p></div></div>;
}
