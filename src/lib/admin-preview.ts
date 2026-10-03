// Local design review only. Never enabled in a production build.
export const adminPreview = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ADMIN_PREVIEW === '1';

type RecordItem = Record<string, any>;
const day = '2026-10-03T09:30:00.000Z';
const id = (n: number) => `68df000000000000000000${String(n).padStart(2, '0')}`;

const clients: RecordItem[] = [
  { _id: id(1), firstName: 'Amina', lastName: 'Nakamya', email: 'amina@example.test', phone: '+256 700 123 456', roles: ['CLIENT'], isVerified: true, isActive: true, createdAt: day },
  { _id: id(2), firstName: 'Daniel', lastName: 'Okello', email: 'daniel@example.test', phone: '+256 750 234 567', roles: ['CLIENT'], isVerified: true, isActive: true, createdAt: day },
  { _id: id(3), firstName: 'Grace', lastName: 'Nabwire', email: 'grace@example.test', phone: '+256 780 345 678', roles: ['CLIENT'], isVerified: false, isActive: true, createdAt: day },
];
const riders: RecordItem[] = [
  { _id: id(11), userId: id(11), firstName: 'Brian', lastName: 'Kato', phone: '+256 772 111 222', status: 'ONLINE', isVerified: true, vehicleType: 'Boda', vehicleModel: 'Bajaj Boxer', vehicleNumber: 'UFX 234R', feeStatus: 'PAID', totalEarnings: 428000, totalJourneys: 38, rating: 4.9, createdAt: day },
  { _id: id(12), userId: id(12), firstName: 'Sarah', lastName: 'Atim', phone: '+256 701 222 333', status: 'ONLINE', isVerified: true, vehicleType: 'Car', vehicleModel: 'Toyota Prius', vehicleNumber: 'UBP 814K', feeStatus: 'PAID', totalEarnings: 761000, totalJourneys: 52, rating: 4.8, createdAt: day },
  { _id: id(13), userId: id(13), firstName: 'Moses', lastName: 'Ssemakula', phone: '+256 759 333 444', status: 'OFFLINE', isVerified: false, vehicleType: 'Boda', vehicleModel: 'TVS HLX', vehicleNumber: 'UEZ 943F', feeStatus: 'OVERDUE', totalEarnings: 92000, totalJourneys: 9, rating: 4.7, createdAt: day },
];
const point = (address: string, lat: number, lng: number) => ({ address, lat, lng });
const journeys: RecordItem[] = [
  { _id: id(21), clientId: id(1), operatorId: id(11), status: 'ACTIVE', pickupLocation: point('Acacia Mall, Kampala', .3358, 32.5899), destination: point('Makerere University, Kampala', .3310, 32.5705), vehicleType: 'Boda', journeyType: 'PERSONAL', agreedPrice: 18000, createdAt: day, startedAt: day },
  { _id: id(22), clientId: id(2), operatorId: id(12), status: 'MATCHED', pickupLocation: point('Garden City, Kampala', .3195, 32.5928), destination: point('Entebbe Road, Kampala', .3035, 32.5748), vehicleType: 'Car', journeyType: 'PERSONAL', proposedPrice: 38000, createdAt: day },
  { _id: id(23), clientId: id(3), status: 'SEARCHING_OPERATOR', pickupLocation: point('Ntinda, Kampala', .3571, 32.6118), destination: point('Bugolobi, Kampala', .3156, 32.6230), vehicleType: 'Boda', journeyType: 'DELIVERY', proposedPrice: 22000, createdAt: day },
  { _id: id(24), clientId: id(1), operatorId: id(12), status: 'COMPLETED', pickupLocation: point('Kisementi, Kampala', .3351, 32.5914), destination: point('Kololo, Kampala', .3271, 32.6085), vehicleType: 'Car', agreedPrice: 29000, createdAt: day, completedAt: day, sharedWith: [id(2)] },
  { _id: id(25), clientId: id(2), operatorId: id(11), status: 'CANCELLED', pickupLocation: point('Nakawa, Kampala', .3347, 32.6277), destination: point('Lugogo, Kampala', .3273, 32.6070), vehicleType: 'Boda', proposedPrice: 14000, createdAt: day, cancellationReason: 'Plans changed' },
  { _id: id(26), clientId: id(3), operatorId: id(13), status: 'LOCKED', pickupLocation: point('Wandegeya, Kampala', .3338, 32.5823), destination: point('Mulago Hospital, Kampala', .3423, 32.5781), vehicleType: 'Boda', agreedPrice: 12000, createdAt: day },
];
const fleets: RecordItem[] = [
  { _id: id(31), name: 'Pearl City Fleet', ownerId: id(1), operatorCount: 2, approved: true, status: 'ACTIVE', createdAt: day },
  { _id: id(32), name: 'Central Mobility', ownerId: id(2), operatorCount: 1, approved: false, status: 'PENDING', createdAt: day },
];
const shops: RecordItem[] = [
  { _id: id(41), name: 'Nakasero Coffee', businessName: 'Nakasero Coffee', ownerId: id(1), category: 'Food & drink', status: 'ACTIVE', impressions: 4820, clicks: 214, createdAt: day, inventory: [{ _id: id(48), name: 'House blend', price: 18000, stock: 25 }] },
  { _id: id(42), name: 'Kampala Craft House', businessName: 'Kampala Craft House', ownerId: id(2), category: 'Shopping', status: 'ACTIVE', impressions: 2710, clicks: 136, createdAt: day },
];
const ads: RecordItem[] = [
  { _id: id(43), name: 'Morning coffee offer', businessId: id(41), status: 'RUNNING', impressions: 3200, clicks: 156, createdAt: day },
  { _id: id(44), name: 'Weekend crafts', businessId: id(42), status: 'PAUSED', impressions: 860, clicks: 44, createdAt: day },
];
const campaigns: RecordItem[] = [{ _id: id(45), name: 'October discovery', businessId: id(41), status: 'RUNNING', impressions: 5100, clicks: 238, createdAt: day }];
const wallets: RecordItem[] = [
  { _id: id(51), userId: id(1), walletType: 'CLIENT', balance: 89000, status: 'ACTIVE', createdAt: day },
  { _id: id(52), userId: id(11), walletType: 'OPERATOR', balance: 132000, status: 'ACTIVE', createdAt: day },
  { _id: id(53), userId: id(41), walletType: 'BUSINESS', balance: 240000, status: 'ACTIVE', createdAt: day },
];
const transactions: RecordItem[] = [
  { _id: id(54), userId: id(1), type: 'WALLET_TOPUP', amount: 100000, status: 'COMPLETED', description: 'Mobile money top-up', createdAt: day },
  { _id: id(55), userId: id(11), type: 'JOURNEY_PAYMENT', amount: 18000, status: 'COMPLETED', description: 'Journey fare', journeyId: id(21), createdAt: day },
  { _id: id(56), userId: id(11), type: 'TRANSFER', purpose: 'weekly', amount: 5000, status: 'COMPLETED', description: 'Rider weekly fee', createdAt: day },
  { _id: id(57), userId: id(12), type: 'WITHDRAWAL', amount: 55000, status: 'COMPLETED', description: 'Mobile money withdrawal', createdAt: day },
];
const verifications: RecordItem[] = [
  { _id: id(61), userId: id(13), type: 'OPERATOR', status: 'PENDING', submittedAt: day, submittedDocuments: [{ docType: 'NATIONAL_ID' }, { docType: 'VEHICLE_LOGBOOK' }] },
  { _id: id(62), userId: id(11), type: 'OPERATOR', status: 'VERIFIED', submittedAt: day },
];
const staff: RecordItem[] = [
  { _id: id(71), firstName: 'Preview', lastName: 'Admin', email: 'preview@lookiy.local', roles: ['STAFF'], isActive: true, isVerified: true, createdAt: day },
  { _id: id(72), firstName: 'Eva', lastName: 'Operations', email: 'eva@example.test', roles: ['ADMIN'], isActive: true, isVerified: true, createdAt: day },
];
const locations = [
  { operatorId: id(11), activeJourneyId: id(21), lat: .3334, lng: 32.5815, speed: 23, timestamp: day },
  { operatorId: id(12), activeJourneyId: id(22), lat: .3162, lng: 32.5874, speed: 10, timestamp: day },
];
const route = (journey: RecordItem) => ({ journeyId: journey._id, plannedRoute: [journey.pickupLocation, { lat: (journey.pickupLocation.lat + journey.destination.lat) / 2, lng: (journey.pickupLocation.lng + journey.destination.lng) / 2 }, journey.destination], actualRoute: [journey.pickupLocation, locations.find(item => item.activeJourneyId === journey._id) || journey.pickupLocation], coveredKm: journey._id === id(21) ? 1.4 : .6, remainingKm: journey._id === id(21) ? 2.1 : 3.8 });

