const TrackingSection = () => {
  return (
    <section className="h-full flex items-start">
        <div className="w-full max-w-xl flex flex-col justify-start">
            <h1 className="text-5xl font-medium text-gray-900 leading-tight mb-4">
                Seguí tu envío ahora
            </h1>

            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-md">
                Conocé el estado de tus envíos en todo momento.
            </p>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white mb-3 max-w-md">
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

            <div className="flex flex-wrap gap-5 max-w-md">
                {[
                    "Seguimiento en tiempo real",
                    "Seguro incluido",
                    "Soporte 24/7",
                ].map((t) => (
                    <span
                    key={t}
                    className="flex items-center gap-2 text-sm text-green-700 font-medium"
                    >
                    <span className="w-3.5 h-3.5 bg-green-600 rounded-full inline-block" />
                    {t}
                    </span>
                ))}
            </div>
        </div>
    </section>
  );
};

export default TrackingSection;