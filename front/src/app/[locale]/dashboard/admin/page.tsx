import AdminWelcomeCard from "@/components/dashboardAdmin/AdminWelcomeCard";
import AdminModules, {
  adminModulesData,
} from "@/components/dashboardAdmin/AdminModules";
import AdminSystemDetails, {
  adminSystemDetailsData,
} from "@/components/dashboardAdmin/AdminSystemDetails";

export default function DashboardAdminPage() {
  const admin = {
    name: "Admin",
  };

  const stats = {
    totalCompanies: 18,
    activeCompanies: 14,
    openIncidents: 6,
    activePlans: 12,
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminWelcomeCard adminName={admin.name} stats={stats} />

        <AdminModules modules={adminModulesData} />

        <AdminSystemDetails details={adminSystemDetailsData} />
      </div>
    </main>
  );
}