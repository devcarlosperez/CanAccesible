import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import BlogSlider from "../../components/blog/BlogSlider";
import BlogArticlesList from "../../components/blog/BlogArticlesList";
import { useState } from "react";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

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
        {currentPage === 1 && (
          <div className="flex justify-center mb-16">
            <BlogSlider articleIds={[3, 4, 5, 7, 8]}/>
          </div>
        )}

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
              <BlogArticlesList onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
