'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CompanyWelcomeCard from '@/components/dashboardCompany/CompanyWelcomeCard';
import CompanyProfileCard from '@/components/dashboardCompany/CompanyProfileCard';
import CompanyQuickAccess, { companyModules } from '@/components/dashboardCompany/CompanyQuickAccess';
import CompanyAccountDetails, { companyAccountDetails } from '@/components/dashboardCompany/CompanyAccountDetails';
import { DashboardCompanyData } from '@/types/types';

export default function DashboardCompanyPage() {
  const { userData, loading } = useAuth();
  const [companyData, setCompanyData] = useState<DashboardCompanyData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

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

  useEffect(() => {
    async function loadActiveOrdersCount() {
      if (!userData?.user?.id) {
        setActiveOrdersCount(0);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userData.user.id}`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Error al obtener órdenes');
        }

        const activeStatuses = ['pending', 'paid', 'processing', 'shipped'];

        const activeOrders = data.filter((order: any) => activeStatuses.includes(order.status?.toLowerCase() || ''));

        setActiveOrdersCount(activeOrders.length);
      } catch (error) {
        console.error('Error al cargar pedidos activos:', error);
        setActiveOrdersCount(0);
      }
    }

    loadActiveOrdersCount();
  }, [userData?.user?.id]);

  const handleCompanyImageSelected = async (file: File) => {
    if (!userData?.user?.id) return;

    const previewUrl = URL.createObjectURL(file);

    setCompanyData((prev) =>
      prev
        ? {
            ...prev,
            image: previewUrl,
          }
        : prev,
    );

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/user/${userData.user.id}/image`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      let data: any;

      try {
        data = await res.json();
      } catch {
        throw new Error('Respuesta inválida del servidor');
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Error al actualizar la imagen');
      }

      const updatedCompany = data?.company ?? data?.user?.company ?? data;
      const newImageUrl = updatedCompany?.profile_image;

      setCompanyData((prev) =>
        prev
          ? {
              ...prev,
              image: newImageUrl ? `${newImageUrl}?t=${Date.now()}` : previewUrl,
            }
          : prev,
      );
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Ocurrió un error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

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
          activeOrdersCount={activeOrdersCount}
          uploadingImage={uploadingImage}
          onImageSelected={handleCompanyImageSelected}
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
