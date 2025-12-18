import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Login from "./pages/Login";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Approval from "./pages/Approval";
import Approverate from "./pages/Approverate";
import Payment from "./pages/Payment";
import Settings from "./pages/Settings";

// Indent (In-House) Related
import Indent from "./pages/Indent";
import Techassigned from "./pages/Techassigned";
import Worktracking from "./pages/Worktracking";
import Inspection from "./pages/Inspection";

// OutHouse Related
import Selectvendor from "./pages/Selectvendor";
import Getoffer from "./pages/Getoffer";
import Inspectionouthouse from "./pages/Inspectionouthouse";

// Shared Pages
import Sentmachine from "./pages/Sentmachine";
import Storein from "./pages/Storein";
import Calendar from "./pages/Calendar";
import Dailyreport from "./pages/Dailyreport";

import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

const RoleBasedRedirect = () => {
  const { user } = useAuthStore();
  
  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/sentmachine" replace />;
  }
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleBasedRedirect />} />

          {/* Admin Only Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Indent Management - Admin Only */}
          <Route
            path="indent"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Indent />
              </ProtectedRoute>
            }
          />
          <Route
            path="indent/tech-assigned"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Techassigned />
              </ProtectedRoute>
            }
          />
          <Route
            path="indent/work-tracking"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Worktracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="indent/inspection"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Inspection />
              </ProtectedRoute>
            }
          />

          {/* Approval Workflow - Admin Only */}
          <Route
            path="approval"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Approval />
              </ProtectedRoute>
            }
          />

          {/* OutHouse Management - Admin Only */}
          <Route
            path="select-vendor"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Selectvendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="get-offer"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Getoffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="inspection-outhouse"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Inspectionouthouse />
              </ProtectedRoute>
            }
          />

          {/* Rate Approval - Admin Only */}
          <Route
            path="approverate"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Approverate />
              </ProtectedRoute>
            }
          />

          {/* Payment - Admin Only */}
          <Route
            path="payment"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* Settings - Admin Only */}
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes - Admin and User */}
          <Route path="sentmachine" element={<Sentmachine />} />
          <Route path="storein" element={<Storein />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="dailyreport" element={<Dailyreport />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;