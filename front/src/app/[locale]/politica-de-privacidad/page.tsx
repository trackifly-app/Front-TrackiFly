import Link from 'next/link';

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#071633] text-white">
      <section className="border-b border-white/10 bg-[#091a3a]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#ff8a1d]">
            Legal
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/70 md:text-lg">
            Conocé cómo recopilamos, usamos y protegemos tus datos personales dentro de Trackifly.
          </p>

          <div className="mt-6">
            <Link
              href="/es"
              className="inline-flex rounded-xl border border-[#ff8a1d] px-5 py-2.5 text-sm font-medium text-[#ff8a1d] transition hover:bg-[#ff8a1d] hover:text-white"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-2xl border border-white/10 bg-[#0b1b3d] p-8 shadow-[0_0_30px_rgba(0,0,0,0.25)] md:p-10">
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">1. Información que recopilamos</h2>
              <p className="mt-3 leading-7 text-white/75">
                Podemos recopilar datos personales como nombre, correo electrónico,
                teléfono, dirección, información de envíos y datos relacionados con el
                uso de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">2. Finalidad del tratamiento</h2>
              <p className="mt-3 leading-7 text-white/75">
                Utilizamos la información para operar la plataforma, gestionar envíos,
                brindar soporte, mejorar nuestros servicios y cumplir obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">3. Base legal y consentimiento</h2>
              <p className="mt-3 leading-7 text-white/75">
                El tratamiento de datos se realiza conforme a la normativa aplicable y,
                cuando corresponda, sobre la base del consentimiento otorgado por el usuario.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">4. Conservación de datos</h2>
              <p className="mt-3 leading-7 text-white/75">
                Conservaremos los datos personales durante el tiempo necesario para cumplir
                con las finalidades descritas en esta política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">5. Compartición de información</h2>
              <p className="mt-3 leading-7 text-white/75">
                La información podrá compartirse con proveedores tecnológicos, operadores
                logísticos o terceros vinculados al funcionamiento del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">6. Seguridad de la información</h2>
              <p className="mt-3 leading-7 text-white/75">
                Adoptamos medidas técnicas y organizativas razonables para proteger los datos
                personales frente a accesos no autorizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">7. Derechos del usuario</h2>
              <p className="mt-3 leading-7 text-white/75">
                El usuario podrá solicitar el acceso, rectificación, actualización o supresión
                de sus datos personales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">8. Cookies y tecnologías similares</h2>
              <p className="mt-3 leading-7 text-white/75">
                Podemos utilizar cookies y herramientas similares para mejorar la experiencia
                de navegación y analizar el uso del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">9. Cambios a esta política</h2>
              <p className="mt-3 leading-7 text-white/75">
                Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">10. Contacto</h2>
              <p className="mt-3 leading-7 text-white/75">
                Si tenés consultas sobre esta Política de Privacidad, podés contactarnos a través
                del correo informado en el sitio.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}