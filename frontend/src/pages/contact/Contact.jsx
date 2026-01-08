import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [lastErrorToastId, setLastErrorToastId] = useState(null);
  const positionIesElRincon = [28.127549871601353, -15.446679030776401];

  const showErrorToast = (message) => {
    if (lastErrorToastId) {
      const isActive = toast.isActive(lastErrorToastId);
      if (isActive) return;
    }

    const isMobile = window.innerWidth < 768;
    const position = isMobile ? "bottom-center" : "bottom-right";

    const toastId = toast.error(message, {
      autoClose: 5000,
      position: position,
      hideProgressBar: false,
      closeButton: true,
      style: isMobile ? { fontSize: "14px", padding: "16px" } : {},
    });
    setLastErrorToastId(toastId);
  };

  const contactLiveChats = [
    {
      title: t("contact_account_support"),
      description: t("contact_account_support_desc"),
      icon: "fa-user",
      iconType: "fa-solid",
      apiType: "soporte de cuenta",
    },
    {
      title: t("contact_report_incident"),
      description: t("contact_report_incident_desc"),
      icon: "fa-triangle-exclamation",
      iconType: "fa-solid",
      apiType: "reportar una incidencia",
    },
    {
      title: t("contact_accessibility_resources"),
      description: t("contact_accessibility_resources_desc"),
      icon: "fa-wheelchair-move",
      iconType: "fa-solid",
      apiType: "recursos de accesibilidad",
    },
    {
      title: t("contact_general_inquiry"),
      description: t("contact_general_inquiry_desc"),
      icon: "fa-lightbulb",
      iconType: "fa-solid",
      apiType: "consulta general",
    },
  ];

  const handleStartChat = async (apiType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showErrorToast(t("contact_login_required"));
      return;
    }
    const type = apiType;

    try {
      // First, check if a conversation of this type already exists for the user
      const conversationsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/conversations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const existingConversation = conversationsResponse.data.find(
        (conv) => conv.type === type
      );

      if (existingConversation) {
        // If exists, redirect to it
        navigate(`/conversations/${existingConversation.id}`);
      } else {
        // If not, create new one
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/conversations`,
          { type },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        navigate(`/conversations/${response.data.id}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast(t("contact_login_required"));
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>CanAccesible - {t("contact_title")}</title>
        <meta name="description" content={t("contact_subtitle")} />
        <link rel="canonical" href="https://canaccesible.es/contact" />
      </Helmet>
      <Header transparent={false} />

      {/* Main Content */}
      <main className="min-h-screen py-12 mt-15 md:mt-20 lg:mt-25 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h1
              className="text-3xl md:text-4xl font-poppins font-bold mb-4"
              style={{ color: "var(--color-neutral-2)" }}
            >
              {t("contact_title")}
            </h1>
            <p
              className="text-base font-roboto"
              style={{ color: "var(--color-neutral-3)" }}
            >
              {t("contact_subtitle")}
            </p>
          </motion.div>

          {/* Contact Options Flex */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-y-6 gap-x-6 mb-6 md:mb-8 mx-4 md:mx-8 lg:mx-4 justify-center lg:justify-center"
          >
            {contactLiveChats.map((option, index) => (
              <div
                key={index}
                className="rounded-xl shadow-md transition-all duration-300 p-6 md:p-8 flex flex-col items-center text-center border w-full max-w-xs sm:max-w-sm md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)]"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "var(--color-accent-1)",
                }}
              >
                {/* Icon */}
                <div
                  className="text-5xl mb-6"
                  style={{ color: "var(--color-primary-2)" }}
                >
                  <i className={`${option.iconType} ${option.icon}`}></i>
                </div>

                {/* Title */}
                <h2
                  className="text-xl font-poppins font-semibold mb-2"
                  style={{ color: "var(--color-neutral-2)" }}
                >
                  {option.title}
                </h2>

                {/* Description */}
                <p
                  className="text-sm font-roboto hidden md:block"
                  style={{ color: "var(--color-neutral-3)" }}
                >
                  {option.description}
                </p>

                {/* Button */}
                <button
                  onClick={() => handleStartChat(option.apiType)}
                  className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition font-semibold cursor-pointer mt-4"
                >
                  {t("contact_start_chat")}
                </button>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mt-16"
        >
          <h2
            className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center px-4 md:px-0"
            style={{ color: "var(--color-neutral-2)" }}
          >
            {t("contact_info_title")}
          </h2>

          <div className="flex flex-col lg:flex-row gap-y-8 gap-x-8 items-stretch px-4 md:px-8 lg:px-0">
            {/* Information Card */}
            <div
              className="rounded-xl shadow-md p-6 md:p-8 border w-full max-w-sm md:max-w-none mx-auto lg:mx-0"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--color-accent-1)",
              }}
            >
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <p
                    className="font-poppins font-semibold mb-2"
                    style={{ color: "var(--color-neutral-2)" }}
                  >
                    {t("contact_email")}
                  </p>
                  <p
                    className="font-roboto text-base border-b-2"
                    style={{
                      color: "var(--color-neutral-3)",
                      borderColor: "var(--color-primary-1)",
                    }}
                  >
                    canaccesible@gmail.com
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p
                    className="font-poppins font-semibold mb-2"
                    style={{ color: "var(--color-neutral-2)" }}
                  >
                    {t("contact_phone")}
                  </p>
                  <p
                    className="font-roboto text-base border-b-2"
                    style={{
                      color: "var(--color-neutral-3)",
                      borderColor: "var(--color-primary-1)",
                    }}
                  >
                    928 30 43 67
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p
                    className="font-poppins font-semibold mb-2"
                    style={{ color: "var(--color-neutral-2)" }}
                  >
                    {t("contact_location")}
                  </p>
                  <p
                    className="font-roboto text-base border-b-2 mb-4"
                    style={{
                      color: "var(--color-neutral-3)",
                      borderColor: "var(--color-primary-1)",
                    }}
                  >
                    35011, Las Palmas GC, IES EL RINCÓN
                  </p>
                </div>

                {/* Accessibility Support */}
                <div>
                  <p
                    className="font-poppins font-semibold mb-2"
                    style={{ color: "var(--color-neutral-2)" }}
                  >
                    {t("contact_accessibility_support")}
                  </p>
                  <p
                    className="font-roboto text-base"
                    style={{ color: "var(--color-neutral-3)" }}
                  >
                    {t("contact_accessibility_support_desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Image for Desktop/Tablet */}
            <div className="hidden md:block w-full rounded-xl overflow-hidden shadow-lg md:h-96 lg:h-96 z-0">
              <MapContainer
                center={positionIesElRincon}
                zoom={18}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={positionIesElRincon}>
                  <Popup>
                    <div className="text-sm font-poppins">
                      <p className="font-semibold">IES EL RINCÓN</p>
                      <p>35011, Las Palmas GC</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Location Button for Mobile */}
          <div className="md:hidden flex justify-center pt-6">
            <a
              href="https://www.google.com/maps/place/IES+El+Rinc%C3%B3n/@28.1274127,-15.4493183,17z/data=!3m1!4b1!4m6!3m5!1s0xc40951c8a18a0f3:0x142cb0d09763a325!8m2!3d28.1274127!4d-15.4467434!16s%2Fg%2F11b6d2ckv0?entry=ttu&g_ep=EgoyMDI1MTEwNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-poppins font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--color-info)",
                color: "#ffffff",
              }}
            >
              {t("contact_view_map")}
              <i className="fa-solid fa-location-dot ml-3"></i>
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
