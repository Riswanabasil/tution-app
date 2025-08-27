import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TutorVerificationStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('pendingTutorId');
    localStorage.removeItem('pendingTutorEmail');
    localStorage.removeItem('pendingTutorName');
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-sky-100 to-indigo-100 px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/189/189792.png"
        alt="Hourglass"
        className="mb-6 h-24 w-24 animate-pulse"
      />

      <h2 className="mb-2 text-2xl font-semibold text-indigo-700">Verification in Progress</h2>
      <p className="mb-6 max-w-md text-center text-gray-600">
        Thank you for submitting your tutor verification form. Our team is currently reviewing your
        application. We’ll notify you once it’s approved.
      </p>

      <button
        onClick={() => navigate('/')}
        className="rounded bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TutorVerificationStatus;
