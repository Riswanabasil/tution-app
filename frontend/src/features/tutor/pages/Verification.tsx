import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { submitTutorVerification } from '../services/TutorApi';
import type { AxiosError } from 'axios';

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
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>();

  useEffect(() => {
    const tutorId = localStorage.getItem('pendingTutorId');
    const email = localStorage.getItem('pendingTutorEmail');
    const name = localStorage.getItem('pendingTutorName');
    if (tutorId && email && name) {
      setValue('email', email);
      setValue('fullName', name);
    } else {
      navigate('/tutor/register');
    }
  }, [setValue, navigate]);

  const onSubmit = async (data: FormInputs) => {
    const tutorId = localStorage.getItem('pendingTutorId');
    if (!tutorId) return;

    const formData = new FormData();
    formData.append('tutorId', tutorId);
    formData.append('summary', data.summary);
    formData.append('education', data.education);
    formData.append('experience', data.experience);
    formData.append('idProof', data.idProof[0]);
    formData.append('resume', data.resume[0]);

    try {
      await submitTutorVerification({
        tutorId,
        summary: data.summary,
        education: data.education,
        experience: data.experience,
        idProof: data.idProof[0],
        resume: data.resume[0],
      });
      //   localStorage.removeItem("pendingTutorId");
      //   localStorage.removeItem("pendingTutorEmail");
      //   localStorage.removeItem("pendingTutorName");
      navigate('/tutor/verification-status');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(error);
      setErrorMsg(axiosError?.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">
          Complete Verification
        </h2>

        {errorMsg && <p className="mb-4 text-center text-sm text-red-500">{errorMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <input
                {...register('fullName')}
                placeholder="Full Name"
                disabled
                className="w-full rounded border bg-gray-100 px-4 py-2"
              />
            </div>
            <div className="w-full">
              <input
                {...register('email')}
                placeholder="Email"
                disabled
                className="w-full rounded border bg-gray-100 px-4 py-2"
              />
            </div>
          </div>

          <textarea
            {...register('summary', { required: true })}
            placeholder="Professional Summary"
            rows={4}
            className="w-full rounded border px-4 py-2"
          />
          {errors.summary && <p className="text-sm text-red-500">Summary is required</p>}

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <input
                {...register('education', { required: true })}
                placeholder="Educational Qualification"
                className="w-full rounded border px-4 py-2"
              />
              {errors.education && <p className="text-sm text-red-500">Education is required</p>}
            </div>
            <div className="w-full">
              <input
                {...register('experience', { required: true })}
                placeholder="Teaching Experience"
                className="w-full rounded border px-4 py-2"
              />
              {errors.experience && <p className="text-sm text-red-500">Experience is required</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Upload ID Proof (PDF/DOC)
            </label>
            <input
              type="file"
              {...register('idProof', { required: true })}
              className="w-full"
              accept=".pdf,.doc,.docx"
            />
            {errors.idProof && <p className="text-sm text-red-500">ID Proof is required</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Upload Resume</label>
            <input
              type="file"
              {...register('resume', { required: true })}
              className="w-full"
              accept=".pdf,.doc,.docx"
            />
            {errors.resume && <p className="text-sm text-red-500">Resume is required</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
          >
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorVerification;
