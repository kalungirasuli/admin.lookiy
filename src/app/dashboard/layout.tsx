import Sidebar from '@/components/layout/Sidebar';
import AdminGate from '@/components/layout/AdminGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate><div className="min-h-screen bg-[#F5F6F7]">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        {children}
      </main>
    </div></AdminGate>
  );
}
