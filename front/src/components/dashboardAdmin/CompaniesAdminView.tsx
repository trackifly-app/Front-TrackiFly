'use client';

import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import AdminCompaniesTable from '@/components/dashboardAdmin/AdminCompaniesTable';

import { AdminCompanyRow } from '@/interfaces/shipment';

import { getCompanyByUserId, getUsers } from '@/services/adminUsers.service';

export default function CompaniesAdminView() {
  const [companies, setCompanies] = useState<AdminCompanyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);

        const users = await getUsers();

        const companyUsers = users.filter((user) => user.role?.name === 'company');

        const companiesData: AdminCompanyRow[] = await Promise.all(
          companyUsers.map(async (user) => {
            const company = user.company ?? (await getCompanyByUserId(user.id));

            return {
              user,
              company,
            };
          }),
        );

        setCompanies(companiesData);
      } catch (error) {
        console.error('Error al cargar empresas:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 lg:px-0">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 font-semibold text-primary">Gestión principal</p>

            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Empresas</h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta el listado de cuentas registradas con rol empresa dentro del sistema.</p>
          </div>

          <AdminMetricCard title="Total de empresas" value={companies.length} icon={Building2} compact />
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Listado de empresas</h2>

            <p className="mt-1 text-sm text-muted">Información general de las empresas registradas.</p>
          </div>

          {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando empresas...</div> : <AdminCompaniesTable companies={companies} />}
        </div>
      </section>
    </main>
  );
}
