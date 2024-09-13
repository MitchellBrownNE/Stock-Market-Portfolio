import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StarterPage from "./pages/startingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StarterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