export function previewResponse(path: string, method = 'GET', body?: BodyInit | null): any {
  const url = new URL(path, 'http://preview.local');
  const routePath = url.pathname;
  if (routePath === '/tracking/admin/routes' && method === 'POST') {
    const selected = JSON.parse(String(body || '{}')).journeyIds || [];
    return { success: true, data: journeys.filter(item => selected.includes(item._id)).map(route) };
  }
  if (method !== 'GET') throw new Error('Design preview: changes are disabled. Connect the API to perform this action.');
  if (routePath === '/auth/me') return { success: true, data: staff[0] };
  if (routePath === '/auth/sessions') return { success: true, data: [] };
  if (routePath === '/tracking/admin/locations') return { success: true, data: locations };
  if (routePath.startsWith('/tracking/admin/journey/')) return { success: true, data: route(journeys.find(item => item._id === routePath.split('/')[4]) || journeys[0]) };
  if (routePath.match(/^\/operators\/admin\/[^/]+\/detail$/)) return { success: true, data: riders.find(item => item._id === routePath.split('/')[3]) || riders[0] };
  if (routePath.match(/^\/companies\/admin\/[^/]+\/workspace$/)) {
    const company = fleets.find(item => item._id === routePath.split('/')[3]) || fleets[0];
    return { success: true, data: { company, riders: riders.slice(0, company.operatorCount).map(item => ({ operatorUserId: item.userId, rider: item, collectionsPaused: false })), earnings: { riders: riders.slice(0, company.operatorCount).map(item => ({ operatorUserId: item.userId, rider: item, gross: item.totalEarnings, collected: 42000, journeys: item.totalJourneys, daily: {}, history: [] })) } } };
  }
  let records: RecordItem[] = [];
  if (routePath === '/journeys/admin/all') records = journeys;
  else if (routePath === '/operators') records = riders;
  else if (routePath === '/auth/admin/users') records = [...clients, ...staff];
  else if (routePath === '/companies') records = fleets;
  else if (routePath === '/ads/admin/businesses') records = shops;
  else if (routePath === '/ads/admin/ads') records = ads;
  else if (routePath === '/ads/admin/campaigns') records = campaigns;
  else if (routePath === '/wallet/admin/wallets') records = wallets;
  else if (routePath === '/wallet/admin/transactions') records = transactions;
  else if (routePath === '/verification/admin/all') records = verifications;
  const query = url.searchParams;
  if (query.has('status')) { const values = query.get('status')!.toUpperCase().split(','); records = records.filter(item => values.includes(String(item.status || '').toUpperCase())); }
  if (query.has('role')) records = records.filter(item => item.roles?.includes(query.get('role')));
  if (query.has('verified')) records = records.filter(item => Boolean(item.isVerified) === (query.get('verified') === 'true'));
  if (query.has('approved')) records = records.filter(item => Boolean(item.approved) === (query.get('approved') === 'true'));
  if (query.has('feeStatus')) records = records.filter(item => item.feeStatus === query.get('feeStatus'));
  if (query.get('shared') === 'true') records = records.filter(item => item.sharedWith?.length);
  if (query.has('sharedUserId')) records = records.filter(item => item.sharedWith?.includes(query.get('sharedUserId')));
  for (const key of ['operatorId', 'clientId', 'userId', 'type', 'purpose', 'walletType']) if (query.has(key)) records = records.filter(item => query.get(key)!.split(',').includes(String(item[key] || '')));
  if (query.has('search')) { const term = query.get('search')!.toLowerCase(); records = records.filter(item => JSON.stringify(item).toLowerCase().includes(term)); }
  const page = Math.max(1, Number(query.get('page') || 1));
  const limit = Math.max(1, Number(query.get('limit') || 25));
  return { success: true, data: records.slice((page - 1) * limit, page * limit), pagination: { page, limit, total: records.length }, meta: { page, limit, total: records.length } };
}
