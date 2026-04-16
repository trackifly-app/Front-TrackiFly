import Link from 'next/link';
// es responsive
const Footer = () => {
  return (
    <footer className="bg-[#0b1220] text-slate-300">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-slate-800">
        <div className="flex flex-col gap-4">
          <span className="text-white text-xl font-bold">
            Tracki<span className="text-orange-500">fly</span>
          </span>
          <p className="text-sm leading-relaxed text-slate-400">La plataforma de logística más confiable para envíos nacionales e internacionales. Rápido, seguro y transparente.</p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold">Servicios</h3>
          <ul className="flex flex-col gap-2 list-none text-sm">
            <li>Envíos nacionales</li>
            <li>Seguimiento en tiempo real</li>
            <li>Envíos para empresas</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold">Empresa</h3>
          <ul className="flex flex-col gap-2 list-none text-sm">
            <Link href="/about" className="hover:text-orange-500 transition-colors">
              Sobre nosotros
            </Link>
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
          <h3 className="text-white font-semibold">Contacto</h3>
          <p className="text-sm text-slate-400">Av. del libertador 1234, Buenos Aires, Argentina</p>
          <p className="text-sm text-slate-400">08000-333-8356</p>
          <p className="text-sm text-slate-400">trackifly@gmail.com.ar</p>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="" className="text-sm text-gray-400">
              Rastrear mi envío
            </label>
            <div className="flex">
              <input type="text" placeholder="VLZ-2024-XXXXXX" className="flex-1 bg-[#111827] text-sm text-slate-200 placeholder-slate-500 px-3 py-2 rounded-l outline-none border border-slate-700" />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r text-sm font-medium transition-colors">Ir</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-8 py-4 border-t border-slate-800 text-sm text-slate-500">
        <p>© 2024 Trackifly. Todos los derechos reservados.</p>
        <div className="flex gap-3 md:gap-6 items-center">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Sistema operativo
          </span>
          <a href="#" className="hover:text-gray-300">
            Aviso legal
          </a>
          <a href="#" className="hover:text-gray-300">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
