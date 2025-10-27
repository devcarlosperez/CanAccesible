import BlurText from "./motion/BlurText";

const Hero = ({ heroData }) => {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-left text-white px-12 md:px-24">
      <BlurText
        text={heroData.text1}
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4"
      />
      <BlurText
        text={heroData.text2}
        delay={300}
        animateBy="words"
        direction="top"
        className="text-4xl md:text-6xl font-bold drop-shadow-md mb-6"
      />
    </div>
  );
};

export default Hero;
