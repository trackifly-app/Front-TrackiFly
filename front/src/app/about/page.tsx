import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div>
      <main>
        <section className="flex flex-col items-start px-8 md:px-20 py-20 gap-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Conocé a Trackifly, la plataforma que conecta personas con sus
            envíos.
          </p>
          <div className="flex gap-4 items-center">
            <Link href="/register">
              <button className="bg-[#D96B4A] hover:bg-[#c45f40] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Hacer un envío →
              </button>
            </Link>
            <Link
              href="/register"
              className="text-gray-700 hover:text-[#c45f40] font-medium transition-colors"
            >
              Crear cuenta gratis →
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-green-600 font-medium">
            <span>✅ Seguimiento en tiempo real</span>
            <span>✅ Seguro incluido</span>
            <span>✅ Soporte 24/7</span>
          </div>
          <div className="w-full h-80 md:h-120 rounded-2xl bg-gray-200 relative overflow-hidden mt-4">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              <Image
                src="/images/hero-about.jpg"
                alt="Logistica Trackyfly"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-10 px-8 md:px-20 py-16 max-w-7xl mx-auto items-center">
          <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-2xl overflow-hidden shrink-0">
            <Image
              src="https://i.pinimg.com/1200x/70/46/bd/7046bd709a640bc6da2abf0567055842.jpg"
              alt="descripción"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Nuestra historia
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Trackifly nació de la necesidad de simplificar la logística de
              paquetería para personas. Desde nuestros inicios, nos enfocamos en
              hacer que cada envío sea una experiencia simple, confiable y
              transparente.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Hoy somos una plataforma que gestiona múltiples envíos de forma
              simultánea, conectando a usuarios con sus paquetes en tiempo real,
              sin importar la cantidad o el destino.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 md:px-20 py-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900">Misión</h2>
            <p className="text-gray-500 leading-relaxed">
              Facilitar el envío de paquetes múltiples a cualquier destino,
              brindando a nuestros usuarios una experiencia de logística simple,
              rápida y totalmente rastreable.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-[#D96B4A] rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900">Visión</h2>
            <p className="text-gray-500 leading-relaxed">
              Convertirnos en la plataforma de paquetería múltiple más confiable
              de Latinoamérica, transformando la forma en que las personas
              gestionan sus envíos.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8 px-8 md:px-20 py-12 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">Nuestros valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Transparencia",
                desc: "Cada paquete tiene seguimiento en tiempo real. Sin sorpresas, sin incertidumbre.",
              },
              {
                title: "Confiabilidad",
                desc: "Nos comprometemos con cada envío como si fuera el nuestro.",
              },
              {
                title: "Simplicidad",
                desc: "Gestionar múltiples paquetes tiene que ser fácil. Eso es Trackifly.",
              },
              {
                title: "Cercanía",
                desc: "Estamos disponibles para ayudarte en cada paso del proceso.",
              },
              {
                title: "Innovación",
                desc: "Mejoramos constantemente nuestra plataforma para darte la mejor experiencia.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-2 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 px-8 py-20 text-center bg-white mt-8">
          <h2 className="text-3xl font-bold text-gray-900">
            ¿Listo para enviar con Trackifly?
          </h2>
          <p className="text-gray-500 max-w-md">
            Registrate gratis y gestioná todos tus envíos desde un solo lugar.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/register">
              <button className="bg-[#D96B4A] hover:bg-[#c45f40] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Registrarse
              </button>
            </Link>
            <button className="border border-gray-300 hover:border-[#D96B4A] hover:text-[#c45f40] text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
              Ver servicios
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
