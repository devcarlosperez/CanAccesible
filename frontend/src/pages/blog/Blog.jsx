import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import BlogSlider from "../../components/blog/BlogSlider";
import BlogArticlesList from "../../components/blog/BlogArticlesList";

const Blog = () => {

  const blogArticles = [
    {
      id: 1,
      title: 'Comunidad Canaria Identifica Barreras: Reportes que Generan Cambio',
      description: 'Conoce cómo ciudadanos de toda Canarias están utilizando la plataforma para reportar barreras de accesibilidad y promover mejoras en sus comunidades.',
      nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1552664730-d307ca884978.jpeg',
    },
    {
      id: 2,
      title: 'Pautas WCAG 2.2: Garantizando una Web Accesible para Todos',
      description: 'Descubre cómo las directrices WCAG 2.2 aseguran que plataformas como Canarias Accesible sean inclusivas y usables para personas con discapacidades.',
      nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1519389950473-47ba0277781c.jpeg',
    },
    {
      id: 3,
      title: 'Mapas Interactivos: Visualizando la Accesibilidad en Canarias',
      description: 'Explora cómo los mapas dinámicos de Canarias Accesible permiten filtrar y descubrir espacios accesibles o barreas en tiempo real.',
      nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/700px-Canarias-rotulado.webp',
    },
    {
      id: 4,
      title: 'Contenido Multimedia Accesible: Imágenes, Videos y Descripciones Alternativas',
      description: 'Aprende por qué las descripciones alternativas y la accesibilidad multimedia son fundamentales en Canarias Accesible.',
      nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1504384308090-c894fdcc538d.jpeg',
    },
    {
      id: 5,
      title: 'Responsivo y Multiplataforma: Canarias Accesible en tu Dispositivo',
      description: 'Descubre cómo Canarias Accesible es accesible desde cualquier dispositivo: móvil, tablet o computadora.',
      nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/walls-io-VkhP-zriXZQ-unsplash.jpg',
    },
  ]

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
            Descubre los artículos más relevantes
          </p>
        </div>

        {/* Blog Slider */}
        <div className="flex justify-center mb-16">
          <BlogSlider blogArticles={blogArticles} />
        </div>

        {/* Blog Articles List */}
        <div className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-poppins font-bold mb-8 text-center"
            style={{ color: "var(--color-neutral-2)" }}
          >
            Todos los Artículos
          </h2>
          <div className="px-4 md:px-6 lg:px-0 flex justify-center">
            <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl">
              <BlogArticlesList />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
