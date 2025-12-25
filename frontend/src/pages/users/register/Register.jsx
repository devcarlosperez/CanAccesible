import CircularGallery from "../../../components/react-bits/CircullarGallery";
import RegisterForm from "./RegisterForm";
import bgHero from "../../../assets/background-hero.webp";
import { useTranslation } from "react-i18next";

const imagenes = [
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
  {
    image: new URL(bgHero, import.meta.url).href,
    text: "Montaña nevada",
  },
];

const Register = () => {
  const { t } = useTranslation();
  return (
    <section className="flex h-screen">
      <div className="hidden lg:flex bg-primary-1 w-2/3 flex-col items-center justify-start relative overflow-hidden">
        <div className="absolute -top-56 -left-80 w-[520px] h-80 border-6 border-primary-2 rounded-full opacity-90"></div>

        <div className="absolute -bottom-50 -right-70 w-[520px] h-80 border-6 border-primary-2 rounded-full opacity-90"></div>

        <h1 className="text-black text-5xl font-poppins font-semibold text-center mt-37 pb-7 z-10">
          {t("register_welcome")}
        </h1>

        <div className="flex justify-center items-center w-full h-full z-10">
          <CircularGallery
            bend={3}
            scrollEase={0.03}
            items={imagenes}
            textColor="black"
          />
        </div>
      </div>

      <RegisterForm />
    </section>
  );
};

export default Register;
