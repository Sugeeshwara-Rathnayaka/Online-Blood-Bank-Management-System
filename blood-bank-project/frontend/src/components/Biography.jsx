import React from "react";

function Biography({ imageUrl }) {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="aboutImg" />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who we Are</h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus
          cum mollitia laudantium consequatur unde placeat. Perspiciatis nulla
          praesentium ut accusantium rerum nemo laboriosam minima, ipsum
          delectus quod. Laborum, vero quas quo optio doloremque, debitis
          consectetur quia expedita rem ex enim inventore, neque corporis
          numquam harum mollitia architecto iste iure unde!
        </p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <p>Lorem ipsum dolor sit amet.</p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis
          similique, nisi vitae magnam, numquam voluptatum ipsa non impedit
          velit sed quo delectus facere blanditiis quibusdam. Accusantium
          repellendus qui eveniet laborum dolorem tempore sit ad recusandae?
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae
          dolorum dolore fugit.
        </p>
        <p>Lorem, ipsum dolor.</p>
      </div>
    </div>
  );
}

export default Biography;
