import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentAssignments } from "../../services/CourseApi";

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  description: string;
  status: "pending" | "verified" | "expired";
};

export default function AssignmentTab() {
  const { topicId } = useParams<{ topicId: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (topicId) {
      fetchStudentAssignments(topicId)
        .then((res) => setAssignments(res))
        .catch((err) => console.error("Error fetching assignments:", err));
    }
  }, [topicId]);

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
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {assignment.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">{assignment.description}</p>
        </div>
      ))}
    </div>
  );
}
