import React from "react";

const ShimmerEffect = ({ className }) => (
	<div
		className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}></div>
);

const StudentCardShimmer = () => (
	<div className="w-full sm:w-[500px] border border-gray-200 rounded-lg p-4 shadow">
		{/* Header */}
		<div className="flex justify-between items-center mb-3">
			<ShimmerEffect className="h-6 w-3/4 rounded" />
			<ShimmerEffect className="h-6 w-8 rounded-full" />
		</div>

		{/* Student Info */}
		<div className="mb-3">
			<ShimmerEffect className="h-4 w-full mb-2 rounded" />
			<ShimmerEffect className="h-4 w-3/4 mb-2 rounded" />
			<ShimmerEffect className="h-4 w-1/2 rounded" />
		</div>

		{/* Divider */}
		<div className="border-t border-gray-200 my-2"></div>

		{/* Guardian Info */}
		<div className="mb-2">
			<ShimmerEffect className="h-5 w-1/3 mb-2 rounded" />
			<ShimmerEffect className="h-4 w-full mb-2 rounded" />
			<ShimmerEffect className="h-4 w-3/4 mb-2 rounded" />
			<ShimmerEffect className="h-4 w-1/2 rounded" />
		</div>

		{/* Divider */}
		<div className="border-t border-gray-200 my-2"></div>

		{/* Additional Info */}
		<div>
			<ShimmerEffect className="h-5 w-1/3 mb-2 rounded" />
			<ShimmerEffect className="h-4 w-full mb-2 rounded" />
			<ShimmerEffect className="h-4 w-2/3 rounded" />
		</div>
	</div>
);

const StudentListShimmer = () => {
	return (
		<div className="p-4 w-full">
			{/* Shimmer for Select Data Section */}
			<div className="mb-2">
				<ShimmerEffect className="h-4 w-40 mb-2 rounded" />
				<ShimmerEffect className="h-10 w-full mb-4 rounded" />
			</div>

			{/* Shimmer for Export Button */}
			<div className="mb-6">
				<div className="w-full flex justify-end mb-4">
					<ShimmerEffect className="h-10 w-40 rounded" />
				</div>
			</div>

			{/* Shimmer Cards Grid */}
			<div className="flex flex-wrap gap-4">
				{[...Array(6)].map((_, index) => (
					<StudentCardShimmer key={index} />
				))}
			</div>
		</div>
	);
};

export default StudentListShimmer;
