'use client';

import { useEffect, useState } from 'react';
import { Building2, Eye, X } from 'lucide-react';

import AdminMetricCard from '@/components/dashboardAdmin/AdminMetricCard';
import BackToAdminDashboard from '@/components/dashboardAdmin/BackToAdminDashboard';

import { getCompanies } from '@/services/adminUsers.service';
import { AdminApiUser } from '@/interfaces/shipment';

export default function CompaniesAdminView() {
  const [companies, setCompanies] = useState<AdminApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<AdminApiUser | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);

        const companiesData = await getCompanies();

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
    <>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <BackToAdminDashboard />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="mb-2 font-semibold text-primary">Gestión principal</p>

              <h1 className="text-3xl font-bold text-foreground md:text-4xl">Empresas</h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Consulta las empresas registradas en el sistema y revisa sus detalles completos.</p>
            </div>

            <div className="lg:justify-self-end">
              <AdminMetricCard title="Total de empresas" value={companies.length} icon={Building2} compact />
            </div>
          </div>

          <div className="my-8 h-px w-full bg-border" />

          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Listado de empresas</h2>

                <p className="mt-1 text-sm text-muted">Información básica de las empresas registradas.</p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                {companies.length} registro{companies.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando empresas...</div>
            ) : companies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted">No hay empresas registradas.</div>
            ) : (
              <AdminCompaniesTable companies={companies} onViewDetails={setSelectedCompany} />
            )}
          </div>
        </section>
      </main>

      {selectedCompany && <CompanyDetailsModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </>
  );
}

function AdminCompaniesTable({ companies, onViewDetails }: { companies: AdminApiUser[]; onViewDetails: (company: AdminApiUser) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted">
      <div className="grid grid-cols-[1.5fr_1.4fr_0.8fr_0.8fr_0.8fr] border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">
        <div>Empresa</div>
        <div>Email</div>
        <div>País</div>
        <div>Estado</div>
        <div className="text-right">Acción</div>
      </div>

      <div>
        {companies.map((user) => {
          const company = user.company;
          const companyName = company?.company_name || 'Sin nombre';
          const image = company?.profile_image || '/default-company.png';

          const isActive = user.is_active !== false && user.status?.toLowerCase() !== 'inactive';

          return (
            <div key={user.id} className="grid grid-cols-[1.5fr_1.4fr_0.8fr_0.8fr_0.8fr] items-center border-b border-border px-5 py-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                  <img src={image} alt={companyName} className="h-full w-full object-cover object-center" />
                </div>

                <div>
                  <p className="font-bold text-foreground">{companyName}</p>

                  <p className="mt-0.5 text-xs text-muted">ID: {user.id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="text-sm text-muted">{user.email || 'Sin email'}</div>

              <div className="text-sm text-muted">{company?.country || 'Sin país'}</div>

              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{isActive ? 'Activa' : 'Inactiva'}</span>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => onViewDetails(user)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary">
                  <Eye size={16} />
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompanyDetailsModal({ company, onClose }: { company: AdminApiUser; onClose: () => void }) {
  const companyData = company.company;

  const companyName = companyData?.company_name || 'Sin nombre';
  const image = companyData?.profile_image || '/default-company.png';

  const isActive = company.is_active !== false && company.status?.toLowerCase() !== 'inactive';

  const createdAt = company.created_at
    ? new Date(company.created_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';

  const updatedAt = company.updated_at
    ? new Date(company.updated_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin fecha';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl md:p-8">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-muted text-muted transition hover:border-primary/40 hover:text-primary" aria-label="Cerrar detalles">
          <X size={20} />
        </button>

        <button type="button" onClick={onClose} className="mb-6 flex items-center gap-2 font-semibold text-primary transition-transform hover:-translate-x-1">
          ← Volver al listado
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="space-y-5 self-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface-muted p-3">
              <img src={image} alt={companyName} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted">Estado actual</p>

              <p className="mt-1 text-lg font-bold uppercase tracking-widest text-primary">{isActive ? 'Activa' : 'Inactiva'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pr-10">
              <p className="mb-2 font-semibold text-primary">Detalles de la empresa</p>

              <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground">{companyName}</h2>

              <p className="mt-2 break-all font-mono text-sm text-muted">ID usuario: {company.id}</p>

              {companyData?.id && <p className="mt-1 break-all font-mono text-sm text-muted">ID empresa: {companyData.id}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <DetailCard title="Empresa">
                <DetailItem label="Nombre" value={companyData?.company_name || 'Sin nombre'} />
                <DetailItem label="Industria" value={companyData?.industry || 'Sin industria'} />
                <DetailItem label="Plan" value={companyData?.plan || 'Sin plan'} />
                <DetailItem label="Estado" value={company.status || (isActive ? 'Activa' : 'Inactiva')} />
              </DetailCard>

              <DetailCard title="Contacto">
                <DetailItem label="Email" value={company.email || 'Sin email'} />
                <DetailItem label="Contacto" value={companyData?.contact_name || 'Sin contacto'} />
                <DetailItem label="Teléfono" value={companyData?.phone || 'Sin teléfono'} />
                <DetailItem label="País" value={companyData?.country || 'Sin país'} />
                <DetailItem label="Dirección" value={companyData?.address || 'Sin dirección'} />
              </DetailCard>

              <DetailCard title="Registro">
                <DetailItem label="Creada" value={createdAt} />
                <DetailItem label="Actualizada" value={updatedAt} />
              </DetailCard>

              <DetailCard title="Usuario asociado">
                <DetailItem label="Email usuario" value={company.email || 'Sin email'} />
                <DetailItem label="ID usuario" value={company.id} />
                <DetailItem label="Rol" value={company.role?.name || 'Sin rol'} />
              </DetailCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-5">
      <h3 className="mb-4 font-bold text-primary">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="break-words font-medium text-foreground">{value}</p>
    </div>
  );
}
