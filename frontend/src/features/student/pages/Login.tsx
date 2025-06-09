import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { studentLogin,studentGoogleLogin } from "../services/StudentApi"
import { GoogleLogin } from "@react-oauth/google";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await studentLogin(data);
      localStorage.setItem("accessToken", response.accessToken);
      navigate("/student/dashboard");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Login failed");
    }
  };

   const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        setErrorMsg("Google login failed");
        return;
      }

      const response = await studentGoogleLogin(idToken);
      localStorage.setItem("accessToken", response.accessToken);
      navigate("/student/dashboard");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          Tech Tute Login
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center text-sm mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
 <div className="mt-6 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
               console.log("error here")
              setErrorMsg("Google Login failed")
            }}
          
          />
        </div>

      </div>
    </div>
  );
};

export default Login;