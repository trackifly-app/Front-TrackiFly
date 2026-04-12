const LocationsSection = () =>{
    return(
    // cercania
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
    )
}
export default LocationsSection;