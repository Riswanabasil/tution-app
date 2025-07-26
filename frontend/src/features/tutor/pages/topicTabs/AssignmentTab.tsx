// import { useEffect, useState } from "react";
// import {
//   fetchAssignmentsByTopic,
//   createAssignment,
//   updateAssignment,
//   deleteAssignment,
// } from "../../services/NoteApi";
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import Swal from "sweetalert2";
// import type { AxiosError } from "axios";

// type Assignment = {
//   _id: string;
//   title: string;
//   dueDate: string;
//   description: string;
//   createdAt: string;
// };

// type AssignmentTabProps = {
//   topicId: string;
// };

// export default function AssignmentTab({ topicId }: AssignmentTabProps) {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState<Assignment[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);

//   const [title, setTitle] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [description, setDescription] = useState("");

//   const loadAssignments = async () => {
//     const data = await fetchAssignmentsByTopic(topicId);
   
//     setAssignments(data);
//     setFiltered(data);
//   };

//   useEffect(() => {
//     loadAssignments();
//   }, [topicId]);

//   useEffect(() => {
//     const results = assignments.filter((a) =>
//       a.title.toLowerCase().includes(search.toLowerCase())
//     );
//     setFiltered(results);
//   }, [search, assignments]);

//   const handleSubmit = async () => {
//     if (!title || !dueDate) return;

//     const payload = {
//       title,
//       dueDate,
//       description,
//     };

//     try {
//       if (editAssignment) {
//         await updateAssignment(editAssignment._id, payload);
//         Swal.fire("Updated!", "Assignment updated successfully", "success");
//       } else {
//         await createAssignment(topicId, payload);
//         Swal.fire("Created!", "Assignment created successfully", "success");
//       }

//       setOpen(false);
//       resetForm();
//       loadAssignments();
//     } catch (err:unknown) {
//           const axiosError = err as AxiosError<{ message: string }>;
//           const message = axiosError.response?.data?.message 
//       if(message){
//         Swal.fire("Error", "Something went wrong", "error");
//       }
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setDueDate("");
//     setDescription("");
//     setEditAssignment(null);
//   };

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       await deleteAssignment(id);
//       Swal.fire("Deleted!", "", "success");
//       loadAssignments();
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Assignments</h2>
//         <Button variant="contained" onClick={() => setOpen(true)}>
//           Add Assignment
//         </Button>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <TextField
//           label="Search by title"
//           variant="outlined"
//           size="small"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {filtered.map((a) => (
//         <div key={a._id} className="border p-4 rounded mb-2">
//           <p className="font-medium text-lg">{a.title}</p>
//           <p className="text-sm text-gray-600">
//             Due: {new Date(a.dueDate).toLocaleDateString()}
//           </p>
//           <p className="text-sm my-2">{a.description}</p>
//           <div className="flex gap-2">
//             <Button
//               size="small"
//               variant="outlined"
//               onClick={() => {
//                 setEditAssignment(a);
//                 setTitle(a.title);
//                 setDueDate(a.dueDate.slice(0, 10));
//                 setDescription(a.description);
//                 setOpen(true);
//               }}
//             >
//               Edit
//             </Button>
//             <Button
//               size="small"
//               variant="outlined"
//               color="error"
//               onClick={() => handleDelete(a._id)}
//             >
//               Delete
//             </Button>
//           </div>
//         </div>
//       ))}

//       <Dialog
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           resetForm();
//         }}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {editAssignment ? "Edit Assignment" : "Add Assignment"}
//         </DialogTitle>
//         <DialogContent className="space-y-4 py-4">
//           <TextField
//             label="Title"
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <TextField
//             label="Due Date"
//             fullWidth
//             type="date"
//             value={dueDate}
//             onChange={(e) => setDueDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             multiline
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <div className="flex justify-end gap-2">
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 setOpen(false);
//                 resetForm();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button variant="contained" onClick={handleSubmit}>
//               {editAssignment ? "Update" : "Create"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  fetchAssignmentsByTopic,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../services/NoteApi";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import type { AxiosError } from "axios";

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  createdAt: string;
};

