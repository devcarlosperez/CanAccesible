import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

const Contact = () => {

  const contactLiveChats = [
    {
      title: "Soporte de cuenta",
      description: "¿Tiene problemas con su cuenta o contribuciones?",
      icon: "fa-user",
      iconType: "fa-solid",
    },
    {
      title: "Reportar una incidencia",
      description: "¿Encontró algún obstáculo o problema que afecte la accesibilidad?",
      icon: "fa-triangle-exclamation",
      iconType: "fa-solid",
    },
    {
      title: "Recursos de accesibilidad",
      description: "¿Necesita ayuda para encontrar guías, herramientas o recursos?",
      icon: "fa-wheelchair-move",
      iconType: "fa-solid",
    },
    {
      title: "Consulta general",
      description: "¿Alguna otra pregunta o sugerencia?",
      icon: "fa-lightbulb",
      iconType: "fa-solid",
    },
  ];

  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6" style={{ backgroundColor: "var(--color-accent-1)" }}>
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4" style={{ color: "var(--color-neutral-2)" }}>
              ¿En qué podemos ayudarte?
            </h1>
            <p className="text-base font-roboto" style={{ color: "var(--color-neutral-3)" }}>
              Selecciona una opción para continuar
            </p>
          </div>

          {/* Contact Options Flex */}
          <div className="flex flex-wrap gap-y-6 gap-x-6 mb-6 md:mb-8 mx-4 md:mx-8 lg:mx-4 justify-center lg:justify-center">
            {contactLiveChats.map((option, index) => (
              <div
                key={index}
                className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex flex-col items-center text-center cursor-pointer border w-full max-w-xs sm:max-w-sm md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)]"
                style={{ 
                  backgroundColor: "#ffffff",
                  borderColor: "var(--color-accent-1)"
                }}
              >
                {/* Icon */}
                <div className="text-5xl mb-6" style={{ color: "var(--color-primary-2)" }}>
                  <i className={`${option.iconType} ${option.icon}`}></i>
                </div>

                {/* Title */}
                <h2 className="text-xl font-poppins font-semibold mb-2" style={{ color: "var(--color-neutral-2)" }}>
                  {option.title}
                </h2>

                {/* Description */}
                <p className="text-sm font-roboto hidden md:block" style={{ color: "var(--color-neutral-3)" }}>
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center px-4 md:px-0" style={{ color: "var(--color-neutral-2)" }}>
            Contacto
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-y-8 gap-x-8 items-stretch px-4 md:px-8 lg:px-0">
            {/* Information Card */}
            <div
              className="rounded-xl shadow-md p-6 md:p-8 border w-full max-w-sm md:max-w-none mx-auto lg:mx-0"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--color-accent-1)"
              }}
            >
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <p className="font-poppins font-semibold mb-2" style={{ color: "var(--color-neutral-2)" }}>
                    Email
                  </p>
                  <p className="font-roboto text-base border-b-2" style={{ color: "var(--color-neutral-3)", borderColor: "var(--color-primary-1)" }}>
                    canaccesible@gmail.com
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="font-poppins font-semibold mb-2" style={{ color: "var(--color-neutral-2)" }}>
                    Número de teléfono
                  </p>
                  <p className="font-roboto text-base border-b-2" style={{ color: "var(--color-neutral-3)", borderColor: "var(--color-primary-1)" }}>
                    928 61 67 89
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="font-poppins font-semibold mb-2" style={{ color: "var(--color-neutral-2)" }}>
                    Localización
                  </p>
                  <p className="font-roboto text-base border-b-2 mb-4" style={{ color: "var(--color-neutral-3)", borderColor: "var(--color-primary-1)" }}>
                    3501l, Las Palmas GC, IES EL RINCÓN
                  </p>
                </div>

                {/* Accessibility Support */}
                <div>
                  <p className="font-poppins font-semibold mb-2" style={{ color: "var(--color-neutral-2)" }}>
                    Soporte de accesibilidad
                  </p>
                  <p className="font-roboto text-base" style={{ color: "var(--color-neutral-3)" }}>
                    ¿Necesito ayuda? Estamos comprometidos con la inclusión.
                  </p>
                </div>
              </div>
            </div>

            {/* Map Image for Desktop/Tablet */}
            <div className="hidden md:block rounded-xl overflow-hidden shadow-lg md:h-56 lg:h-full">
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=3501l,+Las+Palmas+GC&zoom=15&size=600x400&key=YOUR_API_KEY"
                alt="Mapa de ubicación"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Location Button for Mobile */}
          <div className="md:hidden flex justify-center pt-6">
            <a
              href="https://www.google.com/maps/place/IES+El+Rinc%C3%B3n/@28.1274127,-15.4493183,17z/data=!3m1!4b1!4m6!3m5!1s0xc40951c8a18a0f3:0x142cb0d09763a325!8m2!3d28.1274127!4d-15.4467434!16s%2Fg%2F11b6d2ckv0?entry=ttu&g_ep=EgoyMDI1MTEwNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-poppins font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--color-info)",
                color: "#ffffff"
              }}
            >
              Ver ubicación en el mapa
              <i className="fa-solid fa-location-dot ml-3"></i>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;