import CircularGallery from "../../../components/react-bits/CircullarGallery";
import LoginForm from "./LoginForm";
import { registerImages } from "../../../utils/registerImages";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const { t } = useTranslation();
  return (
    <section className="flex h-screen">
      <Helmet>
        <title>{t("login_meta_title")}</title>
        <meta name="description" content={t("login_meta_description")} />
        <link rel="canonical" href="https://canaccesible.es/login" />
      </Helmet>
      <div className="hidden lg:flex bg-primary-2 w-2/3 flex-col items-center justify-start relative overflow-hidden">
        <div className="absolute -top-56 -left-80 w-[520px] h-80 border-6 border-primary-1 rounded-full opacity-90"></div>

        <div className="absolute -bottom-50 -right-70 w-[520px] h-80 border-6 border-primary-1 rounded-full opacity-90"></div>

        <h1 className="text-white text-5xl font-poppins font-semibold text-center mt-32 z-10">
          {t("login_welcome_back")}
        </h1>

        <div className="flex justify-center items-center w-full h-full z-10">
          <CircularGallery
            bend={3}
            scrollEase={0.03}
            items={registerImages}
            textColor="white"
          />
        </div>
      </div>

      <LoginForm />
    </section>
  );
};

export default Login;
