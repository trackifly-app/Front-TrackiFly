const WhatToShipSection = () =>{
    return(
    // que necesitas enviar?
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
    )
}
export default WhatToShipSection;