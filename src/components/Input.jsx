import React, { useState } from "react";
import axios from "axios";
import { AppState } from "../context/context";

export default function Input() {
  const [input, setInput] = useState("");
  const [searchType, setSearchType] = useState("custom"); // Default to regex-based search
  const { setStudents } = AppState();

  // Regex patterns
  const regexPatterns = {
    email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
    phone: /^\+?[0-9]{10,15}$/,
    enrno: /^[a-z0-9]+-ENRNO\d+$/i,
    appno: /^[a-z0-9]+-APPNO\d+$/i,
    enNumber: /^EN\d+$/i,
    name: /^[a-z\s]+$/i,
  };

  // Tooltip messages
  const tooltips = {
    custom: "Enter email, phone, enrollment/app number, or name (comma-separated).",
    studentID: "Enter the Student ID (e.g., STU123456).",
    guardianGlobalNo: "Enter the Guardian's Global Number.",
    guardianID: "Enter the Guardian ID.",
  };

  async function validateInput(event) {
    event.preventDefault();

    if (searchType === "custom") {
      // Custom validation based on regex
      const inputs = input.split(",").map((item) => item.trim());
      const validInputs = {};

      for (const item of inputs) {
        for (const [patternName, regex] of Object.entries(regexPatterns)) {
          if (regex.test(item)) {
            if (!validInputs[patternName]) {
              validInputs[patternName] = [];
            }
            validInputs[patternName].push(item);
            break;
          }
        }
      }

      if (Object.keys(validInputs).length > 0) {
        console.log(validInputs);
        getData(validInputs);
      } else {
        alert("Invalid input");
      }
    } else {
      // Direct search with Student ID, Guardian Global No, or Guardian ID
      if (input.trim() === "") {
        alert("Please enter a valid input");
        return;
      }
      getData({ [searchType]: [input.trim()] });
    }
  }

  async function getData(input) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URL}/byENR`,
        {
          result: input,
        }
      );

      setStudents(response.data);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Student - Guardian</h2>
      <form>
        {/* Dropdown to select search type */}
        <div className="w-full flex items-center gap-2">
        <select
          id="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded w-[8rem] text-black outline-none h-full"
        >
          <option value="custom">Custom</option>
          <option value="studentID">Student ID</option>
          <option value="guardianGlobalNo">Global No</option>
          <option value="guardianID">Guardian ID</option>
        </select>

        <div className="relative w-full">
          {/* Tooltip on hover */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-3">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              title={tooltips[searchType]} // Tooltip text
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 12h.01M10 6h.01m-.01 2h.01M10 8v4"
              />
            </svg>
          </div>

          <input
            type="search"
            id="search"
            value={input}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter search term"
            required
            onChange={(e) => setInput(e.target.value)}
            title={tooltips[searchType]} // Tooltip text
          />
          <button
            type="submit"
            disabled={input.length === 0}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400"
            onClick={(e) => validateInput(e)}
          >
            Search
          </button>
        </div>

        </div>
      </form>
    </div>
  );
}
