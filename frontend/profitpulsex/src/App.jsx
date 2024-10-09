import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Navbar from './component/Navbar';
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";

function App() {
  return (
    <Router> 
      <Navbar  />
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
