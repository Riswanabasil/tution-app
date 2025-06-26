import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { studentLogin,studentGoogleLogin } from "../services/StudentApi"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import type { AxiosError } from "axios";

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
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrorMsg(axiosError.response?.data?.message || "Login failed");
    }
  };

   const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        setErrorMsg("Google login failed");
        return;
      }

      const response = await studentGoogleLogin(idToken);
      localStorage.setItem("accessToken", response.accessToken);
      navigate("/student/dashboard");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrorMsg(axiosError.response?.data?.message || "Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          Tech Tute Login
        </h2>

        {/* {errorMsg && (
          <p className="text-red-500 text-center text-sm mb-4">{errorMsg}</p>
        )} */}

        {errorMsg && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{errorMsg}</span>
    <span
      onClick={() => setErrorMsg("")}
      className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
    >
      ×
    </span>
  </div>
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
<div className="mt-4 text-center">
  <p className="text-sm">
    Don't have an account?{" "}
    <Link to="/student/register" className="text-indigo-600 hover:underline font-medium">
      Sign up
    </Link>
  </p>
</div>
      </div>
    </div>
  );
};

export default Login;