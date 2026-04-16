import CompanyWelcomeCard from "@/components/dashboardCompany/CompanyWelcomeCard";
import CompanyProfileCard from "@/components/dashboardCompany/CompanyProfileCard";
import CompanyQuickAccess, {
  companyModules,
} from "@/components/dashboardCompany/CompanyQuickAccess";
import CompanyAccountDetails, {
  companyAccountDetails,
} from "@/components/dashboardCompany/CompanyAccountDetails";

export default function DashboardCompanyPage() {
  const company = {
    email: "contacto@trackifly.com",
    company_name: "Trackifly Logistics",
    industry: "Tecnología y logística",
    contact_name: "Miguel RV",
    phone: "987654321",
    address: "Av. Los Ángeles 245, Arequipa",
    country: "PE",
    plan: "Business Pro",
    image:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1200&auto=format&fit=crop",
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] dark:bg-zinc-950 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <CompanyWelcomeCard
          company={company}
          moduleCount={companyModules.length}
        />

        <CompanyProfileCard company={company} />

        <CompanyQuickAccess modules={companyModules} />

        <CompanyAccountDetails
          accountDetails={companyAccountDetails(company.plan)}
        />
      </div>
    </main>
  );
}