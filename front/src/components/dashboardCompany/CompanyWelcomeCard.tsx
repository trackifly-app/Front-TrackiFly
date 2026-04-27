'use client';

import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { CompanyWelcomeCardProps } from '@/interfaces/shipment';

type Props = CompanyWelcomeCardProps & {
  onImageSelected?: (file: File) => void;
  uploadingImage?: boolean;
};

export default function CompanyWelcomeCard({ company, moduleCount, onImageSelected, uploadingImage = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    if (uploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo puedes subir imágenes PNG, JPG, JPEG o WEBP');
      event.target.value = '';
      return;
    }

    onImageSelected?.(file);
    event.target.value = '';
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <button type="button" onClick={handleImageClick} disabled={uploadingImage} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted disabled:cursor-not-allowed disabled:opacity-70" aria-label="Cambiar imagen de empresa">
            <img src={company.image || '/default-company.png'} alt={company.company_name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-75" />

            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition duration-300 group-hover:opacity-100">{uploadingImage ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera size={22} className="text-white" />}</div>
          </button>

          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleImageChange} />

          <div>
            <p className="mb-2 font-semibold text-primary">Dashboard empresarial</p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Bienvenido, {company.company_name}</h1>

            <p className="mt-2 max-w-2xl text-muted">
              Aquí puedes revisar la información de tu empresa y acceder a los módulos principales de gestión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-center">
            <p className="text-sm text-muted">Módulos activos</p>
            <p className="text-3xl font-bold text-primary">{moduleCount}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">País</p>
            <p className="text-2xl font-bold text-foreground">{company.country || '-'}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted px-5 py-4 text-center">
            <p className="text-sm text-muted">Plan</p>
            <p className="text-lg font-bold text-foreground">{company.plan || '-'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
