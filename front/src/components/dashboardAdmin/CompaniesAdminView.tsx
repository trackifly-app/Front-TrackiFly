'use client';

import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';

import { AdminCompanyRow } from '@/interfaces/shipment';

import { getCompanyByUserId, getUsers } from '@/services/adminUsers.service';
import AdminCompaniesTable from './AdminCompaniesTable';

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
    <main className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="mb-6">
          <p className="text-primary font-semibold mb-2">Gestión principal</p>

          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>

          <p className="mt-2 text-muted">Listado de usuarios registrados con rol empresa.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <AdminMetricCard title="Total de empresas" value={companies.length} description="Usuarios registrados con rol company." icon={Building2} />
        </div>

        {loading ? <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando empresas...</div> : <AdminCompaniesTable companies={companies} />}
      </section>
    </main>
  );
}
