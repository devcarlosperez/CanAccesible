import CircularGallery from "../../../components/react-bits/CircullarGallery";
import LoginForm from "./LoginForm";
import bgHero from "../../../assets/background-hero.jpg";

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
      <div className="hidden lg:flex bg-primary-2 w-2/3 flex-col items-start justify-start">
        <h1 className="text-white text-5xl font-poppins font-semibold text-center mt-32">
          ¡Bienvenido/a de vuelta a nuestra comunidad!
        </h1>
        <div className="flex justify-center items-center w-full h-full">
          <CircularGallery bend={3} scrollEase={0.03} items={imagenes} />
        </div>
      </div>
      <LoginForm />
    </section>
  );
};

export default Login;
