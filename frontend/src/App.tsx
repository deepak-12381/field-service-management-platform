 import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customer from "./pages/Customer/Customer";
import Site from "./pages/Site/Site";
import WorkOrder from "./pages/WorkOrder/WorkOrder";
import TechnicianPage from "./pages/Technician/Technician";
import Manager from "./pages/Manager/Manager";
import Profile from "./pages/Profile/Profile";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

import AppLayout from "./components/Layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public Route */}
       {/* Public Routes */}
<Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        
        <Route element={<AppLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/sites" element={<Site />} />
          <Route path="/work-orders" element={<WorkOrder />} />
          <Route path="/technicians" element={<TechnicianPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/managers" element={<Manager />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

      </Route>

    </Routes>
  );
}

export default App;