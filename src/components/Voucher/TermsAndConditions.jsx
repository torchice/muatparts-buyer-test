import { formatCurrency } from "@/utils/currency";
import { useMemo } from "react";

export default function TermsAndConditions({ voucher }) {
	const terms = useMemo(() => {
		if (!voucher) return [];

		const discountValue =
			voucher.discountType === "Persentase"
				? `${new Intl.NumberFormat("id-ID").format(
						voucher.discountValue
				  )}%`
				: `${formatCurrency(voucher.discountValue, true)}`;
		const tnc = [
			`Dapatkan diskon ${discountValue} ${
				voucher.isUnlimited
					? ""
					: ` sampai dengan ${formatCurrency(
							voucher.discountMax,
							true
					  )}`
			}`,

			`Berlaku hanya di Toko ${voucher.store_name}`,
			`Minimum belanja ${formatCurrency(
				voucher?.transactionMin,
				true
			)} untuk menggunakan voucher ini`,
			`1 voucher berlaku untuk ${voucher.user_limit} kali transaksi selama periode voucher`,
			`Voucher tidak dapat digunakan selain di toko ${voucher.store_name}`,
			"⁠Voucher berlaku di Muatparts",
		];

		return tnc;
	}, [voucher]);

	return (
		<div className="flex flex-col mt-4 w-full  gap-y-[15px]">
			<div className=" shrink gap-2  w-full font-semibold text-[14px] leading-[16.8px] text-ellipsis">
				Syarat Dan Ketentuan
			</div>
			<div className="w-full">
				<ol className="list-decimal list-inside">
					{terms.map((term, index) => (
						<li
							className="text-[14px] leading-[16.8px]"
							key={index}
						>
							{term}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
