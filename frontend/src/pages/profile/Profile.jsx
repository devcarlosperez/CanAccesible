import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import useAuthStore from "../../services/authService";
import { getUserById, updateUser } from "../../services/userService";
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "../../services/pushNotificationService";
import ProfileForm from "./ProfileForm";
import ChangePassword from "./ChangePassword";
import { motion } from "motion/react";

const Profile = () => {
  const { t } = useTranslation();
  const { user: authUser, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nameFile: "",
    dateRegister: "",
  });
  const [originalUserData, setOriginalUserData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(authUser.id);

        // Update global store with fresh data from DB to ensure header is correct on refresh
        setUser(data);

        const initialData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || authUser.email,
          nameFile: data.nameFile,
          dateRegister: authUser.dateRegister || new Date().toISOString(),
        };
        setUserData(initialData);
        setOriginalUserData(initialData);

        // Check push notification status
        if ("serviceWorker" in navigator && "PushManager" in window) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setPushEnabled(!!subscription);
        }
      } catch (error) {
        toast.error(t("profile_load_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser?.id, navigate, setUser]);

  const handlePushToggle = async () => {
    try {
      if (pushEnabled) {
        await unsubscribeFromPushNotifications();
        setPushEnabled(false);
        toast.info(t("profile_push_disabled"));
      } else {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          setPushEnabled(true);
          toast.success(t("profile_push_enabled"));
        } else {
          toast.error(t("profile_push_enable_error"));
        }
      }
    } catch (error) {
      toast.error(t("profile_push_toggle_error"));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setImageFile(null);
    setImagePreview(null);
  };

  const isDirty =
    originalUserData &&
    (userData.firstName !== originalUserData.firstName ||
      userData.lastName !== originalUserData.lastName ||
      userData.email !== originalUserData.email ||
      imageFile !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("email", userData.email);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const updatedUser = await updateUser(authUser.id, formData);

      setUser(updatedUser);

      setOriginalUserData({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        nameFile: updatedUser.nameFile,
        dateRegister: userData.dateRegister,
      });

      setUserData((prev) => ({
        ...prev,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        nameFile: updatedUser.nameFile,
      }));

      setImageFile(null);
      setImagePreview(null);

      toast.success(t("profile_update_success"));
    } catch (error) {
      toast.error(error.response?.data?.message || t("profile_update_error"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header transparent={false} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grow flex items-center justify-center bg-gray-100"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header transparent={false} />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grow pt-32 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <ProfileForm
          userData={userData}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          updating={updating}
          onCancel={handleCancel}
          isDirty={isDirty}
          pushEnabled={pushEnabled}
          handlePushToggle={handlePushToggle}
        />
        <ChangePassword />
      </motion.main>

      <Footer />
    </div>
  );
};

export default Profile;
