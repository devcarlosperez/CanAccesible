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

          {/* Contact Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 mb-6 md:mb-8 mx-2 md:mx-0 justify-items-center md:justify-items-start">
            {contactLiveChats.map((option, index) => (
              <div
                key={index}
                className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 md:p-8 flex flex-col items-center text-center cursor-pointer border w-full max-w-xs sm:max-w-sm md:max-w-none"
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
      </main>

      <Footer />
    </>
  );
};

export default Contact;