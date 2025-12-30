import React, { useState, useRef, useEffect } from "react";
import SubFilterMenu from "./SubFilterMenu";

const FilterDropdown = ({ selectedItems, onSelectionChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoveredItem, setHoveredItem] = useState(null);

	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				!buttonRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const menuItems = [
		{
			label: "Jenis Voucher",
			key: "voucher_type",
			items: [
				{
					label: "Diskon Produk",
					key: "diskon",
					value: "Diskon Produk",
				},
				{
					label: "Biaya Pengiriman",
					key: "pengiriman",
					value: "Biaya Pengiriman",
				},
			],
		},
		{
			label: "Target Voucher",
			key: "target",
			items: [
				{
					label: "Publik",
					key: "publik",
					value: "Publik",
				},
				{
					label: "Terbatas",
					key: "terbatas",
					value: "Terbatas",
				},
			],
		},
		{
			label: "Produk",
			key: "product",
			items: [
				{
					label: "Semua Produk",
					key: "semua_produk",
					value: 1,
				},
				{
					label: "Produk Tertentu",
					key: "produk_tertentu",
					value: 0,
				},
			],
		},
	];

	const handleMouseEnter = label => {
		setHoveredItem(label);
	};

	const handleMouseLeave = () => {
		setHoveredItem(null);
	};

	const handleSelectionChange = (category, selectedValues) => {
		onSelectionChange(category, selectedValues);
	};

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				className="flex gap-2 px-3 py-2 border border-neutral-500 rounded-md w-[104px]"
			>
				<span className="flex text-xs w-[56px] items-center">
					Filter
				</span>
				<img
					src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/8d2e6aac8fa1c92dba6ff7ecdbf6a850ad97696124612887a95bbd87ad235c85"
					className="w-4 h-4"
					alt=""
				/>
			</button>

			{isOpen && (
				<div
					ref={dropdownRef}
					className="flex overflow-visible items-start text-xs font-medium leading-tight text-black bg-white rounded-md border border-solid shadow-sm border-stone-300 absolute top-full mt-1 z-50"
				>
					<div className="flex flex-col self-stretch w-[194px]">
						{menuItems.map(item => (
							<div
								key={item.label}
								className="relative flex gap-2.5 items-center px-2.5 py-2 w-full hover:bg-zinc-50 cursor-pointer"
								onMouseEnter={() =>
									handleMouseEnter(item.label)
								}
								onMouseLeave={handleMouseLeave}
							>
								<div className="flex-1">{item.label}</div>
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1b73b54ebb39c0dcc71b2688efdad0e1985c6635552711de916b4df9284814da"
									alt=""
									className="object-contain w-4 h-4"
								/>
								{hoveredItem === item.label && (
									<div className="absolute left-full top-0 ">
										<SubFilterMenu
											items={item.items}
											selectedItems={
												selectedItems[item.key] || []
											}
											onSelectionChange={selected =>
												handleSelectionChange(
													item.key,
													selected
												)
											}
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default FilterDropdown;
