import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import "datatables.net/js/dataTables.js";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";

const MarkAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "John Doe", class: "Grade 10", status: "Present" },
    { id: 2, name: "Jane Smith", class: "Grade 9", status: "Absent" },
    { id: 3, name: "Emma Johnson", class: "Grade 10", status: "Present" },
    { id: 4, name: "Liam Brown", class: "Grade 8", status: "Present" },
    { id: 5, name: "Noah Wilson", class: "Grade 9", status: "Absent" },
    { id: 6, name: "Olivia Davis", class: "Grade 10", status: "Present" },
    { id: 7, name: "Sophia Martinez", class: "Grade 8", status: "Present" },
    { id: 8, name: "James Taylor", class: "Grade 9", status: "Absent" },
    { id: 9, name: "Benjamin Anderson", class: "Grade 10", status: "Present" },
    { id: 10, name: "Charlotte Thomas", class: "Grade 8", status: "Present" },
  ]);

  useEffect(() => {
    $("#markAttendanceTable").DataTable();
  }, []);

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2>Mark Attendance</h2>
            <table id="markAttendanceTable" className="table table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>
                      <select className="form-control">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
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

export default MarkAttendance;
