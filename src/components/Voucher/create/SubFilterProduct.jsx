import React, { useEffect, useState } from "react";

const SubFilterProduct = ({
	items = [],
	selectedItems = [],
	onSelectionChange,
}) => {
	const [filteredItems, setFilteredItems] = useState(items);
	const isSelected = item => selectedItems.includes(item.id);

	const onSearch = e => {
		const searchValue = e.target.value.toLowerCase();
		const filteredItems = items.filter(item => {
			if (Array.isArray(item.value)) {
				return item.value.some(value =>
					value.toLowerCase().includes(searchValue)
				);
			}
			return item.value.toLowerCase().includes(searchValue);
		});
		setFilteredItems(filteredItems);
	};

	return (
		<div className="flex flex-col w-[194px] bg-white rounded-lg shadow-sm border border-stone-300">
			<div className="flex gap-2 items-center relative px-2.5 py-2">
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/e27ce16bc4de25bdea1f8f396161856368806b1dc3a9f954f2988032191eee94?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
					alt=""
					className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square absolute left-4 top-4"
				/>
				<input
					type="text"
					placeholder="Cari"
					onChange={onSearch}
					className="flex-1 shrink self-stretch  basis-0  pr-3 pl-7 py-2 my-auto bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] "
					aria-label="Search products"
				/>
			</div>
			{filteredItems.map(item => (
				<div
					key={item.id}
					onClick={() => onSelectionChange(item)}
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
							{item.value}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SubFilterProduct;
