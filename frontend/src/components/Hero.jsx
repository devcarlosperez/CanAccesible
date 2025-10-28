import BlurText from "./motion/BlurText";

const Hero = ({ heroData }) => {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="flex flex-col justify-center min-h-180 text-left text-white px-8 md:px-24">
      <div className="max-w-4xl">
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
    </div>
  );
};

export default Hero;
