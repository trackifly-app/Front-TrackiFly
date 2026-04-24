'use client';

import { useAuth } from '@/context/AuthContext';
import { CompanyProfileCardProps } from '@/interfaces/shipment';
import { Building2, Mail, Phone, MapPinned, Globe, BriefcaseBusiness, UserRound, Edit2 } from 'lucide-react';
import { useCompanyEditor, CompanyInputField } from '../CompanyEditor';

type Props = CompanyProfileCardProps & {
  onCompanyUpdated?: (company: any) => void;
};

export default function CompanyProfileCard({ company, onCompanyUpdated }: Props) {
  const { userData } = useAuth();
  const userId = userData?.user?.id;

  const { isEditing, startEditing, form, updateField, reset, save, loading } = useCompanyEditor(company, userId, onCompanyUpdated);

  const displayData = form ?? company;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-2 font-semibold text-primary">Datos de empresa</p>
          <h2 className="text-2xl font-bold text-foreground">Información general</h2>
        </div>

        <button
          onClick={() => {
            if (isEditing) reset();
            else startEditing();
          }}
          className="p-2 text-primary hover:opacity-80"
          type="button"
          aria-label={isEditing ? 'Cancelar edición' : 'Editar información'}
        >
          <Edit2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-muted p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted">
            <Mail size={16} />
            <span>Email</span>
          </div>
          <p className="font-semibold text-foreground">{displayData?.email ?? '-'}</p>
        </div>

        <CompanyInputField label="Empresa" icon={<Building2 size={16} />} value={displayData?.company_name} isEditing={isEditing} onChange={(v: string) => updateField('company_name', v)} />

        <CompanyInputField label="Industria" icon={<BriefcaseBusiness size={16} />} value={displayData?.industry} isEditing={isEditing} onChange={(v: string) => updateField('industry', v)} />

        <CompanyInputField label="Contacto" icon={<UserRound size={16} />} value={displayData?.contact_name} isEditing={isEditing} onChange={(v: string) => updateField('contact_name', v)} />

        <CompanyInputField label="Teléfono" icon={<Phone size={16} />} value={displayData?.phone} isEditing={isEditing} onChange={(v: string) => updateField('phone', v)} />

        <CompanyInputField
          label="País"
          icon={<Globe size={16} />}
          value={displayData?.country}
          type="select"
          isEditing={isEditing}
          onChange={(v: string) => updateField('country', v)}
          options={[
            { label: 'Argentina', value: 'AR' },
            { label: 'Bolivia', value: 'BO' },
            { label: 'Brasil', value: 'BR' },
            { label: 'Chile', value: 'CL' },
            { label: 'Colombia', value: 'CO' },
            { label: 'Costa Rica', value: 'CR' },
            { label: 'Cuba', value: 'CU' },
            { label: 'República Dominicana', value: 'DO' },
            { label: 'Ecuador', value: 'EC' },
            { label: 'El Salvador', value: 'SV' },
            { label: 'Guatemala', value: 'GT' },
            { label: 'Honduras', value: 'HN' },
            { label: 'México', value: 'MX' },
            { label: 'Nicaragua', value: 'NI' },
            { label: 'Panamá', value: 'PA' },
            { label: 'Paraguay', value: 'PY' },
            { label: 'Perú', value: 'PE' },
            { label: 'Uruguay', value: 'UY' },
            { label: 'Venezuela', value: 'VE' },
          ]}
        />

        <div className="md:col-span-2">
          <CompanyInputField label="Dirección" icon={<MapPinned size={16} />} value={displayData?.address} isEditing={isEditing} onChange={(v: string) => updateField('address', v)} />
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={reset} type="button" className="rounded-xl border border-border px-6 py-2 transition-all hover:bg-surface-muted">
            Cancelar
          </button>

          <button onClick={save} type="button" disabled={loading} className="rounded-xl bg-primary px-6 py-2 text-white transition-all shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}
    </section>
  );
}
