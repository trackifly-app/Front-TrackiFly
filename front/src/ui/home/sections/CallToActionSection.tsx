'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const CallToActionSection = () => {
  const { locale } = useParams<{ locale: string }>(); // Lee el idioma actual de la URL.

  return (
    <div className="bg-gray-50 px-12 py-16 text-center">
      <h2 className="text-2xl font-medium text-gray-900 mb-3">
        Listo para enviar con Trackifly?
      </h2>
      <p className="text-gray-500 text-base mb-7">
        Registrate gratis y gestiona todos tus envios desde un solo lugar.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href={`/${locale}/register`} // Lleva directo a la pantalla de registro.
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Registrarse gratis
        </Link>
      </div>
    </div>
  );
};

export default CallToActionSection;
