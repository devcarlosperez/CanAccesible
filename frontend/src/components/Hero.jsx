const Hero = ({ heroData }) => {
  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-left text-white px-12 md:px-24">
      <p className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4">
        {heroData.text1}
      </p>
      <p className="text-4xl md:text-6xl font-bold drop-shadow-md mb-6">
        {heroData.text2}
      </p>
    </div>
  );
};

export default Hero;
