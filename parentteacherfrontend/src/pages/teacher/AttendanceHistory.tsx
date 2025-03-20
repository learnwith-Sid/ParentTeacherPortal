import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";

const AttendanceHistory: React.FC = () => {
  useEffect(() => {
    const table = $("#attendanceHistoryTable").DataTable({
      destroy: true, // Ensures re-initialization doesn't cause an error
      responsive: true,
      initComplete: function () {
        const api = $(this).DataTable(); // Corrected 'this.api()' error
        api.columns().every(function () {
          const column = this;
          const input = document.createElement("input");
          input.setAttribute("type", "text");
          input.setAttribute("placeholder", "Search");
          $(input)
            .appendTo($(column.header()).empty())
            .on("keyup change", function () {
              if (column.search() !== (this as HTMLInputElement).value) {
                column.search((this as HTMLInputElement).value).draw();
              }
            });
        });
      },
    });

    return () => {
      table.destroy(); // Cleanup when component unmounts
    };
  }, []);

  const testData = [
    { id: 1, name: "John Doe", date: "2025-03-17", status: "Present" },
    { id: 2, name: "Jane Smith", date: "2025-03-17", status: "Absent" },
    { id: 3, name: "Michael Brown", date: "2025-03-17", status: "Present" },
    { id: 4, name: "Emily Johnson", date: "2025-03-17", status: "Present" },
    { id: 5, name: "Chris Evans", date: "2025-03-17", status: "Absent" },
  ];

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2 className="mb-4">Attendance History</h2>
            <table
              id="attendanceHistoryTable"
              className="table table-striped table-bordered"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {testData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.date}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
