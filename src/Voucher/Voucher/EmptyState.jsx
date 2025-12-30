// EmptyState.jsx
import * as React from "react";
import { useRouter } from "next/navigation";

export const EmptyState = ({ type = "daftar" }) => {
	const router = useRouter();

	const getMessage = () => {
		return type === "daftar"
			? "Belum ada Voucher yang Aktif"
			: "Belum ada Riwayat Voucher";
	};

	const handleCreateVoucher = () => {
		router.push("/voucher/create");
	};

	return (
		<div className="flex flex-col justify-center items-center px-6 py-14 w-full  min-h-[280px] max-md:px-5 max-md:max-w-full ">
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-center w-24">
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/fdba7feb5431f2ee31c1437819168819b867b8d16502e38d6dd4b080ca22520c?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
						alt="Empty voucher illustration"
						className="object-contain w-full rounded-none aspect-[1.25]"
					/>
				</div>
				<div className="mt-3 text-base font-semibold leading-tight text-center text-neutral-500">
					{getMessage()}
				</div>
			</div>
			<div className="mt-3 text-xs font-medium leading-tight text-center text-neutral-500 max-md:max-w-full">
				Buat Voucher kamu sekarang!
			</div>
			<button
				onClick={handleCreateVoucher}
				className="gap-1 px-6 py-3 mt-3 text-sm font-semibold leading-tight text-white bg-blue-600 rounded-3xl min-h-[32px] min-w-[112px] max-md:px-5"
			>
				Buat Voucher
			</button>
		</div>
	);
};
