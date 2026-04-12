const CallToActionSection = () =>{
    return(
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
    )
}
export default CallToActionSection;