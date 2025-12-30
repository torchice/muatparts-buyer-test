import * as React from "react";

export const TabItem = ({ label, count, isActive, onClick }) => {
	return (
		<div
			className={`flex flex-col justify-center items-center cursor-pointer ${
				isActive
					? "font-bold text-blue-600 border-b-2 border-solid border-b-blue-600"
					: "font-semibold text-black"
			} min-h-[40px]`}
			onClick={onClick}
		>
			<div className="flex gap-1 justify-center items-center px-6 min-h-[14px] max-md:px-5">
				<div className="self-stretch my-auto">{label}</div>
				{count && <div className="self-stretch my-auto">({count})</div>}
			</div>
		</div>
	);
};
