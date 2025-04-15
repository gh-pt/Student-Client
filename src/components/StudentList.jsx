import React, { useState, useEffect, useRef } from "react";
import StudentCard from "./StudentCard";
import axios from "axios";

const StudentList = ({ students }) => {
	const [selectedOption, setSelectedOption] = useState("studentID");
	const [filteredData, setFilteredData] = useState([]);
	const [copied, setCopied] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState({
		json: null,
		excel: null,
	});

	const jsonInputRef = useRef(null);
	const excelInputRef = useRef(null);

	useEffect(() => {
		fetchSelectedFiles();
	}, []);

	const fetchSelectedFiles = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_HOST_URL}/file/selected-files`
			);
			const { json, excel } = response.data;

			setSelectedFiles({
				json: json ? { name: json, type: "json" } : null,
				excel: excel ? { name: excel, type: "excel" } : null,
			});
		} catch (error) {
			console.error("Failed to fetch selected files:", error);
		}
	};

	const handleSelection = (event) => {
		const value = event.target.value;
		setSelectedOption(value);
		generateFilteredArray(value);
	};

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

	const copyToClipboard = () => {
		if (filteredData.length > 0) {
			const textToCopy = filteredData.join(", ");
			navigator.clipboard.writeText(textToCopy).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			});
		}
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_HOST_URL}/file/upload`,
				formData
			);
			const fileType = response.data.type;

			if (fileType === "json" || fileType === "excel") {
				setSelectedFiles((prev) => ({
					...prev,
					[fileType]: {
						name: file.name,
						type: fileType,
					},
				}));
			}

			// Clear only the relevant input field
			if (fileType === "json") {
				jsonInputRef.current.value = "";
			} else if (fileType === "excel") {
				excelInputRef.current.value = "";
			}

			// ✅ Don't call fetchSelectedFiles here — trust local state
		} catch (error) {
			console.error("Upload failed", error);
			alert("File upload failed. Please try again.");
		}
	};

	const exportStudentData = async (type) => {
		if (!selectedFiles[type]) {
			alert(`Please upload a ${type.toUpperCase()} file first.`);
			return;
		}

		const exportData = students.map((student) => ({
			"Student ID": student["Student ID"],
			"APPN NO.": student["EduLearn Application No"],
			"Edulearn ENR No.": student["Student EduLearn ENR"],
			"ENR No.": student["Student New ENR"],
			Board: student["Board Name"],
			Course: student["Course Name"],
			"Academic Year": student["AY YR"] === 25 ? "2024-25" : "2025-26",
			Grade: student["Grade Name"],
			Stream: student["Stream Name"],
			Shift: student["Shift Name"],
			"School Name": student["School Name"],
		}));

		try {
			await axios.post(`${import.meta.env.VITE_HOST_URL}/file/update-${type}`, {
				newData: exportData,
			});
			alert(`Data exported to ${type.toUpperCase()} successfully!`);
		} catch (error) {
			console.error("Failed to export data:", error);
			alert("Failed to export data. Please check if the file is valid.");
		}
	};

	const downloadUpdatedFile = async (type) => {
		if (!selectedFiles[type]) {
			alert(`No ${type.toUpperCase()} file to download`);
			return;
		}

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_HOST_URL}/file/download/${type}`,
				{
					responseType: "blob",
				}
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", selectedFiles[type].name);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error("Download failed:", error);
			alert("Failed to download file. Please try again.");
		}
	};

	const handleFileDeselect = async (type) => {
		try {
			await axios.post(`${import.meta.env.VITE_HOST_URL}/file/deselect`, {
				type,
			});
			setSelectedFiles((prev) => ({
				...prev,
				[type]: null,
			}));
			// Clear input on deselect
			if (type === "json") {
				jsonInputRef.current.value = "";
			} else if (type === "excel") {
				excelInputRef.current.value = "";
			}
		} catch (error) {
			console.error("Failed to deselect file:", error);
			alert("Failed to remove file selection. Please try again.");
		}
	};

	return (
		<div className="p-4 w-full">
			<label className="block mb-2 text-sm font-medium text-gray-500">
				Select Data to Extract
			</label>
			<select
				value={selectedOption}
				onChange={handleSelection}
				className="mb-4 p-2 border rounded w-full bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
				<option value="studentID">Student ID</option>
				<option value="guardianID">Guardian ID</option>
				<option value="globalNo">Global No</option>
			</select>

			{filteredData.length > 0 && (
				<div className="mb-4 p-4 bg-blue-100 h-[10rem] border border-blue-300 rounded-lg overflow-y-auto relative">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-lg font-semibold text-blue-800">
							Extracted {selectedOption.replace(/ID|No/, " ID/No")}:
						</h3>
						<button
							onClick={copyToClipboard}
							className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
							{copied ? "Copied!" : "Copy"}
						</button>
					</div>
					<ul className="list-disc ml-5 text-blue-700">
						{filteredData.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>
			)}

			<div className="mb-4 space-y-3">
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium text-gray-500">
						Upload File
					</label>
					<div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
						<div className="sm:w-[50%]">
							<label className="block text-xs text-gray-500 mb-1">
								JSON File:
							</label>
							<input
								type="file"
								accept=".json"
								ref={jsonInputRef}
								onChange={handleFileUpload}
								className="p-2 border rounded w-full"
							/>
						</div>
						<div className="sm:w-[50%]">
							<label className="block text-xs text-gray-500 mb-1">
								Excel File:
							</label>
							<input
								type="file"
								accept=".xlsx, .xls"
								ref={excelInputRef}
								onChange={handleFileUpload}
								className="p-2 border rounded w-full"
							/>
						</div>
					</div>

					{(selectedFiles.json || selectedFiles.excel) && (
						<div className="p-2 bg-green-50 border border-green-200 rounded space-y-1">
							{["json", "excel"].map((type) => {
								const file = selectedFiles[type];
								return (
									file && (
										<div
											key={type}
											className="flex items-center justify-between text-sm text-green-700">
											<p>
												{type.toUpperCase()} File:{" "}
												<span className="font-medium">{file.name}</span>
											</p>
											<button
												onClick={() => handleFileDeselect(type)}
												className="ml-2 text-red-600 hover:underline text-xs">
												Remove
											</button>
										</div>
									)
								);
							})}
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-wrap gap-3 mb-6">
				{["json", "excel"].map((type) => (
					<div key={type} className="flex flex-col gap-2">
						<button
							onClick={() => exportStudentData(type)}
							disabled={!selectedFiles[type]}
							className={`${
								!selectedFiles[type]
									? "bg-gray-400 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700"
							} text-white px-4 py-2 rounded transition`}>
							Export to {type.toUpperCase()}
						</button>
						<button
							onClick={() => downloadUpdatedFile(type)}
							disabled={!selectedFiles[type]}
							className={`${
								!selectedFiles[type]
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700"
							} text-white px-4 py-2 rounded transition`}>
							Download {type.toUpperCase()}
						</button>
					</div>
				))}
			</div>

			<div className="flex flex-wrap gap-4">
				{students.map((student) => (
					<StudentCard key={student["Student ID"]} student={student} />
				))}
			</div>
		</div>
	);
};

export default StudentList;
