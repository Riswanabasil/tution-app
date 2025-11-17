// import { useCallback, useEffect, useState } from 'react';
// import { fetchTutors, getTutorById, updateTutorStatus } from '../services/AdminApi';
// import type { AxiosError } from 'axios';
// import Modal from '../components/Modal';
// import type { ITutor } from '../../../types/types';
// import { useDebouncedValue } from '../../../hooks/useDebounce';


// interface Tutor {
//   _id: string;
//   name: string;
//   email: string;
//   status: string;
//   assignedCourses?: { _id: string; title: string }[];
// }


// const AdminTutorPage = () => {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState('');
//   const debouncedSearch = useDebouncedValue(search, 400)
//   const [status, setStatus] = useState('');
//   const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const loadTutors = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetchTutors(page, 5, status, debouncedSearch);
//       console.log(res.tutors);

//       setTutors(res.tutors);
//       setTotalPages(res.totalPages);
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.response?.data?.message || 'Failed to load tutors');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, status, debouncedSearch]);

//   useEffect(() => {
//     loadTutors();
//   }, [loadTutors]);
//   const handleViewTutor = async (tutor: Tutor) => {
//     try {
//       const fullTutor = await getTutorById(tutor._id);
//       setSelectedTutor(fullTutor);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Failed to load tutor details', error);
//       setError('Unable to load tutor details');
//     }
//   };
//   const handleStatusUpdate = async (tutorId: string, status: 'approved' | 'rejected') => {
//     try {
//       await updateTutorStatus(tutorId, status);
//       setTutors((prev) =>
//         prev.map((tutor) => (tutor._id === tutorId ? { ...tutor, status: status } : tutor)),
//       );
//     } catch (error) {
//       console.error('Failed to update tutor status', error);
//     }
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTutor(null);
//   };


//   async function downloadFile(url: string, filename: string) {
//     try {
//       const res = await fetch(url, { mode: 'cors' }); // requires CORS for cross-origin
//       if (!res.ok) throw new Error('Fetch failed');
//       const blob = await res.blob();
//       const blobUrl = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = blobUrl;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.warn('fetch-download failed, falling back to open', err);
//       // fallback - open in new tab (or use window.location.href to navigate same tab)
//       window.open(url, '_blank', 'noopener,noreferrer');
//     }
//   }


//   return (
//     <div className="p-6">
//       <h2 className="mb-4 text-2xl font-semibold">Tutor Management</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="mb-6 flex flex-col gap-4 md:flex-row">
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full rounded border px-4 py-2 md:w-1/2"
//         />

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="w-full rounded border px-4 py-2 md:w-1/4"
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>

//       <table className="w-full table-auto border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Status</th>
//             {/* <th className="border p-2">Assigned Course</th> */}
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tutors.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="p-4 text-center">
//                 No tutors found.
//               </td>
//             </tr>
//           ) : (
//             tutors.map((tutor) => (
//               <tr key={tutor._id} className="border-t text-center">
//                 <td className="p-2">{tutor.name}</td>
//                 <td className="p-2">{tutor.email}</td>
//                 <td className="p-2 capitalize">{tutor.status}</td>


//                 <td className="space-x-2 p-2">
//                   <button
//                     onClick={() => handleViewTutor(tutor)}
//                     // className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     className="text-blue-600 hover:underline"
//                   >
//                     View
//                   </button>
//                   {tutor.status !== 'approved' && (
//                     <button
//                       onClick={() => handleStatusUpdate(tutor._id, 'approved')}
//                       // className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                       className="text-green-600 hover:underline"
//                     >
//                       Approve
//                     </button>
//                   )}
//                   {tutor.status !== 'rejected' && (
//                     <button
//                       onClick={() => handleStatusUpdate(tutor._id, 'rejected')}
//                       // className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                       className="text-red-600 hover:underline"
//                     >
//                       Reject
//                     </button>
//                   )}


//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="mt-4 flex justify-center gap-2">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="rounded border px-3 py-1 disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span className="px-3 py-1">{page}</span>
//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="rounded border px-3 py-1 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={closeModal} title="Tutor Details">
//         {selectedTutor && (
//           <div className="space-y-2 text-sm">
//             <p>
//               <strong>Name:</strong> {selectedTutor.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {selectedTutor.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {selectedTutor.phone}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedTutor.status}
//             </p>

//             {selectedTutor.verificationDetails && (
//               <>
//                 <p>
//                   <strong>Education:</strong> {selectedTutor.verificationDetails.education}
//                 </p>
//                 <p>
//                   <strong>Experience:</strong> {selectedTutor.verificationDetails.experience}
//                 </p>
//                 <p>
//                   <strong>Summary:</strong> {selectedTutor.verificationDetails.summary}
//                 </p>

//                 <p>
//                   <strong>ID Proof:</strong>{' '}
//                   {!selectedTutor?.verificationDetails ||
//                     (!selectedTutor.verificationDetails.idProof) ? (
//                     <p className="text-gray-600">Tutor has not added Id proof.</p>
//                   ) : (
//                     <>
//                       <a
//                         // href={`${selectedTutor.verificationDetails.idProof}`}
//                         // download="Resume-JaneDoe.pdf"
//                         // rel="noopener noreferrer"
//                         // className="text-blue-600 underline"

