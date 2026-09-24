import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminCounsellors from "./pages/admin/AdminCounsellors";

import CounsellorDashboard from "./pages/counsellor/CounsellorDashboard";
import LeadDetails from "./pages/counsellor/LeadDetails";

import LeadDashboard from "./pages/lead/LeadDashboard";


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* ========================= */}
          {/* PUBLIC ROUTES */}
          {/* ========================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ========================= */}
          {/* ADMIN ROUTES */}
          {/* ========================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminLeads />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/counsellors"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminCounsellors />
              </ProtectedRoute>
            }
          />


          {/* ========================= */}
          {/* COUNSELLOR ROUTES */}
          {/* ========================= */}

          <Route
            path="/counsellor/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["COUNSELLOR"]}
              >
                <CounsellorDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/counsellor/leads/:id"
            element={
              <ProtectedRoute
                allowedRoles={["COUNSELLOR"]}
              >
                <LeadDetails />
              </ProtectedRoute>
            }
          />


          {/* ========================= */}
          {/* LEAD / STUDENT ROUTES */}
          {/* ========================= */}

          <Route
            path="/lead/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["LEAD"]}
              >
                <LeadDashboard />
              </ProtectedRoute>
            }
          />


          {/* ========================= */}
          {/* UNKNOWN URL */}
          {/* ========================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;