import React, { useEffect, useState } from "react";
import StudentCard from "./StudentCard";

const StudentList = ({ students }) => {
  return (
    <div className="flex items-center sm:flex-row flex-col gap-4 p-4 flex-wrap">
      {students.map((student) => (
        <StudentCard key={student["Student ID"]} student={student} />
      ))}
    </div>
  );
};

export default StudentList;
