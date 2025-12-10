import { Link } from "react-router-dom";
import Background from "../../components/utils/Background";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Hero from "../../components/utils/Hero";
import { motion } from "motion/react";

const Home = () => {
  let heroData = { text1: "Por unas islas", text2: "accesibles para todos" };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        <Background />
        <Header />
        <Hero heroData={heroData} />
      </section>

      <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-800 mb-8"
          >
            Nuestra Misión
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
          >
            CanAccesible es una plataforma comunitaria diseñada para transformar
            las Islas Canarias en un referente de accesibilidad. <br />
            <br />
            Permite que cualquier persona pueda registrar, compartir y mejorar
            la accesibilidad de lugares públicos y privados, fomentando un
            entorno más inclusivo para toda la comunidad.
          </motion.p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="fa-solid fa-bullhorn"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Reporta Incidencias
              </h3>
              <p className="text-gray-600 mb-6">
                Documenta barreras arquitectónicas o destaca buenas prácticas de
                accesibilidad. Tu voz ayuda a identificar áreas de mejora.
              </p>
              <Link
                to="/incidents"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Ver Incidencias <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Mapa Interactivo
              </h3>
              <p className="text-gray-600 mb-6">
                Explora el estado de la accesibilidad en tiempo real. Visualiza
                puntos críticos y zonas accesibles en todas las islas.
              </p>
              <Link
                to="/map"
                className="text-green-700 font-semibold hover:text-green-800 transition-colors"
              >
                Explorar Mapa <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Contáctanos
              </h3>
              <p className="text-gray-600 mb-6">
                Si tienes alguna duda, sugerencia o necesitas asistencia, no
                dudes en contactarnos. Estamos aquí para ayudarte.
              </p>
              <Link
                to="/contact"
                className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
              >
                Contactar <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-7">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Tres simples pasos para hacer un cambio real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 text-center relative"
            >
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg border-4 border-white z-10 relative">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Identifica
              </h3>
              <p className="text-gray-600">
                Observa tu entorno. ¿Hay una rampa bloqueada? ¿Un semáforo sin
                sonido? ¿O un local perfectamente adaptado?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 text-center relative"
            >
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg border-4 border-white z-10 relative">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Reporta</h3>
              <p className="text-gray-600">
                Usa la app para subir una foto, geolocalizar el punto y
                describir la incidencia en segundos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 text-center relative"
            >
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg border-4 border-white z-10 relative">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Mejora</h3>
              <p className="text-gray-600">
                Tu reporte notifica a la comunidad y autoridades, impulsando
                acciones para eliminar la barrera.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Sobre Nosotros
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                Más que un proyecto, <br />
                <span className="text-blue-600">una iniciativa.</span>
              </h2>
              <p className="text-gray-600 text-lg text-justify leading-relaxed mb-6">
                CANACCESIBLE nació en las aulas del IES El Rincón como un
                proyecto final de ciclo, pero con el corazón puesto en las
                calles de Canarias. Somos un equipo de tres estudiantes
                apasionados por la tecnología y el impacto social.
              </p>
              <p className="text-gray-600 text-lg text-justify leading-relaxed mb-8">
                Creemos que la programación es una herramienta poderosa para
                derribar barreras. Lo que comenzó como una simple idea entre
                compañeros, hoy busca ser la voz de una comunidad que exige y
                merece accesibilidad real.
              </p>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  Creado con ❤️ por estudiantes de 2º DAW del IES El Rincón
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2 grid grid-cols-2 gap-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Pasión</h3>
                <p className="text-sm text-gray-500">
                  Desarrollamos software pensando en las personas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Innovación
                </h3>
                <p className="text-sm text-gray-500">
                  Usamos las últimas tecnologías para crear una experiencia
                  fluida.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Aprendizaje
                </h3>
                <p className="text-sm text-gray-500">
                  Un proyecto que busca tener un impacto real en el mundo.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Compromiso
                </h3>
                <p className="text-sm text-gray-500">
                  Dedicados a mejorar la calidad de vida a través de la
                  accesibilidad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-primary-2 py-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ¿Listo para marcar la diferencia?
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Tu participación es clave para mejorar la accesibilidad en Canarias.
            Regístrate hoy y empieza a colaborar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Crear Cuenta
            </Link>
            <Link
              to="/incidents"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Ver Incidencias
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
