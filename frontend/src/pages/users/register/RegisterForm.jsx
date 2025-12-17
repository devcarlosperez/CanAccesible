import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../../services/authService.js";
import logo from "../../../assets/canaccesible-logo-2.webp";
import { createUser } from "../../../services/userService.js";
import { subscribeToPushNotifications } from "../../../services/pushNotificationService.js";
import AvatarSelector from "../../../components/utils/AvatarSelector";

const RegisterForm = () => {
  const { t } = useTranslation();
  const { login, loading, error: authError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rol: "",
    avatar: null,
  });
  const [enablePush, setEnablePush] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewUser({ ...newUser, avatar: e.target.files[0] });
  };

  const handleAvatarSelect = (file) => {
    setNewUser({ ...newUser, avatar: file });
    setShowAvatarSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("roleId", newUser.rol);

      if (newUser.avatar) {
        formData.append("image", newUser.avatar);
      }

      await createUser(formData);
      await login(newUser.email, newUser.password);

      if (enablePush) {
        await subscribeToPushNotifications();
      }

      navigate("/home");
    } catch (err) {
      setError(t("register_error"));
    }
  };

  return (
    <div className="bg-white w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 h-screen lg:h-auto">
      <Link to="/">
        <img
          src={logo}
          alt="canaccesible-logo"
          className="h-20 sm:h-22 w-auto"
        />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md font-roboto mt-10"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder={t("register_name_placeholder")}
            value={newUser.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder={t("register_lastname_placeholder")}
            value={newUser.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder={t("register_email_placeholder")}
          value={newUser.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2 mt-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t("register_password_placeholder")}
          value={newUser.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2 mt-4"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              {t("register_profile_pic_label")}
            </label>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(true)}
                  className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <i className="fa-solid fa-image"></i>
                  {t("choose_avatar") || "Elegir foto de perfil"}
                </button>
              </div>

              {newUser.avatar && (
                <div className="relative w-24 h-24 mx-auto mt-2">
                  <img
                    src={URL.createObjectURL(newUser.avatar)}
                    alt="preview"
                    className="w-full h-full object-cover rounded-full border-2 border-blue-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, avatar: null })}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              {t("register_account_type_label")}
            </label>
            <select
              value={newUser.rol}
              onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
              required
            >
              <option value="">{t("register_select_type")}</option>
              <option value="1">{t("register_type_user")}</option>
              <option value="3">{t("register_type_municipality")}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input
            id="push-notifications"
            type="checkbox"
            checked={enablePush}
            onChange={(e) => setEnablePush(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="push-notifications"
            className="ml-2 block text-sm text-gray-900"
          >
            {t("register_enable_push")}
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition font-semibold"
        >
          {loading ? t("register_loading") : t("register_button")}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t("register_already_account")}{" "}
          <a
            href="/login"
            className="text-primary-2 font-medium hover:underline"
          >
            {t("register_login_link")}
          </a>
        </p>
      </form>

      {showAvatarSelector && (
        <AvatarSelector
          onSelect={handleAvatarSelect}
          onCancel={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
};

export default RegisterForm;
