import React, { useState } from "react";
import axios from "axios";
import { AppState } from "../context/context";

export default function Input() {
	const [input, setInput] = useState("");
	const [searchType, setSearchType] = useState("custom"); // Default to regex-based search
	const { setStudents, setMissingItems, setLoading } = AppState();

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
		custom:
			"Enter email, phone, enrollment/app number, or name (comma-separated).",
		studentId: "Enter one or multiple Student IDs (comma-separated).",
		guardianGlobalNo:
			"Enter one or multiple Guardian Global Numbers (comma-separated).",
		guardianID: "Enter one or multiple Guardian IDs (comma-separated).",
	};

	async function validateInput(event) {
		event.preventDefault();

		const inputs = input
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
		if (inputs.length === 0) {
			alert("Please enter a valid input");
			return;
		}

		if (searchType === "custom") {
			// Custom validation based on regex
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
				getData(validInputs, inputs); // Pass original input terms
			} else {
				alert("Invalid input");
			}
		} else {
			// Direct search with Student ID, Guardian Global No, or Guardian ID (support multiple values)
			getData({ [searchType]: inputs });
		}
	}

	// async function getData(input) {
	// 	try {
	// 		const response = await axios.post(
	// 			`${import.meta.env.VITE_HOST_URL}/student/byENR`,
	// 			{ result: input }
	// 		);

	// 		setStudents(response.data);
	// 	} catch (error) {
	// 		alert(error.response?.data?.message || "An error occurred");
	// 		console.log(error);
	// 	}
	// }

	// Modify getData to receive full input list
	async function getData(inputObj, originalInputs = []) {
		try {
			setLoading(true);
			const response = await axios.post(
				`${import.meta.env.VITE_HOST_URL}/student/byENR`,
				{ result: inputObj }
			);

			const matchedStudents = response.data;
			setStudents(matchedStudents);

			// Flatten all student-identifiers from result
			const matchedIDs = matchedStudents.flatMap((student) => {
				const studentInfo = [
					student["Student ID"]?.toString()?.toLowerCase(),
					student["Student New ENR"]?.toLowerCase(),
					student["EduLearn Application No"]?.toLowerCase(),
					student["Student EduLearn ENR"]?.toLowerCase(),
				];

				const guardianInfo = student["Guardians"]?.flatMap((guardian) => [
					guardian["Guardian ID"]?.toString()?.toLowerCase(),
					guardian["Global No"]?.toLowerCase(),
					guardian["Email"]?.toLowerCase(),
					guardian["Mobile"]?.toLowerCase(),
				]);

				return {
					studentInfo: studentInfo.filter(Boolean),
					guardianInfo: guardianInfo?.filter(Boolean) || [],
				};
			});

			// Flatten and extract all matched IDs for comparison
			const allMatchedIDs = matchedIDs
				.flatMap(({ studentInfo, guardianInfo }) => [
					...studentInfo,
					...guardianInfo,
				])
				.filter(Boolean);

			// Find which input values didn't match any student or guardian
			const unmatched = originalInputs.filter(
				(input) => !allMatchedIDs.includes(input.toLowerCase())
			);

			setMissingItems(unmatched); // Store unmatched entries
		} catch (error) {
			alert(error.response?.data?.message || "An error occurred");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Search Student - Guardian</h2>
			<form>
				{/* Dropdown to select search type */}
				<div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
					<select
						id="searchType"
						value={searchType}
						onChange={(e) => setSearchType(e.target.value)}
						className="p-2 border rounded w-fit text-black outline-none h-full">
						<option value="custom">Custom</option>
						<option value="studentId">Student ID</option>
						<option value="guardianGlobalNo">Global No</option>
						<option value="guardianID">Guardian ID</option>
					</select>

					{/* Wrapper for tooltip and input field */}
					<div className="relative w-full group">
						{/* Tooltip (appears on hover of input or icon) */}
						<span className="absolute left-6 top-[60px] w-fit bg-gray-800 text-white text-xs p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
							{tooltips[searchType]}
						</span>

						{/* Tooltip Icon */}
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 p-1">
							<svg
								className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20">
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 12h.01M10 6h.01m-.01 2h.01M10 8v4"
								/>
							</svg>
						</div>

						<div className="flex justify-between items-center gap-1 w-full h-[3rem] px-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							{/* Search Input */}
							<input
								type="search"
								id="search"
								value={input}
								className="w-[85%] h-full text-sm bg-transparent outline-none bg-gray-50 px-1 overflow-auto dark:bg-gray-700 dark:border-gray-600"
								placeholder="Enter search term (comma-separated)"
								onChange={(e) => setInput(e.target.value)}
							/>

							{/* Search Button */}
							<button
								type="submit"
								disabled={input.trim().length === 0}
								className={`w-fit  text-white ${
									input.trim().length === 0
										? "bg-blue-400 cursor-not-allowed"
										: "bg-blue-700 hover:bg-blue-800"
								} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
								onClick={(e) => validateInput(e)}>
								Search
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
