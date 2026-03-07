# Web Admin

>  Admin Dashboard — web-based admin panel for monitoring journeys, operators, companies, ads, revenue, and platform health.

## Overview

The Web Admin app is a Next.js dashboard that gives platform administrators a real-time view of every aspect of  — active journeys, operator management, company accounts, ad campaigns, wallet transactions, revenue analytics, and user oversight. It connects to the API Gateway over HTTP and receives live updates via Socket.IO.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript 5.3
- Tailwind CSS 3.4
- Recharts 2.10 — dashboard charts and analytics visualizations
- Framer Motion 11 — page transitions and micro-animations
- TanStack React Query 5 — server-state management and caching
- Socket.IO Client 4.7 — real-time event streaming
- Lucide React — icon set
- date-fns 3 — date formatting
- Sonner — toast notifications
- clsx + tailwind-merge — conditional class utilities

## Port

`3100` (default)

## Prerequisites

- Node.js >= 20.x
- npm >= 9.x
- `@/shared` package built

## Setup

### 1. Build the shared package

```bash
cd ../../shared
npm install
npm run build
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

### 4. Run the app

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Docker

```bash
# From project root
docker-compose up web-admin
```

Or build standalone:

```bash
docker build -f apps/web-admin/Dockerfile -t -web-admin .
docker run -p 3100:3100 --env-file .env.local -web-admin
```

## Pages

| Route              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `/`                | Login page                                           |
| `/dashboard`       | Main dashboard — KPI cards, charts, live activity     |
| `/dashboard/journeys`      | Journey list, filtering, and detail view      |
| `/dashboard/operators`     | Operator management and status overview       |
| `/dashboard/companies`     | Company accounts and fleet associations       |
| `/dashboard/ads`           | Advertisement campaigns and performance       |
| `/dashboard/analytics`     | Platform-wide analytics and trends            |
| `/dashboard/users`         | User accounts and moderation                  |
| `/dashboard/notifications` | Notification log and broadcasting             |
| `/dashboard/verifications` | Identity and document verification queue      |
| `/dashboard/wallet`        | Wallet transactions and top-ups               |
| `/dashboard/settings`      | Platform settings and configuration           |

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Login page (/)
│   ├── login/                  # Login page
│   └── dashboard/
│       ├── layout.tsx          # Dashboard shell (sidebar + header)
│       ├── page.tsx            # Dashboard overview
│       ├── journeys/           # Journey management
│       ├── operators/          # Operator management
│       ├── companies/          # Company management
│       ├── ads/                # Ad campaign management
│       ├── analytics/          # Analytics views
│       ├── users/              # User management
│       ├── notifications/      # Notification management
│       ├── verifications/      # Verification queue
│       ├── wallet/             # Wallet overview
│       └── settings/           # Platform settings
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Main navigation sidebar
│   │   └── Header.tsx          # Top bar with search and profile
│   ├── ads/                    # Ad-specific components
│   ├── analytics/              # Chart and analytics components
│   ├── companies/              # Company management components
│   ├── dashboard/              # Dashboard widget components
│   ├── journeys/               # Journey list and detail components
│   ├── operators/              # Operator card and table components
│   ├── users/                  # User management components
│   ├── wallet/                 # Wallet and transaction components
│   └── ui/                     # Shared UI primitives
├── hooks/                      # Custom React hooks
├── lib/
│   ├── api.ts                  # Axios / fetch wrapper for API Gateway
│   └── utils.ts                # General utility functions
└── styles/
    └── globals.css             # Tailwind base, component, and utility layers
```

## Shared Package

The admin dashboard imports shared types and constants from the monorepo shared package:

```ts
import { JourneyStatus, UserRole } from '@/shared';
```

## Environment Variables

| Variable                     | Required | Description                                   |
| ---------------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL`        | Yes      | API Gateway base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_WS_URL`        | Yes      | WebSocket endpoint (e.g. `ws://localhost:3000`)     |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY`| No      | Google Maps API key for map components              |
