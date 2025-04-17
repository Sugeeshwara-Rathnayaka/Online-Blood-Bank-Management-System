import React from "react";

function Hero({ title, imageUrl }) {
  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p>
          <b>“Volunteer blood donation”</b> is a safe and simple procedure that
          involves a donor giving one of the following blood products: whole
          blood, red blood cells, plasma, or platelets. Overview Volunteers
          donate all blood products used for transfusions performed in the
          United States to help people who are ill or injured, or who need blood
          for other reasons.
        </p>

        <a href="https://www.nhlbi.nih.gov/health-topics/blood-donation">
          <button className="logoutBtn btn">Read More </button>
        </a>
      </div>
      <div className="banner">
        <img src={imageUrl} alt="hero" className="animated-image" />
        <span>
          <img src="/Vector.png" alt="vector" />
        </span>
      </div>
    </div>
  );
}

export default Hero;