type AssignmentTabProps = {
  topicId: string;
};

export default function AssignmentTab({ topicId }: AssignmentTabProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Assignment[]>([]);
  const [open, setOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await fetchAssignmentsByTopic(topicId);
      setAssignments(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [topicId]);

  useEffect(() => {
    const results = assignments.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, assignments]);

  const handleSubmit = async () => {
    if (!title || !dueDate) return;

    const payload = {
      title,
      dueDate,
      description,
    };

    try {
      if (editAssignment) {
        await updateAssignment(editAssignment._id, payload);
        Swal.fire("Updated!", "Assignment updated successfully", "success");
      } else {
        await createAssignment(topicId, payload);
        Swal.fire("Created!", "Assignment created successfully", "success");
      }

      setOpen(false);
      resetForm();
      loadAssignments();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message;
      if (message) {
        Swal.fire("Error", message, "error");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDueDate("");
    setDescription("");
    setEditAssignment(null);
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (confirm.isConfirmed) {
      await deleteAssignment(id);
      Swal.fire("Deleted!", "Assignment has been deleted", "success");
      loadAssignments();
    }
  };

  const getStatusInfo = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-700', text: 'Overdue' };
    } else if (diffDays === 0) {
      return { status: 'today', color: 'bg-orange-100 text-orange-700', text: 'Due Today' };
    } else if (diffDays <= 3) {
      return { status: 'soon', color: 'bg-yellow-100 text-yellow-700', text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}` };
    } else {
      return { status: 'upcoming', color: 'bg-emerald-100 text-emerald-700', text: `Due in ${diffDays} days` };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Assignments</h2>
            <p className="text-sm text-slate-500">{assignments.length} {assignments.length === 1 ? 'assignment' : 'assignments'} total</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Assignment
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading assignments...</p>
        </div>
      ) : (
        <>
          {/* Assignments Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {search ? 'No assignments found' : 'No assignments yet'}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {search 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Create your first assignment to give students tasks and track their progress.'
                }
              </p>
              {!search && (
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Assignment
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((assignment, index) => {
                const statusInfo = getStatusInfo(assignment.dueDate);
                return (
                  <div
                    key={assignment._id}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-slate-900">
                              {assignment.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0l-1 12a1 1 0 01-1 1h8a1 1 0 01-1-1L15 7" />
                                </svg>
                                Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                            </div>
                            {assignment.description && (
                              <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                                {assignment.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => {
                              setEditAssignment(assignment);
                              setTitle(assignment.title);
                              setDueDate(assignment.dueDate.slice(0, 10));
                              setDescription(assignment.description);
                              setOpen(true);
                            }}
                            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                            title="Edit assignment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(assignment._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete assignment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator Bar */}
                    <div className={`h-1 ${
                      statusInfo.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      statusInfo.status === 'today' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      statusInfo.status === 'soon' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-emerald-500 to-teal-600'
                    } opacity-20 group-hover:opacity-40 transition-opacity duration-200`}></div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Enhanced Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {editAssignment ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {editAssignment ? "Edit Assignment" : "Create New Assignment"}
            </span>
          </div>
        </DialogTitle>
        
        <DialogContent className="p-6 space-y-6">
          <div className="space-y-4">
            <TextField
              label="Assignment Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              placeholder="Enter a descriptive title for the assignment"
              InputProps={{
                style: { borderRadius: '12px' }
              }}
            />
            
            <TextField
              label="Due Date"
              fullWidth
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              InputProps={{
                style: { borderRadius: '12px' }
              }}
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              placeholder="Provide detailed instructions and requirements for the assignment"
              InputProps={{
                style: { borderRadius: '12px' }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!title || !dueDate}
              className="px-6 py-2"
              style={{
                background: (!title || !dueDate) 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: (!title || !dueDate) ? 'none' : '0 4px 14px 0 rgba(16, 185, 129, 0.3)'
              }}
            >
              {editAssignment ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}