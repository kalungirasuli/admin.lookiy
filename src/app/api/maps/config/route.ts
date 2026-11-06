export const dynamic = 'force-dynamic';

function reply(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
}

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  const signature = request.headers.get('x-device-signature');
  if (!authorization?.startsWith('Bearer ') || !signature) {
    return reply({ message: 'Staff sign-in required.' }, 401);
  }

  try {
    const gateway = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const response = await fetch(`${gateway}/auth/me`, {
      headers: { Authorization: authorization, 'x-device-signature': signature },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 401 || response.status === 403) {
      return reply({ message: 'Staff sign-in required.' }, response.status);
    }
    if (!response.ok) return reply({ message: 'Could not verify staff access.' }, 503);

    const { data } = await response.json();
    const roles = Array.isArray(data?.roles) ? data.roles.map((role: unknown) => String(role).toUpperCase()) : [];
    if (!roles.includes('ADMIN') && !roles.includes('STAFF')) {
      return reply({ message: 'Staff access required.' }, 403);
    }

    // This is the website-restricted Maps JavaScript key for signed-in staff browsers.
    return reply({
      key: process.env.GOOGLE_MAPS_KEY?.trim() || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY?.trim() || null,
      mapId: process.env.GOOGLE_MAPS_MAP_ID?.trim() || process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || 'DEMO_MAP_ID',
    });
  } catch {
    return reply({ message: 'Could not verify staff access.' }, 503);
  }
}
