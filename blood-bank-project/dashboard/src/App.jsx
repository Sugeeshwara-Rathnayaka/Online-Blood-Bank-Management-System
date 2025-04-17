import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import Sidebar from "./components/Sidebar";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, setSuperAdmin } =
    useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/superAdmin/me",
          { withCredentials: true }
        );
        //console.log("response.data:", response.data);
        setIsAuthenticated(true);
        setUser(response.data.user);
        setSuperAdmin(response.data.superAdmin);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
        setSuperAdmin({});
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </>
  );
};

export default App;
