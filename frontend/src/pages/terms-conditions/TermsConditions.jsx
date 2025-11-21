import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

const TermsConditions = () => {
  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4 text-neutral-2">
              Términos y Condiciones
            </h1>
            <p className="text-base font-roboto text-neutral-3">
              Última actualización: 21 de noviembre de 2025
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-xl shadow-md p-6 md:p-8 border border-accent-1 bg-white">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Introducción
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                Bienvenido a CANACCESIBLE. Estos Términos y Condiciones regulan su acceso y uso del sitio web 
                y todos los servicios relacionados. Al acceder o utilizar esta Plataforma, 
                usted acepta estar vinculado por estos Términos.
              </p>
            </section>

            {/* 1. Use License */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Licencia de Uso
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                CANACCESIBLE le otorga una licencia limitada, no exclusiva, revocable e intransferible para acceder 
                y utilizar la Plataforma únicamente para fines personales y no comerciales. Usted se compromete a no:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Reproducir, distribuir, modificar o transmitir el contenido sin autorización.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Intentar acceder a funciones restringidas sin permisos.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Utilizar bots, scrapers u otros medios automatizados para acceder a la Plataforma.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Transmitir virus, malware u otros código malicioso.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Interferir con la funcionalidad segura de la Plataforma.
                </li>
              </ul>
            </section>

            {/* 2. User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Cuentas de Usuario
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                Para acceder a ciertas funcionalidades de CANACCESIBLE, puede necesitar crear una cuenta. Usted es responsable de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Proporcionar información precisa, veraz y completa durante el registro.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Mantener la confidencialidad de su contraseña.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Aceptar la responsabilidad de todas las actividades que ocurran bajo su cuenta.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Notificar inmediatamente cualquier acceso no autorizado a su cuenta.
                </li>
              </ul>
              <p className="text-base font-roboto leading-relaxed mt-4 text-neutral-3">
                Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos Términos.
              </p>
            </section>

            {/* 3. Reporting Incidents */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Reporte de Incidencias de Accesibilidad
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                CANACCESIBLE permite que los usuarios reporten problemas de accesibilidad e incidencias. Al reportar:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Declara que la información proporcionada es veraz y acurada.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Acepta que CANACCESIBLE puede moderar, editar o eliminar reportes inapropiados.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Entiende que CANACCESIBLE no es responsable de las acciones tomadas por terceros basadas en tus reportes.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Consientes que las imágenes y datos compartidos pueden ser utilizados para mejorar la accesibilidad.
                </li>
              </ul>
            </section>

            {/* 4. Content Ownership */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Propiedad del Contenido
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                Todo el contenido publicado en CANACCESIBLE (incluidas imágenes, textos y datos) es propiedad de:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  <strong>Contenido de CANACCESIBLE:</strong> Es propiedad exclusiva de CANACCESIBLE y está protegido por derechos de autor.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  <strong>Contenido del Usuario:</strong> Usted retiene la propiedad del contenido que usted crea, pero otorga a CANACCESIBLE 
                  una licencia perpetua, royalty-free para usar, modificar y distribuir dicho contenido.
                </li>
              </ul>
            </section>

            {/* 5. User Conduct */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Conducta del Usuario
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                Usted acepta no:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Publicar contenido ofensivo, discriminatorio, ilegal o difamatorio.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Acosar, amenazar o intimidar a otros usuarios.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Violar derechos de privacidad o intelectuales de terceros.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Hacer spam o publicidad no autorizada.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Falsificar información o suplantar identidades.
                </li>
              </ul>
            </section>

            {/* 7. Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Limitación de Responsabilidad
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                En la máxima medida permitida por la ley, CANACCESIBLE no será responsable por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Pérdida de datos, ingresos o beneficios.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Daños causados por malware, virus o ataques de seguridad.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Problemas derivados del uso indebido de la Plataforma.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Acciones de terceros o usuarios.
                </li>
              </ul>
            </section>

            {/* 8. Indemnification */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Indemnización
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                Usted acepta indemnizar y mantener indemne a CANACCESIBLE, sus directivos, empleados y agentes contra cualquier 
                reclamo, demanda, pérdida o gasto (incluyendo honorarios legales) que surja de su violación de estos Términos o 
                de su uso indebido de la Plataforma.
              </p>
            </section>

            {/* 9. Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Terminación de Servicio
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                CANACCESIBLE se reserva el derecho de suspender o terminar el acceso a la Plataforma sin previo aviso si:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base font-roboto text-neutral-3">
                  Viola estos Términos o leyes aplicables.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Realiza actividades fraudulentas o maliciosas.
                </li>
                <li className="text-base font-roboto text-neutral-3">
                  Incurre en conducta abusiva hacia otros usuarios.
                </li>
              </ul>
            </section>

            {/* 10. Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Cambios en los Términos
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                CANACCESIBLE se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios significativos 
                serán notificados a través de email o mediante un aviso destacado en la Plataforma. Su uso continuado de la 
                Plataforma después de los cambios constituye aceptación de los Términos modificados.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Ley Aplicable
              </h2>
              <p className="text-base font-roboto leading-relaxed text-neutral-3">
                Estos Términos se rigen por las leyes de España. Cualquier disputa derivada de estos Términos será resuelta 
                exclusivamente por los tribunales competentes de España.
              </p>
            </section>

            {/* 12. Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Contacto
              </h2>
              <p className="text-base font-roboto leading-relaxed mb-4 text-neutral-3">
                Si tiene preguntas sobre estos Términos y Condiciones, por favor contáctenos:
              </p>
              <div>
                <p className="font-poppins font-semibold mb-2 text-neutral-2">
                  Email:
                </p>
                <p className="text-base font-roboto text-neutral-3">
                  canaccesible@gmail.com
                </p>
              </div>
              <div className="mt-4">
                <p className="font-poppins font-semibold mb-2 text-neutral-2">
                  Teléfono:
                </p>
                <p className="text-base font-roboto text-neutral-3">
                  928 30 43 67
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermsConditions;