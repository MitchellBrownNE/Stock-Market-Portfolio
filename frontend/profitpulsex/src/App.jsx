import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from './component/Navbar';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function AppContent() {
  const location = useLocation();

const hideNavbarRoutes = ["/login", "/register", "/", "/forgot-password", "/reset-password"];

const showNavbar = !hideNavbarRoutes.includes(location.pathname);



  return (
    <> 
    {showNavbar && <Navbar />}  {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add Forgot Password Route */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />  {/* Render AppContent, which controls the Navbar and Routes */}
    </Router>
  );
}


export default App;
