// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { Link, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
// import { useDispatch, useSelector } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../redux/store';
// import { loginStudentThunk, googleLoginStudentThunk } from '../../../redux/slices/studentAuthSlice';

// const schema = yup.object().shape({
//   email: yup.string().email('Invalid email').required('Email is required'),
//   password: yup.string().required('Password is required'),
// });
// type FormData = yup.InferType<typeof schema>;

// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({ resolver: yupResolver(schema) });

//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error, isAuthenticated } = useSelector((s: RootState) => s.studentAuth);

//   const [errorMsg, setErrorMsg] = useState('');

//   useEffect(() => {
//     if (error) setErrorMsg(error);
//   }, [error]);

//   useEffect(() => {
//     if (isAuthenticated) navigate('/student/dashboard');
//   }, [isAuthenticated, navigate]);

//   const onSubmit = (data: FormData) => {
//     dispatch(loginStudentThunk(data));
//   };

//   const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
//     const idToken = credentialResponse.credential;
//     if (!idToken) return setErrorMsg('Google login failed');
//     dispatch(googleLoginStudentThunk(idToken));
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
//         <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">Tech Tute Login</h2>

//         {errorMsg && (
//           <div className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{errorMsg}</span>
//             <span
//               onClick={() => setErrorMsg('')}
//               className="absolute bottom-0 right-0 top-0 cursor-pointer px-4 py-3"
//             >
//               ×
//             </span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <input
//               {...register('email')}
//               placeholder="Email"
//               type="email"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
//           </div>

//           <div>
//             <input
//               {...register('password')}
//               placeholder="Password"
//               type="password"
//               className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
//             )}
//           </div>

//           <div className="text-right">
//             <Link to="/student/forgot-password" className="text-sm text-indigo-600 hover:underline">
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-70"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => setErrorMsg('Google Login failed')}
//           />
//         </div>

//         <div className="mt-4 text-center">
//           <p className="text-sm">
//             Don't have an account?{' '}
//             <Link to="/student/register" className="font-medium text-indigo-600 hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { loginStudentThunk, googleLoginStudentThunk } from '../../../redux/slices/studentAuthSlice';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});
type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((s: RootState) => s.studentAuth);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (error) setErrorMsg(error);
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) navigate('/student/dashboard');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data: FormData) => {
    dispatch(loginStudentThunk(data));
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return setErrorMsg('Google login failed');
    dispatch(googleLoginStudentThunk(idToken));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-indigo-700">
          Tech Tute Login
        </h2>

        {errorMsg && (
          <div
            className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 text-sm"
            role="alert"
            aria-live="assertive"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMsg}</span>
            <button
              onClick={() => setErrorMsg('')}
              aria-label="Dismiss error"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="sr-only">Email</label>
            <input
              {...register('email')}
              placeholder="Email"
              type="email"
              className="w-full rounded border px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="sr-only">Password</label>
            <input
              {...register('password')}
              placeholder="Password"
              type="password"
              className="w-full rounded border px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link to="/student/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 py-2 text-sm sm:text-base text-white transition hover:bg-indigo-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg('Google Login failed')}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/student/register" className="font-medium text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
