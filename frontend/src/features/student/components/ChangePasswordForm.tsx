import { useState } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../services/StudentApi";
import type { AxiosError } from "axios";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next,    setNext]    = useState("");
  const [confirm,setConfirm]  = useState("");
  const [error,  setError]    = useState("");

  const handleSubmit = async () => {
    if (next !== confirm) {
      setError("New passwords must match");
      return;
    }
    try {
      await changePassword(current, next);
      Swal.fire("Success", "Password updated", "success");
      setCurrent(""); setNext(""); setConfirm(""); setError("");
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
      setError(axiosError.message || "Failed to change password");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-semibold">Change Password</h3>
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="password"
        placeholder="Current password"
        value={current}
        onChange={e => setCurrent(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="New password"
        value={next}
        onChange={e => setNext(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Update Password
      </button>
    </div>
  );
}
