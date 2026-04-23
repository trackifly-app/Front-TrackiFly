'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CompanyWelcomeCard from '@/components/dashboardCompany/CompanyWelcomeCard';
import CompanyProfileCard from '@/components/dashboardCompany/CompanyProfileCard';
import CompanyQuickAccess, { companyModules } from '@/components/dashboardCompany/CompanyQuickAccess';
import CompanyAccountDetails, { companyAccountDetails } from '@/components/dashboardCompany/CompanyAccountDetails';

type DashboardCompanyData = {
  email: string;
  company_name: string;
  industry: string;
  contact_name: string;
  phone: string;
  address: string;
  country: string;
  plan: string;
  image: string;
};

export default function DashboardCompanyPage() {
  const { userData, loading } = useAuth();
  const [companyData, setCompanyData] = useState<DashboardCompanyData | null>(null);

  useEffect(() => {
    const company = userData?.user?.company;

    if (!company) {
      setCompanyData(null);
      return;
    }

    setCompanyData({
      email: userData?.user?.email || '',
      company_name: company.company_name || '',
      industry: company.industry || '',
      contact_name: company.contact_name || '',
      phone: company.phone || '',
      address: company.address || '',
      country: company.country || '',
      plan: company.plan || '',
      image: company.profile_image || '',
    });
  }, [userData]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    );
  }

  if (!companyData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>No hay datos de empresa</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <CompanyWelcomeCard
          company={{
            company_name: companyData.company_name,
            country: companyData.country,
            plan: companyData.plan,
            image: companyData.image,
          }}
          moduleCount={companyModules.length}
        />

        <CompanyProfileCard
          company={{
            email: companyData.email,
            company_name: companyData.company_name,
            industry: companyData.industry,
            contact_name: companyData.contact_name,
            phone: companyData.phone,
            address: companyData.address,
            country: companyData.country,
          }}
          onCompanyUpdated={(updatedCompany: any) =>
            setCompanyData((prev) => ({
              email: updatedCompany?.email ?? prev?.email ?? '',
              company_name: updatedCompany?.company_name ?? prev?.company_name ?? '',
              industry: updatedCompany?.industry ?? prev?.industry ?? '',
              contact_name: updatedCompany?.contact_name ?? prev?.contact_name ?? '',
              phone: updatedCompany?.phone ?? prev?.phone ?? '',
              address: updatedCompany?.address ?? prev?.address ?? '',
              country: updatedCompany?.country ?? prev?.country ?? '',
              plan: updatedCompany?.plan ?? prev?.plan ?? '',
              image: updatedCompany?.image ?? updatedCompany?.profile_image ?? prev?.image ?? '',
            }))
          }
        />

        <CompanyQuickAccess modules={companyModules} />

        <CompanyAccountDetails accountDetails={companyAccountDetails(companyData.plan)} />
      </div>
    </main>
  );
}