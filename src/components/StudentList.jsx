import React, { useState } from "react";
import StudentCard from "./StudentCard";
import axios from "axios";

const StudentList = ({ students, missingItems }) => {
	const [selectedOption, setSelectedOption] = useState("studentID");
	const [filteredData, setFilteredData] = useState([]);
	const [copied, setCopied] = useState(false);
	const [exportType, setExportType] = useState("credentials");
	const [isDownloading, setIsDownloading] = useState(null);
	const [downloadStatus, setDownloadStatus] = useState(null);
	const [customFilename, setCustomFilename] = useState("");
	const [showExportOptions, setShowExportOptions] = useState(false);
	const [showExtracted, setShowExtracted] = useState(true);

	const handleSelection = (event) => {
		setShowExtracted(true);
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

	const prepareCredentialData = () => {
		return students.map((student) => {
			const father =
				student.Guardians.find((g) => g.Relationship === "Father") || {};
			const mother =
				student.Guardians.find((g) => g.Relationship === "Mother") || {};

			return {
				"Student First Name": student["Student First Name"] || "",
				"Student Last Name": student["Student Last Name"] || "",
				"Student Enrollment No": student["Student New ENR"] || "",
				"Father Email": father.Email || "",
				"Father Password": father.Password || "",
				"Mother Email": mother.Email || "",
				"Mother Password": mother.Password || "",
			};
		});
	};

	const prepareAcademicData = () => {
		return students.map((student) => ({
			"Student ID": student["Student ID"] || "",
			"APPN NO.": student["EduLearn Application No"] || "",
			"Edulearn ENR No.": student["Student EduLearn ENR"] || "",
			"ENR No.": student["Student New ENR"] || "",
			"Student Name": `${student["Student First Name"] || ""} ${
				student["Student Last Name"] || ""
			}`.trim(),
			Board: student["Board Name"] || "",
			Course: student["Course Name"] || "",
			"Academic Year": student["AY YR"] === 25 ? "2024-25" : "2025-26",
			Grade: student["Grade Name"] || "",
			Stream: student["Stream Name"] || "",
			Shift: student["Shift Name"] || "",
			"School Name": student["School Name"] || "",
			Division: student.Division || "",
			House: student["House"] || "",
			"Student Type": student["Student Type"] || "",
		}));
	};

	const prepareGradeData = () => {
		return students.map((student) => ({
			"Student ID": student["Student ID"] || "",
			"APPN NO.": student["EduLearn Application No"] || "",
			"Edulearn ENR No.": student["Student EduLearn ENR"] || "",
			"ENR No.": student["Student New ENR"] || "",
			Board: student["Board Name"] || "",
			Course: student["Course Name"] || "",
			"Academic Year": student["AY YR"] === 25 ? "2024-25" : "2025-26",
			Grade: student["Grade Name"] || "",
			Stream: student["Stream Name"] || "",
			Shift: student["Shift Name"] || "",
			"School Name": student["School Name"] || "",
		}));
	};

	const prepareBoardData = () => {
		return students.map((student) => ({
			"Student ID": student["Student ID"] || "",
			"Academic Year": student["AY YR"] === 25 ? "2024-25" : "2025-26",
			Schoolname: student["School Name"] || "",
			"Student Name": `${student["Student First Name"] || ""} ${
				student["Student Last Name"] || ""
			}`.trim(),
			"Application no": student["EduLearn Application No"] || "",
			"Enrollment No": student["Student New ENR"] || "",
			Board: student["Board Name"] || "",
			Grade: student["Grade Name"] || "",
		}));
	};

	const directDownload = async (type) => {
		try {
			setIsDownloading(type);
			// const exportData =
			// 	exportType === "credentials"
			// 		? prepareCredentialData()
			// 		: prepareAcademicData();

			let exportData;

			if (exportType === "credentials") {
				exportData = prepareCredentialData();
			} else if (exportType === "academic") {
				exportData = prepareAcademicData();
			} else if (exportType === "grade") {
				exportData = prepareGradeData();
			} else {
				exportData = prepareBoardData();
			}

			const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
			const prefix =
				exportType === "credentials"
					? "student_parent_credentials"
					: "student_academic_info";
			const filename = customFilename.trim() || `${prefix}_${timestamp}`;

			const response = await axios.post(
				`${import.meta.env.VITE_HOST_URL}/file/generate-download`,
				{
					type,
					filename,
					data: exportData,
				},
				{ responseType: "blob" }
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`${filename}.${type === "json" ? "json" : "xlsx"}`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();

			setDownloadStatus({
				success: true,
				message: `${type.toUpperCase()} file downloaded successfully!`,
			});

			setShowExportOptions(false);
		} catch (error) {
			console.error("Download failed:", error);
			setDownloadStatus({
				success: false,
				message: `Failed to download ${type.toUpperCase()} file.`,
			});
		} finally {
			setIsDownloading(null);
			setTimeout(() => setDownloadStatus(null), 3000);
		}
	};

	return (
		<div className="p-4 w-full">
			{/* Extract Data Section */}
			{students.length > 0 && (
				<div className="mb-2">
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

					{filteredData.length > 0 && showExtracted && (
						<div className="mb-4 p-3 bg-blue-100 h-[10rem] border border-blue-300 rounded-lg overflow-hidden relative">
							<div className="flex justify-between items-center mb-1 pr-6">
								<h3 className="text-lg font-semibold text-blue-800">
									Extracted {selectedOption.replace(/ID|No/, " ID/No")}:
								</h3>
								{/* Close Button */}
								<button
									onClick={() => setShowExtracted(false)}
									className="absolute top-3 right-4 text-blue-600 hover:text-red-500 font-bold text-2xl">
									&times;
								</button>
							</div>
							{/* Display extracted data */}
							<div className="w-full flex justify-between items-center gap-2 ">
								<div className="w-[90%] overflow-auto h-[6rem] scrollbar-none">
									<ul className="list-disc ml-5 text-blue-700">
										{filteredData.map((item, index) => (
											<li key={index}>{item}</li>
										))}
									</ul>
								</div>
								<button
									onClick={copyToClipboard}
									className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 absolute right-4 bottom-4">
									{copied ? "Copied!" : "Copy"}
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Export Button */}
			{students.length > 0 && (
				<div className="mb-6">
					<div className="w-full flex justify-end mb-4">
						<button
							onClick={() => setShowExportOptions(true)}
							className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ">
							Export Student Data
						</button>
					</div>

					{showExportOptions && (
						<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
							<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl relative">
								{/* Close Button */}
								<button
									onClick={() => setShowExportOptions(false)}
									className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold">
									&times;
								</button>

								<h3 className="text-lg font-semibold text-gray-800 mb-3">
									Export Options
								</h3>

								<div className="flex flex-col gap-3 mb-4">
									{/* Radio Buttons */}
									<div className="flex gap-4 text-sm">
										<label className="inline-flex items-center">
											<input
												type="radio"
												value="credentials"
												checked={exportType === "credentials"}
												onChange={() => setExportType("credentials")}
												className="form-radio h-5 w-5 text-blue-600"
											/>
											<span className="ml-2 text-gray-700">Credentials</span>
										</label>
										<label className="inline-flex items-center">
											<input
												type="radio"
												value="academic"
												checked={exportType === "academic"}
												onChange={() => setExportType("academic")}
												className="form-radio h-5 w-5 text-blue-600"
											/>
											<span className="ml-2 text-gray-700">Academic Info</span>
										</label>
										<label className="inline-flex items-center">
											<input
												type="radio"
												value="grade"
												checked={exportType === "grade"}
												onChange={() => setExportType("grade")}
												className="form-radio h-5 w-5 text-blue-600"
											/>
											<span className="ml-2 text-gray-700">Grade Change</span>
										</label>
										<label className="inline-flex items-center">
											<input
												type="radio"
												value="board"
												checked={exportType === "board"}
												onChange={() => setExportType("board")}
												className="form-radio h-5 w-5 text-blue-600"
											/>
											<span className="ml-2 text-gray-700">Board Change</span>
										</label>
									</div>

									{/* Custom Filename */}
									<div>
										<label className="block text-sm text-gray-600 mb-1">
											Custom Filename (optional):
										</label>
										<input
											type="text"
											value={customFilename}
											onChange={(e) => setCustomFilename(e.target.value)}
											className="p-2 border rounded w-full text-black"
											placeholder="e.g. Class10A_Students"
										/>
									</div>
								</div>

								{/* Download Buttons */}
								<div className="flex gap-4">
									{["json", "excel"].map((type) => (
										<button
											key={type}
											onClick={() => directDownload(type)}
											disabled={isDownloading !== null}
											className={`relative ${
												isDownloading === type
													? "bg-gray-500"
													: "bg-blue-600 hover:bg-blue-700"
											} text-white px-4 py-2 rounded`}>
											{isDownloading === type
												? "Downloading..."
												: `Download as ${type.toUpperCase()}`}
										</button>
									))}
								</div>

								{/* Status Message */}
								{downloadStatus && (
									<div
										className={`mt-3 p-2 rounded ${
											downloadStatus.success
												? "bg-green-100 text-green-700"
												: "bg-red-100 text-red-700"
										}`}>
										{downloadStatus.message}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Student Cards */}
			<div className="flex flex-wrap gap-4">
				{students.map((student) => (
					<StudentCard key={student["Student ID"]} student={student} />
				))}
			</div>

			{/* Missing Items Section */}
			{missingItems.length > 0 && (
				<div className="flex flex-wrap gap-4 mt-4">
					{missingItems.map((item, idx) => (
						<div
							key={idx}
							className="w-full sm:w-[300px] border border-red-400 bg-red-100 text-red-800 rounded-lg p-4 shadow">
							<h3 className="font-semibold text-lg">No Result Found</h3>
							<p className="text-sm mt-1">
								Input: <span className="font-mono">{item}</span>
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default StudentList;
