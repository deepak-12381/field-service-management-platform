 import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
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
      <Route path="/" element={<Login />} />

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