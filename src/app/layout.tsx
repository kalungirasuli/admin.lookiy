import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Lookiy Control Center',
  description: 'Lookiy operations, journeys, riders and commerce.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F5F6F7]">{children}</body>
    </html>
  );
}
