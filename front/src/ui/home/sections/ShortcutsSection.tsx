'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CircleHelp, MapPin, PackagePlus, Route } from 'lucide-react';

const ShortcutsSection = () => {
  const { locale } = useParams<{ locale: string }>(); // Lee el idioma actual de la URL, por ejemplo "es".

  const shortcuts = [ // Cada tarjeta tiene su texto y la ruta a donde debe navegar.
    { label: 'Hacer un envio', href: `/${locale}/orders`, icon: PackagePlus },
    { label: 'Seguir mis envios', href: `/${locale}/dashboard/user`, icon: Route },
    { label: 'Buscar sucursal', href: `/${locale}/about`, icon: MapPin },
    { label: 'Preguntas frecuentes', href: `/${locale}/about`, icon: CircleHelp },
  ];

  return (
    // accesos rapidos
    <div className="px-12 py-10">
      <div className="grid grid-cols-4 gap-3">
        {shortcuts.map((item) => {
          const Icon = item.icon; // Guardamos el componente de icono para renderizarlo abajo.

          return (
            <Link
              key={item.label}
              href={item.href} // Link redirige sin recargar toda la pagina.
              className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-primary">
                <Icon size={18} /> {/* Icono generico sin descargar imagenes. */}
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ShortcutsSection;
