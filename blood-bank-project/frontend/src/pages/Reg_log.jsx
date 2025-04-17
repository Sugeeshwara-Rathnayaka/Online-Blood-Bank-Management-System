import React from "react";
import { FaTint, FaSearchPlus, FaStethoscope, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Reg_log = () => {
  return (
    <div className="logreg container ">
      <div className="linkbox">
        <h2 className="center">Already have an account? LogIn!</h2>
        <div className="tile-container">
          <Link to={"/donor/login"}>
            <div className="tile">
              <p className="title">
                <FaTint className="fa" />
                Blood Donors
              </p>
            </div>
          </Link>
          <a href="login/requester">
            <div className="tile">
              <p className="title">
                <FaSearchPlus className="fa" />
                Blood Requesters
              </p>
            </div>
          </a>
          <a href="login/hospital">
            <div className="tile">
              <p className="title">
                <FaStethoscope className="fa" />
                Normal Hospitals
              </p>
            </div>
          </a>
          <a href="login/organization">
            <div className="tile">
              <p className="title">
                <FaUsers className="fa" />
                Organizations
              </p>
            </div>
          </a>
          {/* <a href="login/admin">
            <div className="tile">
              <p className="title">
                <i className="fa fa-user-plus"></i>Admins
              </p>
            </div>
          </a> */}
        </div>
      </div>

      <div className="linkbox">
        <h2 className="center" style={{ paddingTop: 10 }}>
          New here? Sign Up!
        </h2>
        <div className="tile-container">
          <a href="donor/register">
            <div className="tile tooltip ">
              <p className="title">
                <FaTint className="fa" />
                Blood Donors
              </p>
              {/* <span className="tooltiptext clearfix">
                I want to donate blood for helping people to serve their lives
              </span> */}
            </div>
          </a>
          <a href="requester/signup">
            <div className="tile tooltip">
              <p className="title">
                <FaSearchPlus className="fa" />
                Blood Requesters
              </p>
              {/* <span className="tooltiptext clearfix">
                If you already logged as a donor, you don't need to register as
                a requester.
              </span> */}
            </div>
          </a>
          <a href="hospital/signup">
            <div className="tile tooltip">
              <p className="title">
                <FaStethoscope className="fa" />
                Normal Hospitals
              </p>
              {/* <span className="tooltiptext clearfix">
                If you are a hospital which doesn't have a blood bank, you can
                register as a hospital and request blood.
              </span> */}
            </div>
          </a>
          <a href="organization/signup">
            <div className="tile tooltip">
              <p className="title">
                <FaUsers className="fa" />
                Organizations
              </p>
              {/* <span className="tooltiptext clearfix">
                If you are an organization and hope to organize a campaign, you
                can register as an organization.
              </span> */}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reg_log;
