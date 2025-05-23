import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RequesterRegister = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //   const [dob, setDob] = useState("");
  const [nic, setNic] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/patient/register",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          //   dob,
          gender,
          password,
          role: "Patient",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container form-component register-form">
      <h2>Donor Registration Form</h2>
      <p>Please Sign Up To Continue</p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae
        cumque praesentium quos deleniti, officiis expedita.
      </p>
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="First Name ( මුල් නම )"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name ( අවසන් නම )"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="NIC ( ජාතික හැඳුනුම් අංකය )"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">District ( දිස්ත්‍රික්කය )</option>
            <option value="Male">Anuradhapura</option>
            <option value="Female">Polonnaruwa</option>
          </select>
        </div>
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Blood Group ( රුධිර කාණ්ඩය )</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="NA">Do not know</option>
          </select>
          <input
            type="text"
            placeholder="Email ( විද්‍යුත් තෑපෑල )"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address ( ලිපිනය )"
          />
        </div>
        <div>
          {" "}
          <input
            type="number"
            placeholder="Phone Number ( දුරකතන අංකය )"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Gender ( ස්ත්‍රී පුරුෂ භාවය )</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password ( මුරපදය )"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password ( තහවුරු කරන්න )"
          />
        </div>
        <div
          style={{
            gap: "10px",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>
            (Optional) Check the box below if you agree to reveal your Email to
            the Blood Requesters who uses the system.?
          </p>
          <input
            type="checkbox"
            // checked={hasVisited}
            // onChange={(e) => setHasVisited(e.target.checked)}
            style={{ flex: "none", width: "25px" }}
          />
        </div>
        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>Already Registered?</p>
          <Link
            to={"/donor/login"}
            style={{ textDecoration: "none", alignItems: "center" }}
          >
            Log In
          </Link>
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit" className="btn-delete">
            Sign Up
          </button>
          <button type="reset">Clear Form</button>
        </div>
      </form>
    </div>
  );
};

export default RequesterRegister;
