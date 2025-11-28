import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import useAuthStore from "../../services/authService";
import { getUserById, updateUser } from "../../services/userService";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const { user: authUser } = useAuthStore();
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(authUser.id);
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || authUser.email,
          nameFile: data.nameFile,
          dateRegister: authUser.dateRegister || new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser, navigate]);

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

      await updateUser(authUser.id, formData);

      toast.success("Perfil actualizado correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el perfil"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header transparent={false} />
        <div className="grow flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header transparent={false} />

      <main className="grow pt-33 pb-12 px-4 sm:px-6 lg:px-8">
        <ProfileForm
          userData={userData}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          updating={updating}
          onCancel={() => navigate(-1)}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
