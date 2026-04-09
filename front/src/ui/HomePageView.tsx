const HomePageView = () => {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 px-12 py-16 grid grid-cols-2 gap-8 items-end">
        <div className="pb-8">
          <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-3">
            Seguí tu envío ahora
          </h1>
          <p className="text-gray-500 text-base mb-7 leading-relaxed">
            Conocé el estado de tus envíos en todo momento.
          </p>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white mb-3">
            <input
              type="text"
              placeholder="Ingresá el número de seguimiento"
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-gray-800"
            />
            <button className="bg-primary hover:bg-primary-hover text-white px-5 py-3 text-sm font-medium transition-colors">
              Buscar
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Sin guiones ni puntos. Ej. 360000000000000
          </p>
          <div className="flex gap-5">
            {[
              "Seguimiento en tiempo real",
              "Seguro incluido",
              "Soporte 24/7",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 text-sm text-green-700 font-medium"
              >
                <span className="w-4 h-4 bg-green-600 rounded-full inline-block" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-end">
          <div className=""></div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="px-12 py-10">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Hacer un envío" },
            { label: "Seguir mis envíos" },
            { label: "Buscar sucursal" },
            { label: "Preguntas frecuentes" },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              <span className="text-sm font-medium text-gray-900 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ¿Qué necesitás enviar? */}
      <div className="bg-gray-50 px-12 py-12">
        <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">
          ¿Qué necesitás enviar?
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Seleccioná el tipo de envío que mejor se adapta a tus necesidades
        </p>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Paquetería" },
            { label: "Sobre" },
            { label: "Pallet", sub: "Mismo contenedor" },
            { label: "Devoluciones", sub: "Retiro del producto" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center"></div>
              <p className="text-sm font-medium text-gray-900 text-center">
                {s.label}
              </p>
              <p className="text-xs text-gray-400 text-center">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* cercania */}
      <div className="px-12 py-12 grid grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-medium text-gray-900 mb-3">
            Estamos cerca
          </h2>
          <p className="text-gray-500 text-base mb-6 leading-relaxed">
            Encontrá tu sucursal más cercana y hacé tu envío de forma
            presencial.
          </p>
          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
            Ver sucursales
          </button>
        </div>
        <div className="bg-gray-50 rounded-2xl h-64 border border-gray-200 flex items-center justify-center">
          vista de sucursales
        </div>
      </div>

      <div className="bg-gray-50 px-12 py-16 text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-3">
          ¿Listo para enviar con Trackifly?
        </h2>
        <p className="text-gray-500 text-base mb-7">
          Registrate gratis y gestioná todos tus envíos desde un solo lugar.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
            Registrarse gratis
          </button>
          <button className="border border-primary text-primary hover:bg-orange-50 px-6 py-3 rounded-lg text-sm font-medium transition-colors">
            Ver servicios
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageView;
