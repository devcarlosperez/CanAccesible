import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

const PushNotificationsGuide = () => {
  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4 text-neutral-2">
              Guía de Notificaciones Push
            </h1>
            <p className="text-base font-roboto text-neutral-3">
              Última actualización: 14 de diciembre de 2025
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
                Las notificaciones push te permiten recibir alertas importantes de CanAccesible directamente en tu dispositivo,
                incluso cuando no tengas la aplicación abierta en tu navegador.
              </p>
            </section>

            {/* Important Note */}
            <section className="mb-8">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="ml-3">
                  <p className="text-sm font-roboto text-blue-700">
                    <strong>Importante:</strong> Para recibir notificaciones push, necesitas activarlas tanto en tu navegador
                    como en la configuración de tu sistema operativo (Windows, macOS, etc.).
                  </p>
                </div>
              </div>
            </section>

            {/* Step 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Paso 1: Activar en CanAccesible
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-neutral-3 font-roboto">
                  <li>Inicia sesión en tu cuenta de CanAccesible</li>
                  <li>Ve a tu <strong>Perfil</strong> (haz clic en tu nombre en la esquina superior derecha)</li>
                  <li>Busca la sección <strong>"Notificaciones Push"</strong></li>
                  <li>Activa el interruptor para permitir notificaciones</li>
                </ol>
              </div>
            </section>

            {/* Step 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Paso 2: Activar en tu Navegador
              </h2>

              <div className="space-y-6">
                {/* Chrome */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-poppins font-semibold text-neutral-2 mb-3 flex items-center">
                    <i className="fab fa-chrome text-blue-500 mr-2"></i>
                    Google Chrome
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-3 font-roboto text-sm">
                    <li>Haz clic en el icono del candado (🔒) en la barra de direcciones</li>
                    <li>Selecciona "Sitio no seguro" → "Notificaciones"</li>
                    <li>Elige "Permitir" o "Preguntar"</li>
                    <li>Si no aparece, haz clic en el icono de notificaciones (🔔) en la barra de direcciones</li>
                  </ol>
                </div>

                {/* Firefox */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-poppins font-semibold text-neutral-2 mb-3 flex items-center">
                    <i className="fab fa-firefox text-orange-500 mr-2"></i>
                    Mozilla Firefox
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-3 font-roboto text-sm">
                    <li>Haz clic en el icono de escudo (🛡️) en la barra de direcciones</li>
                    <li>Selecciona "Más información"</li>
                    <li>Busca "Permisos" → "Notificaciones"</li>
                    <li>Selecciona "Permitir"</li>
                  </ol>
                </div>

                {/* Edge */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-poppins font-semibold text-neutral-2 mb-3 flex items-center">
                    <i className="fab fa-edge text-blue-600 mr-2"></i>
                    Microsoft Edge
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-3 font-roboto text-sm">
                    <li>Haz clic en el icono de candado (🔒) en la barra de direcciones</li>
                    <li>Selecciona "Permisos del sitio"</li>
                    <li>Busca "Notificaciones" y selecciona "Permitir"</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Paso 3: Activar en Windows
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-poppins font-semibold text-neutral-2 mb-3">Windows 10/11</h3>
                <ol className="list-decimal list-inside space-y-2 text-neutral-3 font-roboto">
                  <li>Abre <strong>Configuración</strong> (Win + I)</li>
                  <li>Ve a <strong>Sistema</strong> → <strong>Notificaciones y acciones</strong></li>
                  <li>Activa "Obtener notificaciones de aplicaciones y otros remitentes"</li>
                  <li>Busca "CanAccesible" en la lista de aplicaciones</li>
                  <li>Asegúrate de que las notificaciones estén activadas</li>
                </ol>
              </div>
            </section>

            {/* Step 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Paso 4: Activar en macOS
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-poppins font-semibold text-neutral-2 mb-3">macOS</h3>
                <ol className="list-decimal list-inside space-y-2 text-neutral-3 font-roboto">
                  <li>Abre <strong>Preferencias del Sistema</strong></li>
                  <li>Ve a <strong>Notificaciones</strong></li>
                  <li>Busca tu navegador (Chrome, Firefox, Safari)</li>
                  <li>Activa "Permitir notificaciones"</li>
                  <li>Asegúrate de que "Mostrar notificaciones en el centro de notificaciones" esté activado</li>
                </ol>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold mb-4 text-primary-2">
                Solución de Problemas
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h4 className="font-poppins font-semibold text-yellow-800 mb-2">¿No recibes notificaciones?</h4>
                  <ul className="text-yellow-700 font-roboto text-sm space-y-1">
                    <li>• Verifica que tu navegador esté actualizado</li>
                    <li>• Comprueba que no tengas bloqueadas las notificaciones en el navegador</li>
                    <li>• Asegúrate de que CanAccesible esté activado en la configuración de Windows/macOS</li>
                    <li>• Prueba recargando la página y activando las notificaciones nuevamente</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h4 className="font-poppins font-semibold text-red-800 mb-2">¿Las notificaciones aparecen pero no suenan?</h4>
                  <ul className="text-red-700 font-roboto text-sm space-y-1">
                    <li>• Ve a Configuración de Windows → Sistema → Sonido</li>
                    <li>• Asegúrate de que el volumen general no esté silenciado</li>
                    <li>• Verifica que las notificaciones de aplicaciones puedan reproducir sonido</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Success */}
            <section className="mb-8">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <h4 className="font-poppins font-semibold text-green-800 mb-2">¿Todo funciona correctamente?</h4>
                <p className="text-green-700 font-roboto text-sm">
                  ¡Perfecto! Ahora recibirás notificaciones push de CanAccesible cuando haya nuevas respuestas
                  en tus conversaciones de soporte, actualizaciones importantes y más.
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

export default PushNotificationsGuide;