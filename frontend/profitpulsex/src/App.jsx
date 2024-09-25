import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from './component/Navbar';

function AppContent() {
  const location = useLocation();

const hideNavbarRoutes = ["/login", "/register", "/"];

const showNavbar = !hideNavbarRoutes.includes(location.pathname);



  return (
    <> 
    {showNavbar && <Navbar />}  {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
