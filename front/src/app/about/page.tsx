const AboutUs = () => {
  return (
    <div>
      <main>
        <section className="flex flex-col items-center text-center px-8 py-20">
          <h1>Sobre Nosotros</h1>
          <p>
            Conocé a Trackifly, la plataforma que conecta personas con sus
            envíos.
          </p>
        </section>

        <section className="flex flex-col gap-4 px-8 py-12">
          <h2>Nuestra historia</h2>
          <p>
            Trackifly nació de la necesidad de simplificar la logística de
            paquetería para personas. Desde nuestros inicios, nos enfocamos en
            hacer que cada envío sea una experiencia simple, confiable y
            transparente.
          </p>
          <p>
            Hoy somos una plataforma que gestiona múltiples envíos de forma
            simultánea, conectando a usuarios con sus paquetes en tiempo real,
            sin importar la cantidad o el destino.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-8 px-8 py-12">
          <div className="flex flex-col gap-4">
            <h2>Misión</h2>
            <p>
              Facilitar el envío de paquetes múltiples a cualquier destino,
              brindando a nuestros usuarios una experiencia de logística simple,
              rápida y totalmente rastreable.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2>Visión</h2>
            <p>
              Convertirnos en la plataforma de paquetería múltiple más confiable
              de Latinoamérica, transformando la forma en que las personas
              gestionan sus envíos.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8 px-8 py-12">
          <h2>Nuestros valores</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <h3>Transparencia</h3>
              <p>
                Cada paquete tiene seguimiento en tiempo real. Sin sorpresas,
                sin incertidumbre.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3>Confiabilidad</h3>
              <p>Nos comprometemos con cada envío como si fuera el nuestro.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3>Simplicidad</h3>
              <p>
                Gestionar múltiples paquetes tiene que ser fácil. Eso es
                Trackifly.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3>Cercanía</h3>
              <p>Estamos disponibles para ayudarte en cada paso del proceso.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3>Innovación</h3>
              <p>
                Mejoramos constantemente nuestra plataforma para darte la mejor
                experiencia.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 px-8 py-16">
          <h2>¿Listo para enviar con Trackifly?</h2>
          <p>
            Registrate gratis y gestioná todos tus envíos desde un solo lugar.
          </p>
          <div className="flex gap-4">
            <button>Registrarse</button>
            <button>Ver servicios</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