//                         href="#"
//                         onClick={(e) => { e.preventDefault(); downloadFile(selectedTutor.verificationDetails!.idProof, `ID-${selectedTutor.name}.pdf`); }}
//                         className="text-blue-600 underline"
//                       >
//                         View ID
//                       </a>
//                     </>
//                   )}
//                   {/* <a
//                     href={`${selectedTutor.verificationDetails.idProof}`}
//                     download="Resume-JaneDoe.pdf"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     View ID
//                   </a> */}
//                 </p>

//                 <p>
//                   <strong>Resume:</strong>{' '}
//                   {!selectedTutor?.verificationDetails ||
//                     (!selectedTutor.verificationDetails.resume) ? (
//                     <p className="text-gray-600">Tutor has not added resume.</p>
//                   ) : (
//                     <>
//                       <a
//                         // href={`${selectedTutor.verificationDetails.resume}`}
//                         // target="_blank"
//                         // rel="noopener noreferrer"
//                         // className="text-blue-600 underline"
//                         href="#"
//                         onClick={(e) => { e.preventDefault(); downloadFile(selectedTutor.verificationDetails!.resume, `RESUME-${selectedTutor.name}.pdf`); }}
//                         className="text-blue-600 underline"
//                       >
//                         View Resume
//                       </a>
//                     </>
//                   )}
//                   {/* <a
//                     href={`${selectedTutor.verificationDetails.resume}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     View Resume
//                   </a> */}
//                 </p>
//               </>
//             )}
//           </div>
//         )}
//       </Modal>


//     </div>
//   );
// };

// export default AdminTutorPage;
import { useCallback, useEffect, useState } from 'react';
import { fetchTutors, getTutorById, updateTutorStatus } from '../services/AdminApi';
import type { AxiosError } from 'axios';
import Modal from '../components/Modal';
import type { ITutor } from '../../../types/types';
import { useDebouncedValue } from '../../../hooks/useDebounce';

interface Tutor {
  _id: string;
  name: string;
  email: string;
  status: string;
  assignedCourses?: { _id: string; title: string }[];
}

const AdminTutorPage = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [status, setStatus] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<ITutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTutors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTutors(page, 5, status, debouncedSearch);
      console.log(res.tutors);

      setTutors(res.tutors);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to load tutors');
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  const handleViewTutor = async (tutor: Tutor) => {
    try {
      const fullTutor = await getTutorById(tutor._id);
      setSelectedTutor(fullTutor);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to load tutor details', error);
      setError('Unable to load tutor details');
    }
  };

  const handleStatusUpdate = async (tutorId: string, status: 'approved' | 'rejected') => {
    try {
      await updateTutorStatus(tutorId, status);
      setTutors((prev) =>
        prev.map((tutor) => (tutor._id === tutorId ? { ...tutor, status: status } : tutor))
      );
    } catch (error) {
      console.error('Failed to update tutor status', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  async function downloadFile(url: string, filename: string) {
    try {
      const res = await fetch(url, { mode: 'cors' }); // requires CORS for cross-origin
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('fetch-download failed, falling back to open', err);
      // fallback - open in new tab (or use window.location.href to navigate same tab)
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Tutor Management</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-1/3 rounded border px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-sm text-left">Name</th>
              <th className="border p-3 text-sm text-left">Email</th>
              <th className="border p-3 text-sm text-left">Status</th>
              <th className="border p-3 text-sm text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutors.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No tutors found.
                </td>
              </tr>
            ) : (
              tutors.map((tutor) => (
                <tr key={tutor._id} className="border-t">
                  <td className="p-3 align-top break-words max-w-xs text-sm">{tutor.name}</td>
                  <td className="p-3 align-top break-words max-w-xs text-sm">{tutor.email}</td>
                  <td className="p-3 align-top text-sm capitalize">{tutor.status}</td>

                  <td className="p-3 text-sm">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-start">
                      <button
                        onClick={() => handleViewTutor(tutor)}
                        className="w-full sm:w-auto text-blue-600 hover:underline"
                      >
                        View
                      </button>

                      {tutor.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(tutor._id, 'approved')}
                          className="w-full sm:w-auto text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                      )}

                      {tutor.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(tutor._id, 'rejected')}
                          className="w-full sm:w-auto text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">Page {page}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Tutor Details">
        {selectedTutor && (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {selectedTutor.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedTutor.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedTutor.phone}
            </p>
            <p>
              <strong>Status:</strong> {selectedTutor.status}
            </p>

            {selectedTutor.verificationDetails && (
              <>
                <p>
                  <strong>Education:</strong> {selectedTutor.verificationDetails.education}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedTutor.verificationDetails.experience}
                </p>
                <p>
                  <strong>Summary:</strong> {selectedTutor.verificationDetails.summary}
                </p>

                <p>
                  <strong>ID Proof:</strong>{' '}
                  {!selectedTutor?.verificationDetails ||
                  !selectedTutor.verificationDetails.idProof ? (
                    <span className="text-gray-600">Tutor has not added Id proof.</span>
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadFile(
                          selectedTutor.verificationDetails!.idProof,
                          `ID-${selectedTutor.name}.pdf`
                        );
                      }}
                      className="text-blue-600 underline"
                    >
                      View ID
                    </a>
                  )}
                </p>

                <p>
                  <strong>Resume:</strong>{' '}
                  {!selectedTutor?.verificationDetails ||
                  !selectedTutor.verificationDetails.resume ? (
                    <span className="text-gray-600">Tutor has not added resume.</span>
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadFile(
                          selectedTutor.verificationDetails!.resume,
                          `RESUME-${selectedTutor.name}.pdf`
                        );
                      }}
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  )}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTutorPage;
