// import { useState } from 'react';
// import Swal from 'sweetalert2';
// import { changePassword } from '../services/StudentApi';
// import type { AxiosError } from 'axios';

// export default function ChangePasswordForm() {
//   const [current, setCurrent] = useState('');
//   const [next, setNext] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     if (next !== confirm) {
//       setError('New passwords must match');
//       return;
//     }
//     try {
//       await changePassword(current, next);
//       Swal.fire('Success', 'Password updated', 'success');
//       setCurrent('');
//       setNext('');
//       setConfirm('');
//       setError('');
//     } catch (error: unknown) {
//       const axiosError = error as AxiosError<{ message: string }>;
//       setError(axiosError.message || 'Failed to change password');
//     }
//   };

//   return (
//     <div className="space-y-4 rounded-lg bg-white p-6 shadow">
//       <h3 className="text-xl font-semibold">Change Password</h3>
//       {error && <p className="text-red-600">{error}</p>}

//       <input
//         type="password"
//         placeholder="Current password"
//         value={current}
//         onChange={(e) => setCurrent(e.target.value)}
//         className="w-full rounded border px-3 py-2"
//       />
//       <input
//         type="password"
//         placeholder="New password"
//         value={next}
//         onChange={(e) => setNext(e.target.value)}
//         className="w-full rounded border px-3 py-2"
//       />
//       <input
//         type="password"
//         placeholder="Confirm new password"
//         value={confirm}
//         onChange={(e) => setConfirm(e.target.value)}
//         className="w-full rounded border px-3 py-2"
//       />

//       <button
//         onClick={handleSubmit}
//         className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//       >
//         Update Password
//       </button>
//     </div>
//   );
// }
import { useState } from 'react';
import Swal from 'sweetalert2';
import { changePassword } from '../services/StudentApi';
import type { AxiosError } from 'axios';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (next !== confirm) {
      setError('New passwords must match');
      return;
    }
    try {
      await changePassword(current, next);
      Swal.fire('Success', 'Password updated', 'success');
      setCurrent('');
      setNext('');
      setConfirm('');
      setError('');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(axiosError.message || 'Failed to change password');
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 sm:p-6 shadow">
      <h3 className="text-lg sm:text-xl font-semibold">Change Password</h3>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="current-password">
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          placeholder="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="sr-only" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          placeholder="New password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="sr-only" htmlFor="confirm-password">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
