const ShortcutsSection = () =>{
    return(
        // accesos rapidos
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
    )
}
export default ShortcutsSection;