import CircularGallery from "../../../components/react-bits/CircullarGallery";
import LoginForm from "./LoginForm";
import bgHero from "../../../assets/background-hero.webp";

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

const Login = () => {
  return (
    <section className="flex h-screen">
      <div className="hidden lg:flex bg-primary-2 w-2/3 flex-col items-center justify-start relative overflow-hidden">
        <div className="absolute -top-56 -left-80 w-[520px] h-80 border-6 border-primary-1 rounded-full opacity-90"></div>

        <div className="absolute -bottom-50 -right-70 w-[520px] h-80 border-6 border-primary-1 rounded-full opacity-90"></div>

        <h1 className="text-white text-5xl font-poppins font-semibold text-center mt-32 z-10">
          ¡Bienvenido/a de vuelta a nuestra comunidad!
        </h1>

        <div className="flex justify-center items-center w-full h-full z-10">
          <CircularGallery
            bend={3}
            scrollEase={0.03}
            items={imagenes}
            textColor="white"
          />
        </div>
      </div>

      <LoginForm />
    </section>
  );
};

export default Login;
