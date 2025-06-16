import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginTutor } from "../services/TutorApi";
import type { AxiosError } from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;

const TutorLogin = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    try {
      const res = await loginTutor(data); 

      localStorage.setItem("tutorAccessToken", res.accesToken);
      localStorage.setItem("tutorRefreshToken", res.refreshToken);

      navigate("/tutor/dashboard");
    } catch (err: unknown) {
  const axiosError = err as AxiosError<{ message: string }>;
  const message = axiosError.response?.data?.message || "Login failed";

  if (message === "VERIFICATION_PENDING") {
    navigate("/tutor/verification-status");
  } else {
    setErrorMsg(message);
  }
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-xl rounded-lg flex w-full max-w-4xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white w-1/2 p-8">
          <h1 className="text-4xl font-bold mb-4">Tech Tute</h1>
          <p className="text-lg text-center">
            Tutor Login — Empower learners, one session at a time.
          </p>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
            Tutor Login
          </h2>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("email")}
                placeholder="Email Address"
                type="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;
