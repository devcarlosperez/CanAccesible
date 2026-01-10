import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../services/api";
import logo from "../../../assets/canaccesible-logo-2.webp";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success(t("forgot_password_success"));
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "User not found") {
        toast.error(t("error_user_not_found"));
      } else {
        toast.error(t("error_generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-200 flex flex-col justify-center py-12 px-4">
        <div className="mx-auto w-full max-w-md font-roboto">
          <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
            <div className="mb-6 flex flex-col items-center">
              <Link to="/">
                <img className="h-max w-auto" src={logo} alt="CanAccesible" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("check_email_title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("check_email_description", { email })}
            </p>
            <Link
              to="/login"
              className="font-medium text-primary-2 hover:text-primary-1"
            >
              {t("back_to_login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md font-roboto">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="mb-6 flex flex-col items-center">
            <Link to="/">
              <img className="h-max w-auto" src={logo} alt="CanAccesible" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              {t("forgot_password_title")}
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("login_email_label")}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-2 focus:border-primary-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? t("login_loading") : t("send_reset_link")}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t("or_label")}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {t("back_to_login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
