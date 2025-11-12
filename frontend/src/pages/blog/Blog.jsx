import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";

const Blog = () => {
  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-poppins font-bold mb-4"
            style={{ color: "var(--color-neutral-2)" }}
          >
            Blog
          </h1>
          <p
            className="text-base font-roboto"
            style={{ color: "var(--color-neutral-3)" }}
          >
            Consulta nuestras noticias más relevantes
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
