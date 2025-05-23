import React from "react";
import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import { MdEmail, MdContactEmergency } from "react-icons/md";
import { BsFacebook, BsYoutube, BsInstagram, BsTwitter } from "react-icons/bs";

const Footer = () => {
  //   return (
  //     <>
  //       <footer className="container">
  //         <hr />
  //         <div className="content">
  //           <div>
  //             <img src="/logo.png" alt="logo" className="logo-img" />
  //           </div>
  //           <div></div>
  //           <div>
  //             <h4>Quick Links</h4>
  //             <ul>
  //               <Link to={"/"}>Home</Link>
  //               <Link to={"/appointment"}>Appointment</Link>
  //               <Link to={"/about"}>About</Link>
  //             </ul>
  //           </div>
  //           <div>
  //             <h4>Contact</h4>
  //             <div>
  //               <FaPhone />
  //               <span>+94 999-999-999</span>
  //             </div>
  //             <div>
  //               <MdEmail />
  //               <span>bloodlink@gmail.com</span>
  //             </div>
  //             <div>
  //               <MdContactEmergency />
  //               <span>
  //                 <strong>24/7 Emergency: 1122</strong>
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //         <hr />
  //         <div className="content">
  //           <small>
  //             &copy; {new Date().getFullYear()} BloodLink | Powered by Yuthukama
  //             Organization
  //           </small>
  //           <div>
  //             <BsFacebook href="#" />

  //             <BsInstagram href="#" />

  //             <BsTwitter href="#" />

  //             <BsYoutube href="#" />
  //           </div>
  //         </div>
  //       </footer>
  //     </>
  //   );
  // };

  return (
    <footer>
      <div className="copyright">
        &copy; {new Date().getFullYear()} BloodLink | Powered by Yuthukama
        Organization
      </div>

      <div className="social ">
        <div className="icon">
          <BsFacebook className="fa" href="#" aria-hidden="true" />

          <BsInstagram className="fa" href="#" aria-hidden="true" />

          <BsTwitter className="fa" href="#" aria-hidden="true" />

          <BsYoutube className="fa" href="#" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
