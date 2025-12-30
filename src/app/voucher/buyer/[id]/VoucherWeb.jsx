"use client";
import Toast from "@/components/Toast/Toast";
import ChevronLeft from "@/components/Voucher/ChevronLeft";
import ChevronRight from "@/components/Voucher/ChevronRight";
import VoucherDetailModal from "@/components/Voucher/VoucherDetailModal";
import toast from "@/store/toast";
import { formatCurrency } from "@/utils/currency";
import { customFetcherBuyer } from "@/utils/customFetcher";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = async (sellerId, filterParams) => {
	return customFetcherBuyer(
		`${
			process.env.NEXT_PUBLIC_GLOBAL_API
		}v1/muatparts/voucher-buyer/${sellerId}?${new URLSearchParams(
			filterParams
		)}`,
		{
			method: "GET",
		}
	);
};

const fetcherClaimVoucher = async kode => {
	return customFetcherBuyer(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/voucher/claim-voucher`,
		{
			method: "POST",
			body: JSON.stringify({ kode }),
		}
	);
};
export const VoucherCard = ({ voucher, onClickDetail }) => {
	const { mutate } = useSWRConfig();
	const { showToast, dataToast, setShowToast, setDataToast } = toast();

	const { trigger } = useSWRMutation(
		"/voucher/claim-voucher",
		(_url, { arg }) => fetcherClaimVoucher(arg),
		{
			onSuccess: () => {
				setDataToast({
					type: "success",
					message: "Voucher berhasil diklaim",
				});
				mutate(key => Array.isArray(key) && key.includes("voucher"));
				setShowToast(true);
			},
		}
	);
	const handleClaimVoucher = () => {
		trigger(voucher.kode);
	};
	const discountValue = useMemo(() => {
		const value = voucher.discount_value;
		let valueStr =
			voucher.discount_type === "Persentase"
				? `${new Intl.NumberFormat("id-ID").format(value)}%`
				: `${formatCurrency(value, true)}`;
		return `Diskon ${valueStr}${
			voucher.is_unlimited
				? ""
				: `, maks. potongan ${formatCurrency(
						voucher.discount_max,
						true
				  )}`
		}`;
	}, [voucher]);

	const isNoQuotaLeft = useMemo(() => {
		return voucher.usageCount >= voucher.usageQuota;
	}, [voucher]);
	const isLessThenAWeek = useMemo(() => voucher.daysLeft < 7, [voucher]);
	const isLessThanADay = useMemo(() => voucher.daysLeft <= 1, [voucher]);
	const expiredText = useMemo(() => {
		if (isNoQuotaLeft) return "Kuota Habis";

		const startDate = new Date(voucher.start_date);
		const expiredDate = new Date(voucher.end_date);
		//find daysleft from start date and expired date

		const daysLeft = Math.ceil(
			(expiredDate.getTime() - startDate.getTime()) /
				(1000 * 60 * 60 * 24)
		);

		const hoursLeft = Math.ceil(
			(expiredDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
		);
		const format = new Intl.DateTimeFormat("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});

		if (daysLeft >= 7)
			return `${format.format(startDate)} - ${format.format(
				expiredDate
			)}`;
		if (daysLeft < 7) return `Berakhir Pada ${daysLeft} Hari Lagi`;

		if (daysLeft <= 1) return `Sisa ${hoursLeft} Jam Lagi`;

		if (daysLeft <= 1 && hoursLeft <= 1) return `Kurang 1 Jam Lagi`;
	}, [voucher]);

	const usagePercent = useMemo(() => {
		const max = voucher.usageQuota;
		const used = voucher.usageCount;
		const percent = (used / max) * 100;

		return percent;
	}, [voucher]);
	
	return (
		<>
			{showToast && (
				<Toast className="z-[2]" type={dataToast.type}>
					{dataToast?.message}
				</Toast>
			)}
			<div
				className={`flex flex-col flex-1 relative ${
					voucher.used_status === "available"
						? "bg-white"
						: "bg-neutral-200"
				}  rounded-md border border-solid border-neutral-200 shrink-0`}
			>
				<div className="flex relative items-start w-full px-4 pt-3 gap-2.5">
					<img
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/1aea820f672fd9b16374ba94660630d13b187ef2e718ea7fd2387bfb30067d64"
						className="object-contain size-16 rounded aspect-square"
						alt="Cashback icon"
					/>
					<div className="flex flex-col gap-2">
						<div className="text-[10px] leading-[13px] text-neutral-900 font-bold">
							{voucher.kode}
						</div>
						<ul className="list-disc pl-3 text-[8px] leading-[10.4px] text-neutral-700">
							<li>{discountValue} </li>
							<li>
								{`Min. Transaksi ${formatCurrency(
									voucher.transaction_min,
									true
								)}`}
							</li>
						</ul>
						<div className="flex flex-col gap-y-1">
							<div className="flex items-center px-0.5 h-[6px] w-[131px] bg-neutral-200 rounded-[5px] overflow-hidden">
								<div 
									className="h-1 bg-primary-700 rounded-lg"
									style={{ width: `${usagePercent}%` }}
								/>
							</div>
							<span className="font-medium text-[8px] leading-[10.4px] text-neutral-900">
								{`Terpakai ${usagePercent}%`}
							</span>
						</div>
					</div>
					<button
						type="button"
						className="self-start"
						onClick={() => onClickDetail(voucher)}
					>
						<img
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/638933f567cf43d50a95ccdebbd68824143bf283cb86333ee9c8ecab035287b9"
							alt="Info"
							className="w-full h-full"
						/>
					</button>
				</div>
				<div
					className={`mt-3.5  w-full border-t border-dashed ${
						voucher.used_status === "available"
							? "border-zinc-300"
							: "border-neutral-400"
					} relative z-100 after:block  after:h-4 after:w-4 after:bg-white after:border-r  after:rounded-full after:border-zinc-300 after:absolute after:-top-2 after:-left-2 
			before:block  before:h-4 before:w-4 before:bg-white before:border-l  before:rounded-full before:border-zinc-300 before:absolute before:-top-2 before:-right-2`}
				/>
				<div className="flex mt-3 px-4 pt-2 pb-3 w-full">
					<div
						className={`text-xs font-medium ${
							isLessThenAWeek || isNoQuotaLeft || isLessThanADay
								? "text-red-700"
								: "text-neutral-500"
						}`}
					>
						{expiredText}
					</div>
					<button
						className="text-xs font-bold ml-auto text-right text-blue-600 disabled:text-neutral-400"
						disabled={voucher.used_status === "used"}
						onClick={handleClaimVoucher}
					>
						{voucher.used_status === "used"
							? "Telah diklaim"
							: "Klaim"}
					</button>
				</div>
			</div>
		</>
	);
};
const VoucherSlider = ({ data, perPage = 5 }) => {
	const [open, setOpen] = useState(false);
	const [selectedVoucher, setSelectedVoucher] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const handleNext = () => {
		setCurrentIndex(prevIndex => (prevIndex + 1) % data?.length);
	};

	const handlePrev = () => {
		setCurrentIndex(
			prevIndex => (prevIndex - 1 + data?.length) % data?.length
		);
	};

	const handleClickDetail = voucher => {
		setSelectedVoucher(voucher);
		setOpen(true);
	};
	if (currentIndex > data?.length - perPage) {
		setCurrentIndex(0);
	}
	return (
		<>
			<div className="relative max-w-max ">
				<button
					className="z-10 absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 p-2 bg-white shadow-lg rounded-full "
					onClick={handlePrev}
				>
					<ChevronLeft />
				</button>
				<div className="flex relative gap-4  overflow-hidden scroll-m-4 snap-x">
					{data
						?.slice(currentIndex, currentIndex + perPage)
						.map(voucher => (
							<VoucherCard
								key={voucher.uuid}
								voucher={voucher}
								onClickDetail={() => handleClickDetail(voucher)}
							/>
						))}
				</div>
				<button
					className="z-10 absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 p-2 bg-white shadow-lg rounded-full "
					onClick={handleNext}
				>
					<ChevronRight />
				</button>
			</div>
			<VoucherDetailModal
				isOpen={open}
				setIsOpen={setOpen}
				id={selectedVoucher?.uuid}
			/>
		</>
	);
};

const SellerProfile = () => {
	const [filterParams, setFilterParams] = useState({
		page: 1,
		page_size: 100,
	});
	const routeParams = useParams();
	const { data } = useSWR(
		["voucher/seller/buyer", routeParams.id, filterParams],
		([_, sellerId, params]) => fetcher(sellerId, params)
	);
	return (
		<div className="p-8 ">
			<VoucherSlider data={data?.Data} />
		</div>
	);
};

export default SellerProfile;
