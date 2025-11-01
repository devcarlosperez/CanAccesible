import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Incident from "./pages/incidents/Incident";
import Register from "./pages/users/register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/incidents" element={<Incident />} />
        <Route path="/register" element={<Register />} />
        <Route />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
