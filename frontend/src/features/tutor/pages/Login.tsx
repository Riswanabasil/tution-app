import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { googleLoginTutorThunk, loginTutorThunk } from '../../../redux/slices/tutorAuthSlice';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

const TutorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((s: RootState) => s.tutorAuth);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (error) setErrorMsg(error);
  }, [error]);
  useEffect(() => {
    if (isAuthenticated) navigate('/tutor/dashboard');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg('');
    const result = await dispatch(loginTutorThunk(data));
    if (loginTutorThunk.rejected.match(result)) {
      const msg = result.payload as string;
      if (msg === 'VERIFICATION_PENDING') {
        navigate('/tutor/verification-status');
        return;
      }
      setErrorMsg(msg || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (cr: CredentialResponse) => {
    const idToken = cr.credential;
    if (!idToken) return setErrorMsg('Google login failed');

    const action = await dispatch(googleLoginTutorThunk(idToken));
    if (googleLoginTutorThunk.fulfilled.match(action)) {
      const { tutor } = action.payload;
      console.log(tutor);

      if (tutor.status === 'approved') navigate('/tutor/dashboard');
      else {
        localStorage.setItem('pendingTutorId', tutor.id);
        localStorage.setItem('pendingTutorEmail', tutor.email);
        localStorage.setItem('pendingTutorName', tutor.name);
        navigate('/tutor/verification');
      }
    } else {
      setErrorMsg(action.payload as string);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="hidden w-1/2 flex-col items-center justify-center bg-indigo-600 p-8 text-white md:flex">
          <h1 className="mb-4 text-4xl font-bold">Tech Tute</h1>
          <p className="text-center text-lg">
            Tutor Login — Empower learners, one session at a time.
          </p>
        </div>
        <div className="w-full p-8 md:w-1/2">
          <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">Tutor Login</h2>

          {errorMsg && <p className="mb-4 text-center text-sm text-red-500">{errorMsg}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('email')}
                placeholder="Email Address"
                type="email"
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Google login failed')}
            />
            {errorMsg && <p className="mt-2 text-red-600">{errorMsg}</p>}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/tutor/register" className="font-medium text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;
