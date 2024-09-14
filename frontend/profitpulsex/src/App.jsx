import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StarterPage from "./pages/startingPage";
import RegisterPage from "./pages/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
