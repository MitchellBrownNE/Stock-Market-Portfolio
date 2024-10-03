import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from './component/Navbar';
import ForgotPassword from "./pages/ForgotPassword";
import AuthAction from "./pages/AuthAction";  // Correct import with the same case

function AppContent() {
  const location = useLocation();
  
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/",
    "/forgot-password",
    "/AuthAction"  // Match the route path to the capitalized one
  ];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/AuthAction" element={<AuthAction />} /> {/* Centralized Auth Action Route with capitalized path */}
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
