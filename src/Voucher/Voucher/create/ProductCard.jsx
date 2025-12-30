import * as React from "react";

export default function ProductCard({
	Photo,
	Name,
	SKU,
	Brand,
	MaxPrice,
	Stock,
	onDelete,
}) {
	return (
		<div className="flex flex-wrap gap-[20px] items-start py-5 w-full border-b border-solid border-b-stone-300 max-md:max-w-full">
			<img
				loading="lazy"
				src={Photo}
				alt={`Product image for ${Name}`}
				className="object-contain shrink-0 w-[56px] h-[56px] rounded aspect-square"
			/>
			<div className="flex flex-col grow shrink justify-center py-1 min-w-[240px] max-w-[312px]">
				<div className="text-xs font-bold leading-4">{Name}</div>
				<div className="mt-3">SKU : {SKU}</div>
				<div className="mt-3">Brand : {Brand}</div>
			</div>
			<div className="flex shrink gap-2.5 items-start py-1 whitespace-nowrap w-[190px]">
				<div className="gap-1 self-stretch w-[168px]">
					{new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
						maximumFractionDigits: 0,
					}).format(MaxPrice)}
				</div>
			</div>
			<div className="flex-wrap flex-1 grow shrink gap-2 self-stretch py-1 whitespace-nowrap min-h-[15px] max-w-[178px]">
				{Stock}
			</div>
			<button
				onClick={onDelete}
				className="gap-1 self-stretch px-6 py-1.5 text-sm font-semibold leading-tight text-red-500 whitespace-nowrap bg-white rounded-3xl border border-red-500 border-solid max-h-[32px] min-w-[112px] max-md:px-5"
			>
				Hapus
			</button>
		</div>
	);
}
