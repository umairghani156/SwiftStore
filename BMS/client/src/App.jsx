import "./App.css";
import Login from "./pages/Login";
import "flowbite";
import { Route, Routes } from "react-router-dom";
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ServiceRequestProvider } from "./context/ServiceRequestContext";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Layout from "./Layouts/AdminLayout";
import TenantLayout from "./Layouts/TenantLayout";
import ManagerLayout from "./Layouts/ManagerLayout";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import EmergencyAlerts from "./pages/Admin/EmergencyAlerts";
import Analytics from "./pages/Admin/Analytics";
import Settings from "./pages/Admin/Settings";
import AddUsers from "./pages/Admin/AddUsers";
import AllUsers from "./pages/Admin/AllUsers";

import HomePage from "./pages/tenants/HomePage";
import Appointment from "./pages/tenants/Appointment";
import Reports from "./pages/tenants/Reports";
import Monitoring from "./pages/tenants/Monitoring";

import SecurityDashboard from "./pages/Security/SecurityDashboard";
import IssueManagementSecurity from "./pages/Security/IssueManagementSecurity";
import Logbook from "./pages/Security/Logbook";
import ReportsSecurity from "./pages/Security/ReportsSecurity";
import SecurityAlerts from "./pages/Security/SecurityAlerts";
import VisitorVerification from "./pages/Security/VisitorVerification";
import QRCodeGenerator from "./pages/Security/QRCodeGenerator";
import VisitorManagementSecurity from "./pages/Security/VisitorManagementSecurity";

import Appointments from "./pages/Managers/Appointments";
import ManagerDashboard from "./pages/Managers/ManagerDashboard";
import Statistics from "./pages/Managers/Statistics";
import OfficeReports from "./pages/Managers/OfficeReports";
import Notifications from "./pages/Managers/Notifications";
import ProtectedRoute from "./components/privateRoutes/ProtectedRoutes";
import AllVisitors from "./pages/AdminPage/AllVisitors";
import AddVisitor from "./pages/AdminPage/AddVisitor";
import VisitorManagement from "./components/Admin/VisitorManagement";
import IssueManagementPage from "./components/Admin/IssueManagement";
import SecurityReports from "./pages/Security/ReportsSecurity";
import LogbookHistory from "./pages/Security/Logbook";
import Dashboard from "./pages/Admin/Dashboard";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorLog from "./pages/Security/VisitorLog";
import ProfilePage from "./pages/Admin/ProfilePage";
import PageNotFound from "./pages/PageNotFound";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ServiceRequestProvider>
            <Routes>
              {/* tenants */}
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
              <Route element={<TenantLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/monitoring" element={<Monitoring />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route
                  path="/admin-panel"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Office Manager"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                path="/admin-panel/profile"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }/>
                <Route
                  path="/admin-panel/visitor-management"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <VisitorManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/add-visitor"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AddVisitor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/all-visitors"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AllVisitors />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/issue-management"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <IssueManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin-panel/add-users" element={<AddUsers />} />
                <Route path="/admin-panel/all-users" element={<AllUsers />} />
                <Route
                  path="/admin-panel/emergency-alerts"
                  element={<EmergencyAlerts />}
                />
                <Route
                  path="/admin-panel/add-users"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AddUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-panel/all-users"
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <AllUsers />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin-panel/settings" element={<Settings />} />
              </Route>
              {/* managers */}

              <Route element={<ManagerLayout />}>
                <Route
                  path="/manager-panel"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/issue-management"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <IssueManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/appointments"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <VisitorManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/office-reports"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <OfficeReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/notifications"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-panel/settings"
                  element={
                    <ProtectedRoute allowedRoles={["Office Manager"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* security */}
              <Route element={<SecurityLayout />}>
                <Route
                  path="/security-panel"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <SecurityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                path="/security-panel/profile"
                element={
                  <ProtectedRoute allowedRoles={['Security']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }/>
                <Route
                  path="/security-panel/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <SecurityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/issue-management"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <IssueManagementSecurity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/logbook"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <LogbookHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/reports"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <SecurityReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/security-alerts"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <SecurityAlerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/visitor-verification"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <VisitorVerification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/visitor-logs"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <VisitorLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/qr-generator"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <QRCodeGenerator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security-panel/visitor-management"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <VisitorManagementSecurity />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/security-panel/settings"
                  element={
                    <ProtectedRoute allowedRoles={["Security"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Handle unknown routes */}
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
          </ServiceRequestProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
