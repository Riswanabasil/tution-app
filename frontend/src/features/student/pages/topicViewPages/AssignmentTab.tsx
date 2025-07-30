// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchStudentAssignments } from "../../services/CourseApi";

// type Assignment = {
//   _id: string;
//   title: string;
//   dueDate: string;
//   description: string;
//   status: "pending" | "verified" | "expired";
// };

// export default function AssignmentTab() {
//   const { topicId } = useParams<{ topicId: string }>();
//   const [assignments, setAssignments] = useState<Assignment[]>([]);

//   useEffect(() => {
//     if (topicId) {
//       fetchStudentAssignments(topicId)
//         .then((res) => setAssignments(res))
//         .catch((err) => console.error("Error fetching assignments:", err));
//     }
//   }, [topicId]);

//   return (
//     <div className="p-4 space-y-4">
//       {assignments.map((assignment) => (
//         <div key={assignment._id} className="border rounded-xl p-4 shadow-sm bg-white">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-lg font-semibold">{assignment.title}</h2>
//             <span
//               className={`text-sm px-3 py-1 rounded-full ${
//                 assignment.status === "expired"
//                   ? "bg-red-100 text-red-600"
//                   : assignment.status === "verified"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-yellow-100 text-yellow-600"
//               }`}
//             >
//               {assignment.status}
//             </span>
//           </div>
//           <p className="text-gray-600 text-sm mb-1">
//             Due: {new Date(assignment.dueDate).toLocaleDateString()}
//           </p>
//           <p className="text-gray-700">{assignment.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentAssignments } from "../../services/CourseApi";
import SubmitModal from "./SubmitModal"; 

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  status: "not submitted" | "pending" | "verified" | "expired";
};

export default function AssignmentTab() {
  const { topicId } = useParams<{ topicId: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (topicId) {
      fetchStudentAssignments(topicId)
        .then((res) => setAssignments(res))
        .catch((err) => console.error("Error fetching assignments:", err));
    }
  }, [topicId]);

  const handleOpenModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setOpenModal(false);
  };

  return (
    <div className="p-4 space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment._id} className="border rounded-xl p-4 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{assignment.title}</h2>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                assignment.status === "expired"
                  ? "bg-red-100 text-red-600"
                  : assignment.status === "verified"
                  ? "bg-green-100 text-green-600"
                  : assignment.status === "pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {assignment.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-2">{assignment.description}</p>

          {assignment.status === "not submitted" && (
            <button
              onClick={() => handleOpenModal(assignment)}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Submit Response
            </button>
          )}

          {assignment.status === "pending" && (
            <button
              onClick={() => handleOpenModal(assignment)}
              className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Edit Response
            </button>
          )}

          {assignment.status === "verified" && (
            <button
              onClick={() => handleOpenModal(assignment)}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              View Feedback
            </button>
          )}
        </div>
      ))}

      {openModal && selectedAssignment && (
        <SubmitModal
          open={openModal}
          onClose={handleCloseModal}
          assignment={selectedAssignment}
          topicId={topicId!}
        />
      )}
    </div>
  );
}
