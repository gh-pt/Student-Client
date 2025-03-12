import React, { useState } from "react";
import axios from "axios";
import { AppState } from "../context/context";

export default function Input() {
  const [input, setInput] = useState("");
  const { setStudents } = AppState();

  async function validateInput(event) {
    event.preventDefault();

    // Case-insensitive Regex patterns
    const regexPatterns = {
      email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      phone: /^\+?[0-9]{10,15}$/,
      enrno: /^[a-z0-9]+-ENRNO\d+$/i,
      appno: /^[a-z0-9]+-APPNO\d+$/i,
      enNumber: /^EN\d+$/i,
      name: /^[a-z\s]+$/i,
    };

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
  }

  async function getData(input) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URL_LOCAL}/byENR`,
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
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            value={input}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
            onChange={(e) => setInput(e.target.value)}
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
      </form>
    </div>
  );
}
