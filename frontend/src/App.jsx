import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Incident from "./pages/incidents/Incident";
import Map from "./pages/map/Map";
import Register from "./pages/users/register/Register";
import Login from "./pages/users/login/Login";
import Contact from "./pages/contact/Contact";
import Blog from "./pages/blog/Blog";
import PublicRoute from "./routes/PublicRoute";
import ErrorPage from "./pages/others/ErrorPage";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy.jsx";
import ScrollToTopRoutes from "./components/utils/ScrollToTopRoutes.jsx";
import TermsConditions from "./pages/terms-conditions/TermsConditions.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopRoutes/>
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/incidents" element={<Incident />} />
        <Route path="/map" element={<Map />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
