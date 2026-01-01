import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Background from "../../components/utils/Background";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Hero from "../../components/utils/Hero";
import { motion } from "motion/react";

const Home = () => {
  const { t } = useTranslation();
  let heroData = { text1: t("hero_text1"), text2: t("hero_text2") };

  return (
    <>
      <Helmet>
        <title>CanAccesible - {t("hero_text1")}</title>
        <meta name="description" content={t("mission_text")} />
        <link rel="canonical" href="https://canaccesible.com/" />
      </Helmet>
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        <Background />
        <Header />
        <Hero heroData={heroData} />
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className="bg-white py-20 px-6 md:px-12 lg:px-24 scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-800 mb-8"
          >
            {t("our_mission")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
          >
            <Trans i18nKey="mission_text" />
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="services"
        className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24 scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("services_title")}
            </h2>
          </motion.div>

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
                {t("service_report_title")}
              </h3>
              <p className="text-gray-600 mb-6">{t("service_report_desc")}</p>
              <Link
                to="/incidents"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                {t("service_report_link")}{" "}
                <i className="fa-solid fa-arrow-right ml-1"></i>
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
                {t("service_map_title")}
              </h3>
              <p className="text-gray-600 mb-6">{t("service_map_desc")}</p>
              <Link
                to="/map"
                className="text-green-700 font-semibold hover:text-green-800 transition-colors"
              >
                {t("service_map_link")}{" "}
                <i className="fa-solid fa-arrow-right ml-1"></i>
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
                {t("service_contact_title")}
              </h3>
              <p className="text-gray-600 mb-6">{t("service_contact_desc")}</p>
              <Link
                to="/contact"
                className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
              >
                {t("service_contact_link")}{" "}
                <i className="fa-solid fa-arrow-right ml-1"></i>
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
              {t("how_it_works")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("how_it_works_subtitle")}
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
                {t("step_identify")}
              </h3>
              <p className="text-gray-600">{t("step_identify_desc")}</p>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t("step_report")}
              </h3>
              <p className="text-gray-600">{t("step_report_desc")}</p>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t("step_improve")}
              </h3>
              <p className="text-gray-600">{t("step_improve_desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24 overflow-hidden scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                {t("about_us_tag")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                {t("about_us_title1")} <br />
                <span className="text-blue-600">{t("about_us_title2")}</span>
              </h2>
              <p className="text-gray-600 text-lg text-justify leading-relaxed mb-6">
                {t("about_us_text1")}
              </p>
              <p className="text-gray-600 text-lg text-justify leading-relaxed mb-8">
                {t("about_us_text2")}
              </p>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  {t("about_us_footer")}
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
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {t("passion")}
                </h3>
                <p className="text-sm text-gray-500">{t("passion_desc")}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {t("innovation")}
                </h3>
                <p className="text-sm text-gray-500">{t("innovation_desc")}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {t("learning")}
                </h3>
                <p className="text-sm text-gray-500">{t("learning_desc")}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {t("commitment")}
                </h3>
                <p className="text-sm text-gray-500">{t("commitment_desc")}</p>
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
            {t("cta_title")}
          </h2>
          <p className="text-xl mb-10 text-blue-100">{t("cta_subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t("cta_create_account")}
            </Link>
            <Link
              to="/incidents"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              {t("cta_view_incidents")}
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
