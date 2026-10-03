import Sidebar from '@/components/layout/Sidebar';
import AdminGate from '@/components/layout/AdminGate';
import { adminPreview } from '@/lib/admin-preview';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate><div className="min-h-screen bg-[#F5F6F7]">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        {adminPreview && <div className="border-b border-[#E8D8A7] bg-[#FFF8E6] px-6 py-2 text-center text-xs font-medium text-[#745A19]">Design preview · Sample records · Changes disabled</div>}
        {children}
      </main>
    </div></AdminGate>
  );
}
