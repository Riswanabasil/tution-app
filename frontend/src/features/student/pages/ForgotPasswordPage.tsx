
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { requestPasswordReset, verifyResetOtp, resetPasswordWithOtp } from '../services/StudentApi';
// import { useNavigate } from 'react-router-dom';
// import type { AxiosError } from 'axios';

// const emailSchema = yup.object({
//   email: yup.string().email('Invalid email').required('Email is required'),
// });
// type EmailForm = yup.InferType<typeof emailSchema>;

// const otpSchema = yup.object({
//   otp: yup.string().length(4, 'OTP must be 4 digits').required('OTP is required'),
// });
// type OtpForm = yup.InferType<typeof otpSchema>;

// const resetSchema = yup.object({
//   newPassword: yup.string().min(4, 'At least 4 characters').required('New password is required'),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref('newPassword')], 'Passwords do not match')
//     .required('Confirm your password'),
// });
// type ResetForm = yup.InferType<typeof resetSchema>;

// export default function ForgotPasswordPage() {
//   const nav = useNavigate();
//   const [step, setStep] = useState<1 | 2 | 3>(1);
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');

//   // forms
//   const emailForm = useForm<EmailForm>({ resolver: yupResolver(emailSchema) });
//   const otpForm = useForm<OtpForm>({ resolver: yupResolver(otpSchema) });
//   const resetForm = useForm<ResetForm>({ resolver: yupResolver(resetSchema) });

//   const handleEmail = emailForm.handleSubmit(async (values) => {
//     setError('');
//     try {
//       setEmail(values.email);
//       await requestPasswordReset(values.email);
//       setStep(2);
//     } catch (e) {
//       const err = e as AxiosError<{ message: string }>;
//       setError(err.response?.data?.message || 'Something went wrong.');
//     }
//   });

//   const handleOtp = otpForm.handleSubmit(async (values) => {
//     setError('');
//     try {
//       await verifyResetOtp(email, values.otp);
//       setOtp(values.otp);
//       setStep(3);
//     } catch (e) {
//       const err = e as AxiosError<{ message: string }>;
//       setError(err.response?.data?.message || 'Invalid OTP.');
//     }
//   });

//   const handleReset = resetForm.handleSubmit(async (values) => {
//     setError('');
//     try {
//       await resetPasswordWithOtp({
//         email,
//         otp,
//         newPassword: values.newPassword,
//         confirmPassword: values.confirmPassword,
//       });
//       nav('/student/login', { replace: true });
//     } catch (e) {
//       const err = e as AxiosError<{ message: string }>;
//       setError(err.response?.data?.message || 'Password reset failed.');
//     }
//   });

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
//         <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">
//           Reset your password
//         </h2>

//         {error && (
//           <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//             {error}
//           </div>
//         )}

//         {step === 1 && (
//           <form onSubmit={handleEmail} className="space-y-4">
//             <input
//               {...emailForm.register('email')}
//               type="email"
//               placeholder="Registered email"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {emailForm.formState.errors.email && (
//               <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
//             )}
//             <button
//               type="submit"
//               className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
//             >
//               Send OTP
//             </button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={handleOtp} className="space-y-4">
//             <div className="text-sm text-gray-600">
//               OTP sent to: <b>{email}</b>
//             </div>
//             <input
//               {...otpForm.register('otp')}
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {otpForm.formState.errors.otp && (
//               <p className="text-sm text-red-500">{otpForm.formState.errors.otp.message}</p>
//             )}
//             <button
//               type="submit"
//               className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
//             >
//               Verify OTP
//             </button>

//             <button
//               type="button"
//               onClick={() => setStep(1)}
//               className="w-full rounded border border-gray-300 py-2 text-gray-700 transition hover:bg-gray-50"
//             >
//               Change email
//             </button>
//           </form>
//         )}

//         {step === 3 && (
//           <form onSubmit={handleReset} className="space-y-4">
//             <div className="text-sm text-gray-600">
//               Resetting password for: <b>{email}</b>
//             </div>
//             <input
//               {...resetForm.register('newPassword')}
//               type="password"
//               placeholder="New password"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {resetForm.formState.errors.newPassword && (
//               <p className="text-sm text-red-500">
//                 {resetForm.formState.errors.newPassword.message}
//               </p>
//             )}
//             <input
//               {...resetForm.register('confirmPassword')}
//               type="password"
//               placeholder="Confirm password"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {resetForm.formState.errors.confirmPassword && (
//               <p className="text-sm text-red-500">
//                 {resetForm.formState.errors.confirmPassword.message}
//               </p>
//             )}
//             <button
//               type="submit"
//               className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
//             >
//               Update Password
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { requestPasswordReset, verifyResetOtp, resetPasswordWithOtp } from '../services/StudentApi';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';

const emailSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});
type EmailForm = yup.InferType<typeof emailSchema>;

