import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from './component/Navbar';
import ForgotPassword from "./pages/ForgotPassword";
import AuthAction from "./pages/AuthAction";  // Correct import with the same case
import EmailVerification from './pages/EmailVerification'; // Import the EmailVerification component
import ProtectedRoute from './component/ProtectedRoute'; // Import the ProtectedRoute component

function AppContent() {
  const location = useLocation();
  
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/",
    "/forgot-password",
    "/AuthAction", // Fix: added comma
    "/verify-email" // Fix: added correct path
  ];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/AuthAction" element={<AuthAction />} /> 
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protect the dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
