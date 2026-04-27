import AdminWelcomeCard from '@/components/dashboardAdmin/AdminWelcomeCard';
import AdminModules, { adminModulesData } from '@/components/dashboardAdmin/AdminModules';
import AdminSystemDetails, { adminSystemDetailsData } from '@/components/dashboardAdmin/AdminSystemDetails';

export default function DashboardAdminPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminWelcomeCard adminName="Admin" />
        <AdminModules modules={adminModulesData} />
        <AdminSystemDetails details={adminSystemDetailsData} />
      </div>
    </main>
  );
}