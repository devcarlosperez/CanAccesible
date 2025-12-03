import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Incident from "./pages/incidents/Incident";
import Map from "./pages/map/Map";
import Register from "./pages/users/register/Register";
import Login from "./pages/users/login/Login";
import Contact from "./pages/contact/Contact";
import Blog from "./pages/blog/Blog";
import BlogArticleDetail from "./pages/blog/BlogArticleDetail";
import PublicRoute from "./routes/PublicRoute";
import ErrorPage from "./pages/others/ErrorPage";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy.jsx";
import ScrollToTopRoutes from "./components/utils/ScrollToTopRoutes.jsx";
import TermsConditions from "./pages/terms-conditions/TermsConditions.jsx";
import Profile from "./pages/profile/Profile.jsx";
import DashboardUser from "./pages/dashboard/DashboardUser.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Conversation from "./pages/conversation/Conversation.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/incidents" element={<Incident />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard-user" element={<DashboardUser />} />
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
        <Route path="/blog/:id" element={<BlogArticleDetail />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/conversations/:conversationId" element={<Conversation/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
