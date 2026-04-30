'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const LocationsSection = () => {
  const { locale } = useParams<{ locale: string }>(); // Lee el idioma actual de la URL.

  return (
    // cercania
    <div className="px-12 py-12 grid grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-3">
          Estamos cerca
        </h2>
        <p className="text-gray-500 text-base mb-6 leading-relaxed">
          Encontra tu sucursal mas cercana y hace tu envio de forma presencial.
        </p>
        <Link
          href={`/${locale}/about`} // Por ahora sucursales redirige a Conocenos.
          className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Ver sucursales
        </Link>
      </div>
      <div className="bg-gray-50 rounded-2xl h-64 border border-gray-200 overflow-hidden">
        <iframe
          title="Mapa del Obelisco de Buenos Aires"
          src="https://www.google.com/maps?q=Obelisco%20de%20Buenos%20Aires&output=embed" // Muestra un mapa embebido apuntando al Obelisco.
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default LocationsSection;
