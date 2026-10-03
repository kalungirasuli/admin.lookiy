# Lookiy Control Center

The admin portal is a Next.js application on port `3100`. It reads operational data from the API gateway and requires an account with the `ADMIN` or `STAFF` role. Staff role changes require `ADMIN`.

## Run locally

```bash
cp apps/web-admin/.env.example apps/web-admin/.env.local
npm install
cd apps/web-admin && npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the API gateway. The service must have access to auth, journeys, riders, fleets, wallet, tracking, ads, and verification services for every view to load. The dashboard shows a source error rather than sample records when a service is unavailable.

## Google Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_KEY` to a browser key authorized for the Maps JavaScript API and the admin site origin. Set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` to a Google Maps map ID for advanced markers. The live tracking page shows a setup state when the key is absent. Current rider positions come from tracking's short-lived live location store. Journey routes use recorded GPS points for the solid covered line and planned route points for the dotted remaining line. A journey without a recorded or planned route is shown without inventing a path.

## Sections

- Control center: live totals and latest journeys.
- Live tracking: all active journeys and live rider locations on one Google Map, with route colors and covered/remaining distance.
- Journeys: unmatched, matched, paired, ongoing, completed, cancelled, and shared views.
- Riders: online, verified, unverified, fee due, full profile, documents, journeys, wallet activity, and weekly payments.
- Clients: account details, bookings, shared journeys, wallets, and wallet actions.
- Fleets: fleet roster, connected rider details, and collected earnings history.
- Shops & ads: shops, running/all ads, campaigns, and impression counts.
- Wallet & finance: wallets, transactions, top-ups, withdrawals, fares, and weekly fees.
- Verification: request queue and manual review.
- Staff: role directory, promotion, and access removal for existing accounts.
- Insights and activity: API-backed summaries and recent records.
- Settings: current account, password, active sessions, and map integration state.

Counts and list views are paginated. The insight cards label financial and ad summaries as samples of the latest records. Live tracking polls every 12 seconds while the page is open.

## Verify

```bash
npx tsc --noEmit -p apps/web-admin/tsconfig.json
cd apps/web-admin && npm run build
```
