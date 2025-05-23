import React from "react";
import Hero from "../components/Hero";
// import Biography from "../components/Biography";
// import MessegeForm from "../components/MessageForm";
// import Departments from "../components/Departments";

const Home = () => {
  return (
    <>
      <Hero
        title={"Welcome to BloodLink !  Donate Blood & Save Lives"}
        imageUrl={"/hero.png"}
      />
      {/* <Biography imageUrl={"/about.png"} /> */}
      {/* <Departments /> */}
      {/* <MessegeForm /> */}
    </>
  );
};

export default Home;
