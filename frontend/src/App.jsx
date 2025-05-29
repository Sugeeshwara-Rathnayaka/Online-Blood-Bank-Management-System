import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Public components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./components/RoleSelection";
import CashDonate from "./pages/CashDonation";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import AddBloodBankPage from "./components/superadmin/AddNewBBH";

// Lazy-loaded components
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const BloodBankAdminDashboard = lazy(() => import("./pages/BBAdminDashboard"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard"));
const HospitalDashboard = lazy(() => import("./pages/HospitalDashboard"));
const OrganizationDashboard = lazy(() =>
  import("./pages/OrganizationDashboard")
);
const RequesterDashboard = lazy(() => import("./pages/RequesterDashboard"));

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/role-selection/login" element={<RoleSelection />} />
      <Route path="/donateUs" element={<CashDonate />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/add-blood-bank" element={<AddBloodBankPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute />
          </Suspense>
        }
      >
        {/* SuperAdmin has separate layout */}
        <Route
          path="/SuperAdmin-dashboard"
          element={
            <ProtectedRoute role="SuperAdmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Other dashboards share DashboardLayout */}
        <Route
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route
            path="/BloodBankAdmin-dashboard"
            element={
              <ProtectedRoute role="BloodBankAdmin">
                <BloodBankAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Donor-dashboard"
            element={
              <ProtectedRoute role="Donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Hospital-dashboard"
            element={
              <ProtectedRoute role="Hospital">
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Organization-dashboard"
            element={
              <ProtectedRoute role="Organization">
                <OrganizationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Requester-dashboard"
            element={
              <ProtectedRoute role="Requester">
                <RequesterDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
