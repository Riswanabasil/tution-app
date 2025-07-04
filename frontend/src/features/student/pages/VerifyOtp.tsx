import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/AxiosInstance";
import type { AxiosError } from "axios";

const schema = yup.object().shape({
  otp: yup.string().length(4, "OTP must be 4 digits").required("OTP is required"),
});

type FormData = yup.InferType<typeof schema>;

const VerifyOtp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const [errorMsg, setErrorMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60); 
  const [resendEnabled, setResendEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendEnabled(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  const onSubmit = async (data: FormData) => {
    try {
        const token = localStorage.getItem("accessToken");
      const response = await axios.post(
  "/student/verify-otp",
  { otp: data.otp },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("OTP verified:", response.data);
      navigate("/student/login");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("OTP error:", error);
      setErrorMsg(axiosError.response?.data?.message || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "/student/resend-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeLeft(5 * 60);
      setResendEnabled(false);
    } catch (error:unknown) { 
      const axiosError = error as AxiosError<{ message: string }>;
      setErrorMsg(axiosError.message||"Failed to resend OTP");
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We’ve sent a 4-digit OTP to your registered email. Please enter it below.
        </p>

        {errorMsg && <p className="text-red-500 text-center mb-4 text-sm">{errorMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("otp")}
              placeholder="Enter 4-digit OTP"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Verify OTP
          </button>
        </form>

        <div className="text-center mt-6">
          {!resendEnabled ? (
            <p className="text-gray-500 text-sm">
              Resend OTP available in <span className="font-medium">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-indigo-600 font-medium hover:underline text-sm"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
