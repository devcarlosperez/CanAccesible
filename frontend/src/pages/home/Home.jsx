import Background from "../../components/Background";
import Header from "../../components/header/Header";
import Hero from "../../components/Hero";

const Home = () => {
  let heroData = { text1: "Por unas islas", text2: "accesibles para todos" };

  return (
    <>
      <Background />
      <Header />
      <Hero heroData={heroData} />
    </>
  );
};

export default Home;
