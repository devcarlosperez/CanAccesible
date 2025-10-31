import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Incidence from "./pages/incidences/Incidence";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/incidences" element={<Incidence />}/>
        <Route />
        <Route />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
