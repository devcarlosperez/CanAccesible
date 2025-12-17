import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AvatarSelector = ({ onSelect, onCancel }) => {
  const { t } = useTranslation();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const generateAvatars = () => {
    const newAvatars = [];
    const styles = ["avataaars", "bottts", "lorelei", "notionists", "micah"];

    for (let i = 0; i < 8; i++) {
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const randomSeed = Math.random().toString(36).substring(7);
      newAvatars.push(
        `https://api.dicebear.com/9.x/${randomStyle}/png?seed=${randomSeed}`
      );
    }
    setAvatars(newAvatars);
  };

  useEffect(() => {
    generateAvatars();
  }, []);

  const handleAvatarClick = async (url) => {
    setSelectedUrl(url);
    setLoading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "avatar.png", { type: "image/png" });
      onSelect(file, url);
    } catch (error) {
      console.error("Error converting avatar to file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSelect(file, URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {t("select_avatar") || "Elige un avatar"}
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {avatars.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAvatarClick(url)}
              className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all hover:scale-105 focus:outline-none ${
                selectedUrl === url
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <img
                src={url}
                alt={`Avatar ${index}`}
                className="w-full h-full object-cover"
              />
              {selectedUrl === url && loading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-blue-600"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mb-6 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500 mb-3 text-center font-medium">
            {t("or_upload_own") || "O sube tu propia foto"}
          </p>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-2xl mb-2"></i>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">
                  {t("click_to_upload") || "Haz clic para subir"}
                </span>
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={generateAvatars}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-rotate"></i>
            {t("refresh_avatars") || "Nuevos avatares"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {t("cancel") || "Cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
