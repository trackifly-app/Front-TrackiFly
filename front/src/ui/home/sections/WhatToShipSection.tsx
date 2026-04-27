'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Archive, Package, RotateCcw, Truck } from 'lucide-react';

const WhatToShipSection = () => {
  const { locale } = useParams<{ locale: string }>(); // Lee el idioma actual de la URL, por ejemplo "es".

  const shippingTypes = [ // Cada tarjeta representa un tipo de envio y su ruta.
    { label: 'Paqueteria', href: `/${locale}/orders`, icon: Package },
    { label: 'Sobre', href: `/${locale}/orders`, icon: Archive },
    { label: 'Pallet', sub: 'Mismo contenedor', href: `/${locale}/dashboard/user`, icon: Truck },
    { label: 'Devoluciones', sub: 'Retiro del producto', href: `/${locale}/dashboard/user`, icon: RotateCcw },
  ];

  return (
    // que necesitas enviar?
    <div className="bg-gray-50 px-12 py-12">
      <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">
        Que necesitas enviar?
      </h2>
      <p className="text-gray-500 text-sm text-center mb-8">
        Selecciona el tipo de envio que mejor se adapta a tus necesidades
      </p>
      <div className="grid grid-cols-4 gap-3 justify-center">
        {shippingTypes.map((s) => {
          const Icon = s.icon; // Guardamos el componente de icono para renderizarlo abajo.

          return (
            <Link
              key={s.label}
              href={s.href} // Link redirige al flujo de pedidos sin recargar la pagina.
              className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-primary">
                <Icon size={22} /> {/* Icono generico sin descargar imagenes. */}
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">{s.label}</p>
              <p className="text-xs text-gray-400 text-center">{s.sub}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WhatToShipSection;
