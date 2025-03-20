// ViewAssignments.tsx - Student View Assignments Page
import React, { useEffect, useState } from "react";
import { getAssignments } from "../../services/api";

const ViewAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>Loading assignments...</p>;

  return (
    <div className="container mt-4">
      <h2>Assignments</h2>
      <ul className="list-group">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="list-group-item">
            <strong>{assignment.title}</strong> - Due: {assignment.dueDate}
            <p>{assignment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAssignments;