const otpSchema = yup.object({
  otp: yup.string().length(4, 'OTP must be 4 digits').required('OTP is required'),
});
type OtpForm = yup.InferType<typeof otpSchema>;

const resetSchema = yup.object({
  newPassword: yup.string().min(4, 'At least 4 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm your password'),
});
type ResetForm = yup.InferType<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // forms
  const emailForm = useForm<EmailForm>({ resolver: yupResolver(emailSchema) });
  const otpForm = useForm<OtpForm>({ resolver: yupResolver(otpSchema) });
  const resetForm = useForm<ResetForm>({ resolver: yupResolver(resetSchema) });

  const handleEmail = emailForm.handleSubmit(async (values) => {
    setError('');
    try {
      setEmail(values.email);
      await requestPasswordReset(values.email);
      setStep(2);
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  });

  const handleOtp = otpForm.handleSubmit(async (values) => {
    setError('');
    try {
      await verifyResetOtp(email, values.otp);
      setOtp(values.otp);
      setStep(3);
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || 'Invalid OTP.');
    }
  });

  const handleReset = resetForm.handleSubmit(async (values) => {
    setError('');
    try {
      await resetPasswordWithOtp({
        email,
        otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      nav('/student/login', { replace: true });
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || 'Password reset failed.');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-indigo-700">
          Reset your password
        </h2>

        {error && (
          <div
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmail} className="space-y-4" noValidate>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <input
                {...emailForm.register('email')}
                type="email"
                placeholder="Registered email"
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-invalid={!!emailForm.formState.errors.email}
                aria-describedby={emailForm.formState.errors.email ? 'email-error' : undefined}
              />
            </label>
            {emailForm.formState.errors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {emailForm.formState.errors.email.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtp} className="space-y-4" noValidate>
            <div className="text-sm text-gray-600">
              OTP sent to: <b className="break-all">{email}</b>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">OTP</span>
              <input
                {...otpForm.register('otp')}
                type="text"
                placeholder="Enter 6-digit OTP"
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-invalid={!!otpForm.formState.errors.otp}
                aria-describedby={otpForm.formState.errors.otp ? 'otp-error' : undefined}
              />
            </label>
            {otpForm.formState.errors.otp && (
              <p id="otp-error" className="text-sm text-red-500">
                {otpForm.formState.errors.otp.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Verify OTP
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded border border-gray-300 py-2 text-sm text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              Change email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-4" noValidate>
            <div className="text-sm text-gray-600">
              Resetting password for: <b className="break-all">{email}</b>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">New password</span>
              <input
                {...resetForm.register('newPassword')}
                type="password"
                placeholder="New password"
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-invalid={!!resetForm.formState.errors.newPassword}
                aria-describedby={resetForm.formState.errors.newPassword ? 'newpass-error' : undefined}
              />
            </label>
            {resetForm.formState.errors.newPassword && (
              <p id="newpass-error" className="text-sm text-red-500">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Confirm password</span>
              <input
                {...resetForm.register('confirmPassword')}
                type="password"
                placeholder="Confirm password"
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-invalid={!!resetForm.formState.errors.confirmPassword}
                aria-describedby={resetForm.formState.errors.confirmPassword ? 'confirm-error' : undefined}
              />
            </label>
            {resetForm.formState.errors.confirmPassword && (
              <p id="confirm-error" className="text-sm text-red-500">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
