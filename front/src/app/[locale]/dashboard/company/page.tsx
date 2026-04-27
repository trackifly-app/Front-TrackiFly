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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [companyDataLoading, setCompanyDataLoading] = useState(true);

  const roleName = userData?.user?.role?.name; 
  const isCompany = roleName === 'company'; 
  const isOperator = roleName === 'operator'; 

  const visibleModules = isOperator
    ? companyModules.filter((module) =>
        ['Ubicaciones / Sedes', 'Monitoreo de pedidos', 'Incidencias'].includes(module.title),
      )
    : companyModules; 
  useEffect(() => {
    const loadCompanyData = async () => {
      if (!userData?.user?.id) {
        setCompanyData(null);
        setCompanyDataLoading(false);
        return;
      }

      // ========================================
      // restriccion del empleado
      // ========================================
      // si la cuenta ya trae company la usamos directo; si es employee
      // hacemos una segunda peticion para traer la empresa del parentCompany.
      const directCompany = userData.user.company;

      if (directCompany) {
        setCompanyData({
          email: userData.user.email || '',
          company_name: directCompany.company_name || '',
          industry: directCompany.industry || '',
          contact_name: directCompany.contact_name || '',
          phone: directCompany.phone || '',
          address: directCompany.address || '',
          country: directCompany.country || '',
          plan: directCompany.plan || '',
          image: directCompany.profile_image || '',
        });
        setCompanyDataLoading(false);
        return;
      }

      if (isOperator) {
        try {
          setCompanyDataLoading(true);

          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData.user.id}`, {
            credentials: 'include',
            cache: 'no-store',
          });

          if (!userResponse.ok) {
            setCompanyData(null);
            setCompanyDataLoading(false);
            return;
          }

          const employeeData = await userResponse.json();
          const parentCompanyId = employeeData?.parentCompany?.id;

          if (!parentCompanyId) {
            setCompanyData(null);
            setCompanyDataLoading(false);
            return;
          }

          const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/user/${parentCompanyId}`, {
            credentials: 'include',
            cache: 'no-store',
          });

          if (!companyResponse.ok) {
            setCompanyData(null);
            setCompanyDataLoading(false);
            return;
          }

          const parentCompanyData = await companyResponse.json();

          setCompanyData({
            email: userData.user.email || '',
            company_name: parentCompanyData.company_name || '',
            industry: parentCompanyData.industry || '',
            contact_name: parentCompanyData.contact_name || '',
            phone: parentCompanyData.phone || '',
            address: parentCompanyData.address || '',
            country: parentCompanyData.country || '',
            plan: parentCompanyData.plan || '',
            image: parentCompanyData.profile_image || '',
          });
        } catch (error) {
          console.error('Error al cargar la empresa del empleado:', error);
          setCompanyData(null);
        } finally {
          setCompanyDataLoading(false);
        }
        return;
      }

      setCompanyData(null);
      setCompanyDataLoading(false);
    };

    loadCompanyData();
  }, [userData, isOperator]);

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

  if (loading || companyDataLoading) {
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
          moduleCount={visibleModules.length} 
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

        <CompanyQuickAccess modules={visibleModules} /> {/* CAMBIO AQUI: enviamos la lista filtrada para que el employee solo vea los tres accesos permitidos. */}

        {isCompany && <CompanyAccountDetails accountDetails={companyAccountDetails(companyData.plan)} />} {/* CAMBIO AQUI: ocultamos detalles de cuenta al employee y los mantenemos solo para empresa. */}
      </div>
    </main>
  );
}
