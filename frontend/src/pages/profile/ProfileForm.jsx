import { useTranslation } from "react-i18next";
import { useState } from "react";
import AvatarSelector from "../../components/utils/AvatarSelector";

const ProfileForm = ({
  userData,
  imagePreview,
  handleImageChange,
  handleSubmit,
  handleChange,
  updating,
  onCancel,
  isDirty,
  pushEnabled,
  handlePushToggle,
}) => {
  const { t } = useTranslation();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleAvatarSelect = (file) => {
    // Create a fake event object to reuse handleImageChange
    const fakeEvent = {
      target: {
        files: [file],
      },
    };
    handleImageChange(fakeEvent);
    setShowAvatarSelector(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-blue-900 px-6 py-8 text-center relative">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 mx-auto">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : userData.nameFile ? (
                <img
                  src={userData.nameFile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                  {userData.firstName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 right-0 transform translate-x-4">
              <button
                type="button"
                onClick={() => setShowAvatarSelector(true)}
                className="bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors w-11 h-11 flex items-center justify-center mr-4"
                title={t("profile_change_photo")}
              >
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-blue-100">{userData.email}</p>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("profile_firstname")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t("profile_firstname_placeholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("profile_lastname")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t("profile_lastname_placeholder")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("profile_email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={t("profile_email_placeholder")}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {t("profile_push_title")}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t("profile_push_desc")}
                </p>
                <a
                  href="/push-notifications-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                >
                  {t("profile_push_how_to")}
                </a>
              </div>
              <button
                type="button"
                onClick={handlePushToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pushEnabled ? "bg-blue-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={pushEnabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    pushEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                {t("profile_cancel")}
              </button>
              <button
                type="submit"
                disabled={updating || !isDirty}
                className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg cursor-pointer ${
                  updating || !isDirty ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    {t("profile_saving")}
                  </span>
                ) : (
                  t("profile_save")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showAvatarSelector && (
        <AvatarSelector
          onSelect={handleAvatarSelect}
          onCancel={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
};

export default ProfileForm;
