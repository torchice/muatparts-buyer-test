import * as React from "react";
import FilterProduct from "./FilterProduct";

export default function SearchFilter({ onSearch, onFilter }) {

	
	return (
		<div className="flex gap-3 items-center self-stretch my-auto text-xs font-medium min-w-[240px] text-neutral-500">
			<div className="flex gap-3 items-center self-stretch my-auto min-w-[240px]">
				<div className="flex gap-2 items-center self-stretch px-3 py-2 my-auto bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] min-w-[240px] w-[262px]">
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/e27ce16bc4de25bdea1f8f396161856368806b1dc3a9f954f2988032191eee94?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
						alt=""
						className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
					/>
					<input
						type="text"
						placeholder="Cari nama produk/SKU"
						onChange={onSearch}
						className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none"
						aria-label="Search products"
					/>
				</div>
				<FilterProduct onFilter={onFilter} />
			</div>
		</div>
	);
}
