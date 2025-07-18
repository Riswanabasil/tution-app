import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { submitTutorVerification } from "../services/TutorApi";
import type { AxiosError } from "axios";

type FormInputs = {
  fullName: string;
  email: string;
  summary: string;
  education: string;
  experience: string;
  idProof: FileList;
  resume: FileList;
};

const TutorVerification = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>();

  useEffect(() => {
    const tutorId = localStorage.getItem("pendingTutorId");
    const email = localStorage.getItem("pendingTutorEmail");
    const name = localStorage.getItem("pendingTutorName");
    if (tutorId && email && name) {
      setValue("email", email);
      setValue("fullName", name);
    } else {
      navigate("/tutor/register");
    }
  }, [setValue, navigate]);

  const onSubmit = async (data: FormInputs) => {
    const tutorId = localStorage.getItem("pendingTutorId");
    if (!tutorId) return;

    const formData = new FormData();
    formData.append("tutorId", tutorId);
    formData.append("summary", data.summary);
    formData.append("education", data.education);
    formData.append("experience", data.experience);
    formData.append("idProof", data.idProof[0]);
    formData.append("resume", data.resume[0]);

    try {
     await submitTutorVerification({
  tutorId,
  summary: data.summary,
  education: data.education,
  experience: data.experience,
  idProof: data.idProof[0],
  resume: data.resume[0],
})
    //   localStorage.removeItem("pendingTutorId");
    //   localStorage.removeItem("pendingTutorEmail");
    //   localStorage.removeItem("pendingTutorName");
      navigate("/tutor/verification-status");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(error);
      setErrorMsg(axiosError?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          Complete Verification
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center text-sm mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <input
                {...register("fullName")}
                placeholder="Full Name"
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
            <div className="w-full">
              <input
                {...register("email")}
                placeholder="Email"
                disabled
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <textarea
            {...register("summary", { required: true })}
            placeholder="Professional Summary"
            rows={4}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.summary && (
            <p className="text-red-500 text-sm">Summary is required</p>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <input
                {...register("education", { required: true })}
                placeholder="Educational Qualification"
                className="w-full px-4 py-2 border rounded"
              />
              {errors.education && (
                <p className="text-red-500 text-sm">Education is required</p>
              )}
            </div>
            <div className="w-full">
              <input
                {...register("experience", { required: true })}
                placeholder="Teaching Experience"
                className="w-full px-4 py-2 border rounded"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">Experience is required</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload ID Proof (PDF/DOC)
            </label>
            <input
              type="file"
              {...register("idProof", { required: true })}
              className="w-full"
              accept=".pdf,.doc,.docx"
            />
            {errors.idProof && (
              <p className="text-red-500 text-sm">ID Proof is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Resume
            </label>
            <input
              type="file"
              {...register("resume", { required: true })}
              className="w-full"
              accept=".pdf,.doc,.docx"
            />
            {errors.resume && (
              <p className="text-red-500 text-sm">Resume is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorVerification;
