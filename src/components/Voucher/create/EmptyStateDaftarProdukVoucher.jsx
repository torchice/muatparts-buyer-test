import * as React from "react";

export function EmptyStateDaftarProdukVoucher({ onPilihProduk }) {
	return (
		<div className="flex flex-col justify-center self-stretch px-6 py-5 font-semibold leading-tight rounded-xl border border-solid bg-slate-50 border-stone-300 w-full text-neutral-500 max-md:px-5">
			<div className="flex flex-col items-center w-full max-md:max-w-full">
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/12299468b8bc62a6309c019118c85badfb4b05ffe8c50bae21f9358d81302213?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
					className="object-contain rounded-none aspect-[1.26] w-[93px]"
					alt="Empty product illustration"
					width={93}
					height={74}
				/>
				<div className="self-stretch mt-3 text-base text-center max-md:max-w-full">
					Kamu belum memilih produk untuk Voucher ini
				</div>
				<div className="mt-3 text-xs font-medium text-center">
					Pilih produkmu terlebih dahulu
				</div>
				<button
					className="gap-1 px-[24px] pb-[12px] pt-[9px] mt-3 text-sm text-white bg-blue-600 rounded-3xl h-[32px] w-[126px] max-md:px-5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
					onClick={onPilihProduk}
					type="button"
					aria-label="Pilih Produk"
				>
					Pilih Produk
				</button>
			</div>
		</div>
	);
}
