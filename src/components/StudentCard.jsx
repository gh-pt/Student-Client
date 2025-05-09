import React, { useState } from "react";
import { RiClipboardLine } from "@remixicon/react";
import { RiCheckboxCircleFill } from "@remixicon/react";

const StudentCard = ({ student }) => {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1000);
    });
  };

  const copyGuardianCredentials = () => {
    const formatted = ["Please use below credentials:"];
    const seen = new Set();

    student.Guardians.forEach((g) => {
      if (g.Email && g.Password) {
        const key = `${g.Email}:${g.Password}`;
        if (!seen.has(key)) {
          seen.add(key);
          formatted.push(`${g.Relationship}: ${g.Email} / ${g.Password}`);
        }
      }
    });

    if (formatted.length === 1) {
      formatted.push("No unique guardian credentials found.");
    }

    const text = formatted.join("\n");
    copyToClipboard(text, "Guardian Credentials");
  };

  const DOB = new Date(student["Student DOB"]);
  const formattedDOB = DOB.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");

  const academicYear = student["AY YR"] === 25 ? "2024-25" : "2025-26";

  const studentLink = `https://mdm-strapi.ampersandgroup.in/admin/content-manager/collection-types/api::ac-student.ac-student/`;
  const guardianLink = `https://mdm-strapi.ampersandgroup.in/admin/content-manager/collection-types/api::ac-guardian.ac-guardian/`;
  const yearlyDetailsLink = `https://mdm-strapi.ampersandgroup.in/admin/content-manager/collection-types/api::ac-student-yearly-detail.ac-student-yearly-detail/`;
  const studentGuardianLink = `https://mdm-strapi.ampersandgroup.in/admin/content-manager/collection-types/api::ac-student-guardian.ac-student-guardian?page=1&pageSize=10&sort=id:ASC&filters[$and][0][student_id][$eq]=`;
  const coGlobalLink = `https://mdm-strapi.ampersandgroup.in/admin/content-manager/collection-types/api::co-global-user.co-global-user?page=1&pageSize=10&sort=global_number:ASC&filters[$and][0][global_number][$eq]=`;

  const openLink = (url, params) => {
    if (!url) return;
    const fullLink = `${url}${params}`;
    window.open(fullLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full sm:max-w-[600px] mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {student["Student First Name"]} {student["Student Middle Name"]}{" "}
          {student["Student Last Name"]}
        </h2>
        <h3 className="text-md font-semibold text-gray-800 flex items-center">
          <p className="text-sm text-gray-700 mr-1">Student ID:</p>
          <p
            onClick={() => openLink(studentLink, student["Student ID"])}
            className="text-blue-500 cursor-pointer"
          >
            {student["Student ID"]}
          </p>
          <button
            className={`px-2 py-1 rounded-md text-white`}
            onClick={() => copyToClipboard(student["Student ID"], "Student ID")}
          >
            {copiedField === "Student ID" ? (
              <RiCheckboxCircleFill
                className="text-black"
                size={15}
                color="green"
              ></RiCheckboxCircleFill>
            ) : (
              <RiClipboardLine
                className="text-black"
                size={15}
              ></RiClipboardLine>
            )}
          </button>
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-gray-700 my-6">
        <p>
          <strong>School:</strong> {student["School Name"]}
        </p>
        <p>
          <strong>Academic Year:</strong> {academicYear}
        </p>
        <p>
          <strong>Grade:</strong> {student["Grade Name"]}
        </p>
        <p>
          <strong>Division:</strong> {student.Division}
        </p>
        <p>
          <strong>DOB:</strong> {formattedDOB}
        </p>
        <p>
          <strong>Board:</strong> {student["Board Name"]}
        </p>
        <p>
          <strong>Course:</strong> {student["Course Name"]}
        </p>
        <p>
          <strong>Brand:</strong> {student["Brand Name"]}
        </p>
        <p>
          <strong>Shift:</strong> {student["Shift Name"]}
        </p>
        <p>
          <strong>Stream:</strong> {student["Stream Name"]}
        </p>
        <p>
          <strong>House:</strong> {student["House"]}
        </p>
        <p>
          <strong>Student Type:</strong> {student["Student Type"]}
        </p>
        {student["Lc Type"] && (
          <p>
            <strong>LC Type:</strong> {student["Lc Type"]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          className="px-2 py-1 bg-blue-600 rounded-md"
          onClick={() => openLink(yearlyDetailsLink, student["Student ID"])}
        >
          Edit Yearly Details
        </button>
      </div>

      <div className="flex sm:items-center justify-between flex-col sm:flex-row mt-2">
        {[
          "Student EduLearn ENR",
          "EduLearn Application No",
          "Student New ENR",
        ].map((field, index) => (
          <div key={index} className="text-sm font-semibold text-gray-700">
            <p className="text-sm text-gray-500 mr-2">
              {field
                .replace("Student EduLearn ", "Old ")
                .replace("Student ", "")
                .replace("EduLearn ", "")}
              :
            </p>
            <div className="flex items-center justify-between">
              <p>{student[field]}</p>
              <button
                className={`px-2 py-1 rounded-md text-white`}
                onClick={() => copyToClipboard(student[field], field)}
              >
                {copiedField === field ? (
                  <RiCheckboxCircleFill
                    className="text-black"
                    size={15}
                    color="green"
                  ></RiCheckboxCircleFill>
                ) : (
                  <RiClipboardLine
                    className="text-black"
                    size={15}
                  ></RiClipboardLine>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3
            className="text-lg font-semibold text-blue-500 hover:cursor-pointer"
            onClick={() => openLink(studentGuardianLink, student["Student ID"])}
          >
            Guardians:
          </h3>
          <button
            onClick={copyGuardianCredentials}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            {copiedField === "Guardian Credentials" ? (
              <RiCheckboxCircleFill className="text-white" size={16} />
            ) : (
              <RiClipboardLine className="text-white" size={16} />
            )}
            Copy Credentials
          </button>
        </div>
        {student.Guardians.map((guardian, index) => (
          <div
            key={index}
            className={`mt-2 p-3 rounded-md shadow-sm text-gray-800 ${
              guardian.Relationship === "Father"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100"
            }`}
          >
            <h2
              className={`text-sm font-bold mb-1 border border-black inline-block px-1 py-0.5 rounded-md ${
                guardian.Relationship === "Father"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {guardian.Relationship}
            </h2>
            <div className={`flex items-center justify-between mb-2`}>
              <h3 className="text-md font-medium text-gray-800">
                <p className="text-sm text-gray-500">Full name:</p>
                {guardian["First Name"]} {guardian["Middle Name"]}{" "}
                {guardian["Last Name"]}
              </h3>
              <h4 className="text-md font-semibold">
                <p className="text-sm text-gray-500">Guardian ID:</p>
                <p
                  onClick={() =>
                    openLink(guardianLink, guardian["Guardian ID"])
                  }
                  className="text-blue-500 cursor-pointer inline-block"
                >
                  {guardian["Guardian ID"]}
                </p>
                <button
                  className={`px-2 py-1 rounded-md text-white`}
                  onClick={() =>
                    copyToClipboard(
                      guardian["Guardian ID"],
                      `Gaurdian ID - ${index}`
                    )
                  }
                >
                  {copiedField === `Gaurdian ID - ${index}` ? (
                    <RiCheckboxCircleFill
                      className="text-black"
                      size={15}
                      color="green"
                    ></RiCheckboxCircleFill>
                  ) : (
                    <RiClipboardLine
                      className="text-black"
                      size={15}
                    ></RiClipboardLine>
                  )}
                </button>
              </h4>
              <h4 className="text-md font-semibold">
                <p className="text-sm text-gray-500">Global No:</p>
                <p
                  onClick={() => openLink(coGlobalLink, guardian["Global No"])}
                  className="text-blue-500 cursor-pointer inline-block"
                >
                  {guardian["Global No"]}
                </p>
                <button
                  className={`px-1 py-1 rounded-md text-white`}
                  onClick={() =>
                    copyToClipboard(
                      guardian["Global No"],
                      `Global No - ${index}`
                    )
                  }
                >
                  {copiedField === `Global No - ${index}` ? (
                    <RiCheckboxCircleFill
                      className="text-black"
                      size={15}
                      color="green"
                    ></RiCheckboxCircleFill>
                  ) : (
                    <RiClipboardLine
                      className="text-black"
                      size={15}
                    ></RiClipboardLine>
                  )}
                </button>
              </h4>
            </div>
            {["Mobile", "Email", "Password"].map((field, idx) => (
              <p key={idx} className="text-sm flex items-center">
                <span className="text-gray-500 mr-2">{field}:</span>
                {guardian[field]}
                <button
                  className={`ml-2 px-2 py-1 rounded-md text-white`}
                  onClick={() =>
                    copyToClipboard(guardian[field], `${field}-${index}`)
                  }
                >
                  {copiedField === `${field}-${index}` ? (
                    <RiCheckboxCircleFill
                      className="text-black"
                      size={15}
                      color="green"
                    ></RiCheckboxCircleFill>
                  ) : (
                    <RiClipboardLine
                      className="text-black"
                      size={15}
                    ></RiClipboardLine>
                  )}
                </button>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCard;
