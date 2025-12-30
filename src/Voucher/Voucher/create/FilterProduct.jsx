import React, { useEffect, useRef, useState } from "react";
import SubFilterProduct from "./SubFilterProduct";
import { capitalizeString } from "@/utils/string";
import { customFetcher } from "@/utils/customFetcher";
import useSWR from "swr";

const fetcher = async () => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/product/owned_filters`,
		{
			method: "GET",
		}
	);
};
const FilterProduct = ({ onFilter }) => {
	const rootRef = useRef(null);
	const [selectedItems, setSelectedItems] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [filterList, setFilterList] = useState([]);

	const { data } = useSWR("owned_filter", fetcher);

	useEffect(() => {
		if (data) {
			if (data.Data) delete data.Data.status;
			setFilterList(data.Data);
			Object.keys(data.Data).forEach(key => {
				setSelectedItems(prevState => ({
					...prevState,
					[key]: [],
				}));
			});
		}
	}, [data]);

	const handleSelectionChange = (category, selectedValues) => {
		const isSelected = selectedItems[category]?.includes(selectedValues.id);

		if (isSelected) {
			setSelectedItems(prevState => ({
				...prevState,
				[category]: prevState[category].filter(
					item => item !== selectedValues.id
				),
			}));
		} else {
			const uniqueValues = new Set(selectedItems[category]);
			uniqueValues.add(selectedValues.id);
			setSelectedItems(prevState => ({
				...prevState,
				[category]: Array.from(uniqueValues),
			}));
		}
	};

	useEffect(() => {
		onFilter(selectedItems);
	}, [selectedItems]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (rootRef.current && !rootRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [rootRef]);

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
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
				<div className="flex overflow-visible items-start text-xs font-medium leading-tight text-black bg-white rounded-md border border-solid shadow-sm border-stone-300 absolute top-full mt-1 z-50">
					<div className="flex flex-col self-stretch w-[194px]">
						{Object.entries(filterList).map(([key, items]) => (
							<div
								key={key}
								className="relative flex gap-2.5 items-center px-2.5 py-2 w-full hover:bg-zinc-50 cursor-pointer group"
							>
								<div className="flex-1">
									{capitalizeString(key)}
								</div>
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1b73b54ebb39c0dcc71b2688efdad0e1985c6635552711de916b4df9284814da"
									alt=""
									className="object-contain w-4 h-4"
								/>
								<div className="absolute left-full top-0 ml-1 hidden group-hover:block">
									<SubFilterProduct
										items={items}
										selectedItems={selectedItems[key] ?? []}
										onSelectionChange={selected =>
											handleSelectionChange(key, selected)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default FilterProduct;
