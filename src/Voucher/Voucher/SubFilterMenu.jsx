import React from "react";

const SubFilterMenu = ({
	items = [],
	selectedItems = [],
	onSelectionChange,
}) => {
	const handleFilterClick = item => {
		const newSelected = selectedItems.includes(item.value)
			? selectedItems.filter(i => i !== item.value)
			: [...selectedItems, item.value];

		onSelectionChange(newSelected);
	};

	const isSelected = item => selectedItems.includes(item.value);

	return (
		<div className="flex flex-col w-[194px] bg-white rounded-lg shadow-sm border border-stone-300">
			{items.map(item => (
				<div
					key={item.key}
					onClick={() => handleFilterClick(item)}
					className={`flex flex-col justify-center items-start px-2.5 py-2 w-full cursor-pointer transition-colors duration-200 ease-in-out hover:bg-zinc-50 ${
						isSelected(item) ? "bg-zinc-100" : ""
					}`}
				>
					<div className="flex gap-2 items-center w-full">
						<div className="flex flex-col self-stretch my-auto w-4">
							<div
								className={`flex shrink-0 w-4 h-4 rounded border border-solid ${
									isSelected(item)
										? "border-blue-500 bg-blue-500"
										: "border-neutral-500"
								}`}
							>
								{isSelected(item) && (
									<svg
										className="w-3 h-3 m-auto text-white"
										viewBox="0 0 12 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M10 3L4.5 8.5L2 6"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</div>
						</div>
						<div className="self-stretch my-auto text-xs font-medium leading-tight text-black">
							{item.label}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SubFilterMenu;
