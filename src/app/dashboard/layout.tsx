import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F6]">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
