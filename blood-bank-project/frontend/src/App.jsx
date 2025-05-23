import React, { useContext, useEffect } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import { Context } from "./main";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Log_reg from "./pages/Reg_log";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DonorLogin from "./pages/donor/Login";
import DonorRegister from "./pages/donor/Register";
import RequesterLogin from "./pages/requester/Login";
import RequesterRegister from "./pages/requester/Register";
import HospitalLogin from "./pages/hospital/Login";
import HospitalRegister from "./pages/hospital/Register";
import OrgLogin from "./pages/organization/Login";
import OrgRegister from "./pages/organization/Register";
import Dashboard from "./pages/requester/Dashboard";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reg_log" element={<Log_reg />} />
          <Route path="/" element={<Home />} />

          <Route path="/donor/login" element={<DonorLogin />} />
          <Route path="/donor/register" element={<DonorRegister />} />

          <Route path="/requester/login" element={<RequesterLogin />} />
          <Route path="/requester/register" element={<RequesterRegister />} />
          <Route path="/requester/dashboard" element={<Dashboard />} />

          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/register" element={<HospitalRegister />} />

          <Route path="/organization/login" element={<OrgLogin />} />
          <Route path="/organization/register" element={<OrgRegister />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </>
  );
};

export default App;
