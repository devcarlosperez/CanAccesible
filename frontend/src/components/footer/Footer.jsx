import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/canaccesible-logo.webp";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col items-center justify-center bg-neutral-100 text-neutral-800 py-10 px-6 lg:px-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full max-w-7xl mb-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:w-2/3 ">
          <Link to="/">
            <div className="transition-all duration-300 hover:scale-105 mb-4">
              <img
                src={logo}
                alt="canaccesible-logo"
                className="h-16 lg:h-18 w-auto"
              />
            </div>
          </Link>

          <p className="hidden md:block text-sm text-neutral-600 font-roboto leading-relaxed max-w-sm mb-4">
            {t('footer_description')}
          </p>

          <ul className="flex gap-6 text-3xl">
            <li>
              <a
                href="https://www.youtube.com/channel/UC_IICs-9f1KYxOuIBQxfQ0g"
                className="text-neutral-800 hover:text-red-600 transition-colors"
                aria-label="Visita nuestro canal de YouTube"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/canaccesible/"
                className="text-neutral-800 hover:text-pink-600 transition-colors"
                aria-label="Visita nuestro perfil de Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@canaccesible"
                className="text-neutral-800 hover:text-black transition-colors"
                aria-label="Visita nuestro perfil de TikTok"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/canaccesible-el-rinc%C3%B3n-83b8a83a0/"
                className="text-neutral-800 hover:text-blue-700 transition-colors"
                aria-label="Visita nuestro perfil de LinkedIn"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-row justify-evenly md:justify-around text-center md:text-left w-full md:w-2/3">
          <div className="text-left">
            <h2 className="text-sm uppercase tracking-wider text-neutral-700 mb-3 font-poppins font-semibold">
              {t('company')}
            </h2>
            <ul className="space-y-8.5 lg:space-y-5 text-base font-roboto font-semibold">
              <li>
                <Link
                  to="/home#mission"
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t('our_mission')}
                </Link>
              </li>
              <li>
                <Link
                  to="/home#services"
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link
                  to="/home#about-us"
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t('about_us')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h2 className="text-sm uppercase tracking-wider text-neutral-700 mb-3 font-poppins font-semibold">
              {t('help')}
            </h2>
            <ul className="space-y-5 text-base font-roboto font-semibold">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t('support')}
                </Link>
              </li>
              <li>
                <Link
                  to={"/terms-conditions"}
                  className="hover:text-blue-600 transition-colors cursor-pointer inline-block"
                >
                  {t('terms_conditions')}
                </Link>
              </li>
              <li>
                <Link
                  to={"/privacy-policy"}
                  className="hover:text-blue-600 transition-colors cursor-pointer inline-block"
                >
                  {t('privacy_policy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="w-full max-w-7xl border-neutral-200 mb-6" />
      <p className="text-xs text-neutral-700 text-center font-roboto">
        {t('all_rights_reserved')}
      </p>
    </footer>
  );
};

export default Footer;
