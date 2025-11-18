import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1
              className="text-3xl md:text-4xl font-poppins font-bold mb-4"
              style={{ color: "var(--color-neutral-2)" }}
            >
              Política de Privacidad
            </h1>
            <p
              className="text-base font-roboto"
              style={{ color: "var(--color-neutral-3)" }}
            >
              Última actualización: 18 de noviembre de 2025
            </p>
          </div>

          {/* Content Card */}
          <div
            className="rounded-xl shadow-md p-6 md:p-8 border"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "var(--color-accent-1)",
            }}
          >
            {/* Introduction */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Introducción
              </h2>
              <p
                className="text-base font-roboto leading-relaxed"
                style={{ color: "var(--color-neutral-3)" }}
              >
                En CANACCESIBLE, nos comprometemos a proteger su privacidad y garantizar
                que usted tenga una experiencia positiva en nuestro sitio web. Esta Política de
                Privacidad explica cómo recopilamos, utilizamos, divulgamos y salvaguardamos
                su información cuando visita nuestro sitio web.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Información que Recopilamos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Podemos recopilar información de usted de varias formas, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Información de registro:</strong> Nombre, correo electrónico, contraseña y otros detalles proporcionados durante el registro.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Información del perfil:</strong> Datos que proporciona voluntariamente en su perfil de usuario.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Información de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas y duración de la visita.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Cookies:</strong> Usamos cookies para mejorar su experiencia de navegación.
                </li>
              </ul>
            </section>

            {/* Use of Information */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Uso de la Información
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Utilizamos la información que recopilamos para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Proporcionar, operar y mantener nuestro sitio web.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Mejorar, personalizar y expandir nuestros servicios.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Entender cómo los usuarios interactúan con nuestro sitio.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Cumplir con obligaciones legales y regulatorias.
                </li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Base Legal para el Tratamiento de Datos (GDPR)
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                De conformidad con el Reglamento General de Protección de Datos (GDPR), procesamos sus datos bajo las siguientes bases legales:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Consentimiento:</strong> Para comunicaciones de marketing y seguimiento analítico.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Ejecución de contrato:</strong> Para registrar su cuenta y proporcionar acceso a nuestros servicios.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Cumplimiento legal:</strong> Para cumplir con obligaciones fiscales y legales aplicables.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Interés legítimo:</strong> Para mejorar nuestros servicios, detectar fraude y garantizar la seguridad.
                </li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Cookies y Seguimiento
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Utilizamos diferentes tipos de cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Cookies técnicas:</strong> Necesarias para el funcionamiento del sitio (autenticación, preferencias).
                </li>
              </ul>
              <p
                className="text-base font-roboto leading-relaxed mt-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                <strong>Cómo gestionar sus cookies:</strong> Puede controlar o eliminar cookies a través de la configuración de su navegador. 
                La mayoría de navegadores le permiten rechazar cookies o advertirle cuando se envíen. Tenga en cuenta que desactivar cookies 
                puede afectar la funcionalidad de nuestro sitio.
              </p>
            </section>

            {/* Data Recipients */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Destinatarios de los Datos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Compartimos sus datos con los siguientes terceros cuando es necesario:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Proveedores de hosting:</strong> Almacenamiento seguro de datos y funcionamiento del sitio web.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Servicios de mapas:</strong> OpenStreetMap y Leaflet para mostrar ubicaciones.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Proveedores de almacenamiento en la nube:</strong> DigitalOcean Spaces para gestionar contenido (imágenes, archivos).
                </li>
              </ul>
              <p
                className="text-base font-roboto leading-relaxed mt-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Todos nuestros proveedores están obligados a proteger sus datos y solo pueden utilizarlos para los fines especificados.
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Transferencias Internacionales de Datos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Algunos de nuestros proveedores pueden estar ubicados fuera de la Unión Europea, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Servicios en Estados Unidos:</strong> Algunos proveedores de hosting y análisis pueden procesar datos en EE.UU.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  <strong>Garantías de protección:</strong> Estos proveedores deben cumplir con los Acuerdos de Transferencia de Datos Internacionales 
                  u otras medidas de protección reconocidas por la UE.
                </li>
              </ul>
              <p
                className="text-base font-roboto leading-relaxed mt-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Garantizamos que cualquier transferencia de datos fuera de la UE cumple con el GDPR y utiliza mecanismos de protección 
                adecuados como Cláusulas Contractuales Estándar.
              </p>
            </section>
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Protección de Datos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Implementamos medidas de seguridad técnicas, administrativas y físicas para
                proteger su información personal contra acceso no autorizado, alteración,
                divulgación o destrucción. Esto incluye encriptación SSL, firewalls y acceso
                restringido a datos sensibles.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Retención de Datos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Retenemos su información personal solo por el tiempo necesario para cumplir
                con los propósitos para los cuales fue recopilada, a menos que la ley requiera
                o permita un período de retención más largo.
              </p>
            </section>

            {/* User Rights */}
            <section className="mb-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Sus Derechos
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Acceder a sus datos personales.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Rectificar datos inexactos.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Solicitar la eliminación de sus datos.
                </li>
                <li
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  Retirar su consentimiento en cualquier momento.
                </li>
              </ul>
            </section>

            {/* Contact Us */}
            <section className="border-t pt-8">
              <h2
                className="text-2xl font-poppins font-semibold mb-4"
                style={{ color: "var(--color-primary-2)" }}
              >
                Contacto
              </h2>
              <p
                className="text-base font-roboto leading-relaxed mb-4"
                style={{ color: "var(--color-neutral-3)" }}
              >
                Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos:
              </p>
              <div>
                <p
                  className="font-poppins font-semibold mb-2"
                  style={{ color: "var(--color-neutral-2)" }}
                >
                  Email:
                </p>
                <p
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  canaccesible@gmail.com
                </p>
              </div>
              <div className="mt-4">
                <p
                  className="font-poppins font-semibold mb-2"
                  style={{ color: "var(--color-neutral-2)" }}
                >
                  Teléfono:
                </p>
                <p
                  className="text-base font-roboto"
                  style={{ color: "var(--color-neutral-3)" }}
                >
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

export default PrivacyPolicy;
