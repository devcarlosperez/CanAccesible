import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../../services/authService.js";
import logo from "../../../assets/canaccesible-logo-2.webp";

const LoginForm = () => {
  const { t } = useTranslation();
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="
      bg-white 
      w-full lg:w-1/2 
      flex flex-col items-center justify-center 
      p-6 sm:p-8 lg:p-10
      h-screen lg:h-auto
    "
    >
      <Link to="/">
        <img
          src={logo}
          alt="canaccesible-logo"
          className="h-20 sm:h-22 w-auto"
        />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md font-roboto mt-11"
      >
        <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
          {t('login_email_label')}
        </label>
        <input
          type="email"
          placeholder={t('login_email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
          {t('login_password_label')}
        </label>
        <input
          type="password"
          placeholder={t('login_password_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-6 gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary-2" />
            {t('login_remember_me')}
          </label>
          <a href="#" className="text-primary-2 hover:underline">
            {t('login_forgot_password')}
          </a>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold cursor-pointer disabled:opacity-70"
        >
          {loading ? t('login_loading') : t('login_button')}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t('login_no_account')}{" "}
          <a
            href="/register"
            className="text-primary-2 font-medium hover:underline"
          >
            {t('login_register_link')}
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
