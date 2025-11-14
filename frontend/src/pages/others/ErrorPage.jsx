import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fa] px-6 text-center">
      {/* Icon */}
      <AlertTriangle className="w-20 h-20 text-primary-2 animate-bounce" />

      <h1 className="text-5xl font-extrabold mt-6 text-primary-2">
        Ha ocurrido un error inesperado 😭
      </h1>

      <p className="mt-4 text-gray-600 max-w-md">
        Puede que la página que buscas se haya movido, eliminado o nunca haya
        existido.
      </p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-primary-2 text-white rounded-xl font-semibold shadow-md hover:bg-[#00327b] transition-all duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default ErrorPage;
