import React, { useState } from "react";
import StudentCard from "./StudentCard";
import { RiClipboardLine, RiCheckboxCircleFill } from "@remixicon/react";

const StudentList = ({ students }) => {
	const [selectedOption, setSelectedOption] = useState("studentID");
	const [filteredData, setFilteredData] = useState([]);
	const [copied, setCopied] = useState(false);

	// Handle dropdown change
	const handleSelection = (event) => {
		const value = event.target.value;
		setSelectedOption(value);
		generateFilteredArray(value);
	};

	// Generate filtered array based on selected option
	const generateFilteredArray = (option) => {
		let extractedData = [];

		students.forEach((student) => {
			if (option === "studentID") {
				extractedData.push(student["Student ID"]);
			} else if (option === "guardianID") {
				student.Guardians.forEach((guardian) => {
					extractedData.push(guardian["Guardian ID"]);
				});
			} else if (option === "globalNo") {
				student.Guardians.forEach((guardian) => {
					extractedData.push(guardian["Global No"]);
				});
			}
		});

		setFilteredData(extractedData);
	};

	// Copy extracted data to clipboard
	const copyToClipboard = () => {
		if (filteredData.length > 0) {
			const textToCopy = filteredData.join(", ");
			navigator.clipboard.writeText(textToCopy).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			});
		}
	};

	return (
		<div className="p-4">
			{/* Dropdown for selecting filter option */}
			<label
				htmlFor="searchType"
				className="block mb-2 text-sm font-medium text-gray-500">
				Select Data to Extract
			</label>
			<select
				id="searchType"
				value={selectedOption}
				onChange={handleSelection}
				className="mb-4 p-2 border rounded w-full text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
				<option value="studentID">Student ID</option>
				<option value="guardianID">Guardian ID</option>
				<option value="globalNo">Global No</option>
			</select>

			{/* Display extracted data */}
			{filteredData.length > 0 && (
				<div className="mb-4 p-4 bg-blue-100 h-[10rem] border border-blue-300 rounded-lg overflow-y-auto relative">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-lg font-semibold text-blue-800">
							Extracted {selectedOption.replace(/ID|No/, " ID/No")}:
						</h3>
						{/* Copy Button */}
						<button
							onClick={copyToClipboard}
							className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400">
							{copied ? (
								<>
									<RiCheckboxCircleFill size={16} className="mr-1 text-white" />
									Copied!
								</>
							) : (
								<>
									<RiClipboardLine size={16} className="mr-1 text-white" />
									Copy
								</>
							)}
						</button>
					</div>
					<ul className="list-disc ml-5 text-blue-700">
						{filteredData.map((item, index) => (
							<li key={index} className="text-md font-medium">
								{item}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Render Student Cards */}
			<div className="flex items-center sm:flex-row flex-col gap-2 flex-wrap">
				{students.map((student) => (
					<StudentCard key={student["Student ID"]} student={student} />
				))}
			</div>
		</div>
	);
};

export default StudentList;
