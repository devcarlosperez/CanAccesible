import image1 from "../assets/background-hero.jpg";

const Background = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <img
        src={image1}
        alt="Fondo Canarias Accesible"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#004AAD]/30 mix-blend-multiply"></div>
    </div>
  );
};

export default Background;
