import CircularGallery from "../../../components/react-bits/CircullarGallery";
import LoginForm from "./LoginForm";

const imagenes = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    text: "Montaña nevada",
  },
  {
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    text: "Bosque al amanecer",
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    text: "Ciudad moderna",
  },
  {
    image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    text: "Café con arte",
  },
  {
    image: "https://picsum.photos/800/600?random=1",
    text: "Foto aleatoria 1",
  },
  {
    image: "https://picsum.photos/800/600?random=2",
    text: "Foto aleatoria 2",
  },
  {
    image: "https://picsum.photos/800/600?random=3",
    text: "Foto aleatoria 3",
  },
  {
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    text: "Desierto al atardecer",
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    text: "Perro feliz",
  },
];

const Login = () => {
  return (
    <section className="flex h-screen">
      <div className="bg-primary-2 w-2/3 flex flex-col items-start justify-start">
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
