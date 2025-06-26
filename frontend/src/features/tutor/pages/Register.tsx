import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerTutor } from "../services/TutorApi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AxiosError } from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(4, "Min 4 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const TutorRegister = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerTutor(data);
      console.log(response);
      
      localStorage.setItem("pendingTutorId", response.tutor.id); 
      localStorage.setItem("pendingTutorEmail", response.tutor.email);
      localStorage.setItem("pendingTutorName", response.tutor.name); 
      navigate("/tutor/verification");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrorMsg(axiosError?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-xl rounded-lg flex w-full max-w-4xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white w-1/2 p-8">
          <h1 className="text-4xl font-bold mb-4">Tech Tute</h1>
          <p className="text-lg text-center">
            Join our expert tutor team and start guiding students today.
          </p>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
            Tutor Signup
          </h2>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("name")} placeholder="Full Name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <input {...register("phone")} placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

            <input {...register("email")} placeholder="Email Address" type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input {...register("password")} placeholder="Create Password" type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <button type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300">
              Register
            </button>
          </form>
          <div className="mt-4 text-center">
  <p className="text-sm">
    Already have an account?{" "}
    <Link to="/tutor/login" className="text-indigo-600 hover:underline font-medium">
      Login here
    </Link>
  </p>
</div>

        </div>
      </div>
    </div>
  );
};

export default TutorRegister;
