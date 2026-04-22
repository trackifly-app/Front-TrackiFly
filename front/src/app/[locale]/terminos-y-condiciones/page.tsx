import Link from 'next/link';

export default function TerminosYCondicionesPage() {
  return (
    <main className="min-h-screen bg-[#071633] text-white">
      <section className="border-b border-white/10 bg-[#091a3a]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#ff8a1d]">
            Legal
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/70 md:text-lg">
            Leé las condiciones de uso de Trackifly para el acceso a nuestra
            plataforma de gestión y seguimiento de envíos.
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
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">1. Aceptación de los términos</h2>
              <p className="mt-3 leading-7 text-white/75">
                Al acceder y utilizar Trackifly, el usuario acepta estos Términos y Condiciones.
                Si no está de acuerdo con alguna de las disposiciones aquí establecidas,
                deberá abstenerse de utilizar la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">2. Objeto del servicio</h2>
              <p className="mt-3 leading-7 text-white/75">
                Trackifly ofrece una plataforma digital para la gestión, registro,
                seguimiento y consulta de envíos nacionales e internacionales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">3. Registro y cuenta de usuario</h2>
              <p className="mt-3 leading-7 text-white/75">
                Para acceder a determinadas funcionalidades, el usuario deberá registrarse
                proporcionando información veraz, actualizada y completa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">4. Uso permitido</h2>
              <p className="mt-3 leading-7 text-white/75">
                El usuario se compromete a utilizar la plataforma únicamente con fines
                legítimos y de conformidad con la normativa aplicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">5. Información de envíos</h2>
              <p className="mt-3 leading-7 text-white/75">
                El usuario garantiza que los datos cargados en relación con los envíos son
                correctos y completos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">6. Disponibilidad del servicio</h2>
              <p className="mt-3 leading-7 text-white/75">
                Si bien procuramos garantizar la disponibilidad continua de la plataforma,
                no aseguramos que el servicio opere sin interrupciones o errores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">7. Propiedad intelectual</h2>
              <p className="mt-3 leading-7 text-white/75">
                Todos los contenidos, diseños, marcas, logotipos, textos, interfaces y
                funcionalidades de Trackifly son propiedad de sus titulares.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">8. Limitación de responsabilidad</h2>
              <p className="mt-3 leading-7 text-white/75">
                Trackifly no será responsable por daños directos o indirectos derivados del uso
                o imposibilidad de uso de la plataforma, salvo en los supuestos previstos por la ley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">9. Modificaciones</h2>
              <p className="mt-3 leading-7 text-white/75">
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#ff8a1d]">10. Jurisdicción y ley aplicable</h2>
              <p className="mt-3 leading-7 text-white/75">
                Estos Términos y Condiciones se regirán por las leyes de la República Argentina.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}