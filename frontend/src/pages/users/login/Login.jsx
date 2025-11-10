import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <section className="flex h-screen">
      <div className="bg-primary-2 w-2/3 flex flex-col items-start justify-start p-8">
        <h1 className="text-white text-5xl font-poppins font-semibold text-center mt-32">
          ¡Bienvenido/a de vuelta a nuestra comunidad!
        </h1>
      </div>
      <LoginForm />
    </section>
  );
};

export default Login;
