import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TutorVerificationStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("pendingTutorId");
    localStorage.removeItem("pendingTutorEmail");
    localStorage.removeItem("pendingTutorName");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-sky-100 to-indigo-100 px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/189/189792.png"
        alt="Hourglass"
        className="w-24 h-24 mb-6 animate-pulse"
      />

      <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
        Verification in Progress
      </h2>
      <p className="text-center text-gray-600 max-w-md mb-6">
        Thank you for submitting your tutor verification form. Our team is currently reviewing your application. We’ll notify you once it’s approved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TutorVerificationStatus;
