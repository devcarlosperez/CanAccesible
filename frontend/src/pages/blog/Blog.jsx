import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import BlogSlider from "../../components/blog/BlogSlider";
import BlogArticlesList from "../../components/blog/BlogArticlesList";
import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl md:text-4xl font-poppins font-bold mb-4"
            style={{ color: "var(--color-neutral-2)" }}
          >
            {t('blog_title')}
          </h1>
          <p
            className="text-base font-roboto"
            style={{ color: "var(--color-neutral-3)" }}
          >
            {t('blog_subtitle')}
          </p>
        </motion.div>

        {/* Blog Slider */}
        {currentPage === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <BlogSlider articleIds={[1, 2, 4, 5]}/>
          </motion.div>
        )}

        {/* Blog Articles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2
            className="text-2xl md:text-3xl font-poppins font-bold mb-8 text-center"
            style={{ color: "var(--color-neutral-2)" }}
          >
            {t('blog_all_articles')}
          </h2>
          <div className="px-4 md:px-6 lg:px-0 flex justify-center">
            <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl">
              <BlogArticlesList onPageChange={setCurrentPage} />
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
