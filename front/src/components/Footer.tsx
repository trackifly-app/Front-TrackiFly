import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col gap-4">
        <span>Trackifly</span>
        <p>
          La plataforma de logística más confiable para envíos nacionales e
          internacionales. Rápido, seguro y transparente.{" "}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3>Servicios</h3>
        <ul className="flex flex-col gap-2 list-none">
          <li>Envíos nacionale</li>
          <li>Seguimiento en tiempo real</li>
          <li>Envíos para empresas</li>
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h3>Empresa</h3>
        <ul className="flex flex-col gap-2 list-none">
          <Link href="/about">Sobre nosotros</Link>
          <li>Términos y condiciones</li>
          <li>Política de privacidad</li>
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <h3>Contacto</h3>
        <p>Av. del libertador 1234, Buenos Aires, Argentina</p>
        <p>08000-333-8356</p>
        <p>trackifly@gmail.com.ar</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="">Rastrear mi envío</label>
        <div>
          <input type="text" placeholder="VLZ-2024-XXXXXX" className="flex-1" />
          <button>Ir</button>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t">
        <p>© 2024 VelozShip. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <span>● Sistema operativo</span>
          <a href="#">Aviso legal</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
