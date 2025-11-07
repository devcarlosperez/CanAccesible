import Background from "../../components/Background";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Hero from "../../components/Hero";

const Home = () => {
  let heroData = { text1: "Por unas islas", text2: "accesibles para todos" };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <Background />
        <Header />
        <Hero heroData={heroData} />
      </section>

      {/* 🔽 Resto del contenido */}
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <section className="bg-white text-black p-12">
        <h2>Contenido adicional</h2>
        <p>Aquí el fondo ya no aparece, bro 😎</p>
      </section>
      <Footer />
    </>
  );
};

export default Home;
