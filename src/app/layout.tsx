import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'TRAVO Admin',
  description: 'TRAVO - Ride-Hailing & Map Commerce Platform Administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-travo-black">{children}</body>
    </html>
  );
}
