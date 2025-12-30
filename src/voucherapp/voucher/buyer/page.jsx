"use client";
import React, { useEffect, useMemo, useState } from "react";

import { customFetcherBuyer } from "@/utils/customFetcher";
import useSWR from "swr";
import { formatCurrency } from "@/utils/currency";
import VoucherDetailModal from "@/components/voucher/VoucherDetailModal";

const fetcher = async filterParams => {
	const params = new URLSearchParams(filterParams);
	return customFetcherBuyer(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/voucher-list?${params}`,
		{
			method: "GET",
		}
	);
};

function SearchBar({ onSearch, filterParams, onFilter }) {
	const handleSearch = e => {
		onSearch(e.target.value);
	};

	return (
		<div className="flex flex-wrap gap-6 items-center w-full leading-tight min-h-[32px] max-md:max-w-full">
			<div className="flex gap-6 items-center self-stretch my-auto text-xs font-medium min-w-[240px] text-neutral-500">
				<div className="flex gap-3 items-center self-stretch my-auto min-w-[240px]">
					<div className="relative flex gap-2 items-center self-stretch px-3 py-2 my-auto bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] min-w-[240px] w-[262px]">
						<label htmlFor="searchVoucher" className="sr-only">
							Cari Voucher
						</label>
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b52f595091a876b9df22f850fd737aafeae1579bac0e89ea1a6f4002d7c5ca0?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
							alt=""
							className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
						/>
						<input
							type="search"
							id="searchVoucher"
							onChange={handleSearch}
							placeholder="Cari Voucher"
							className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none"
							aria-label="Search vouchers"
						/>
					</div>
					<div className="flex gap-1.5 items-start self-stretch my-auto whitespace-nowrap">
						<button
							className="flex gap-2 items-center px-3 py-2 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]"
							aria-label="Sort by newest"
							onClick={onFilter}
						>
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/TEMP/9e3de3b8711da958ae65f3cbbc2511262f2ca5172e20ff77286e01a78891377a?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
								alt=""
								className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
							/>
							<span className="self-stretch my-auto text-ellipsis">
								{filterParams.orderMode === "desc"
									? "Terbaru"
									: "Terlama"}
							</span>
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/TEMP/50e3c5619267718e09797bc92cd325338d0f61b7c8a24b00492b29637bacd4b8?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
								alt=""
								className={`object-contain shrink-0 self-stretch my-auto w-4 aspect-square transition-all duration-300 ease-in-out ${
									filterParams.orderMode === "asc"
										? "rotate-180"
										: ""
								}`}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const VoucherCard = ({ voucher, onClickDetail }) => {
	const discountValue = useMemo(() => {
		const value = voucher.discountValue;
		let valueStr =
			voucher.discountType === "Persentase"
				? `${new Intl.NumberFormat("id-ID").format(value)}%`
				: `${formatCurrency(value, true)}`;
		return `Diskon ${valueStr}, maks. potongan ${formatCurrency(
			voucher.discountMax,
			true
		)}`;
	}, [voucher]);

	const isNoQuotaLeft = useMemo(() => {
		return voucher.usageCount >= voucher.usageQuota;
	}, [voucher]);
	const isLessThenAWeek = useMemo(() => voucher.daysLeft < 7, [voucher]);
	const isLessThanADay = useMemo(() => voucher.daysLeft <= 1, [voucher]);
	const expiredText = useMemo(() => {
		if (isNoQuotaLeft) return "Kuota Habis";

		const startDate = new Date(voucher.startDate);
		const expiredDate = new Date(voucher.expiredAt);
		const daysLeft = voucher.daysLeft;
		const hoursLeft = voucher.hoursLeft;
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
		<div className="flex flex-col relative bg-white rounded-md border border-solid border-neutral-200 ">
			<div className="flex relative items-start w-full px-4 pt-3 gap-2.5">
				<img
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/1aea820f672fd9b16374ba94660630d13b187ef2e718ea7fd2387bfb30067d64"
					className="object-contain w-[68px] rounded aspect-square"
					alt="Cashback icon"
				/>
				<div className="flex flex-col gap-2 flex-1 ">
					<div className="text-sm text-black font-bold">
						{voucher.kode}
					</div>
					<ul className="list-disc pl-3 text-xs">
						<li>{discountValue} </li>
						<li>
							{`Min. Transaksi ${formatCurrency(
								voucher.transactionMin,
								true
							)}`}
						</li>
					</ul>
					<div className="text-xs">
						<div className="bg-neutral-200 w-full h-2 rounded-full overflow-hidden py-px px-0.5">
							<div
								className="bg-blue-500 h-full rounded-full"
								style={{ width: `${usagePercent}%` }}
							></div>
						</div>
						<p className="mt-1">
							Terpakai{" "}
							<span className="font-bold">{usagePercent}%</span>
						</p>
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
				className="mt-3.5  w-full border-t border-dashed border-zinc-300 relative z-100 after:block  after:h-4 after:w-4 after:bg-white after:border-r  after:rounded-full after:border-zinc-300 after:absolute after:-top-2 after:-left-2 
			before:block  before:h-4 before:w-4 before:bg-white before:border-l  before:rounded-full before:border-zinc-300 before:absolute before:-top-2 before:-right-2
			"
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
				<button className="text-xs font-bold ml-auto text-right text-blue-600">
					Gunakan
				</button>
			</div>
		</div>
	);
};

const VoucherBuyer = () => {
	const [filterParams, setFilterParams] = useState({
		kode: "",
		type: "my-voucher", //voucher-list / my-voucher
		orderBy: "claimed_at",
		orderMode: "desc", // asc / desc
		products_ids: [],
	});

	const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
	const [vouchers, setVouchers] = useState([]);
	const [selectedVoucher, setSelectedVoucher] = useState(null);

	const { data } = useSWR(["voucher/buyer", filterParams], ([_, params]) =>
		fetcher(params)
	);

	useEffect(() => {
		if (data) {
			const arr = [
				...data.Data["diskon-pengiriman"],
				...data.Data["diskon-produk"],
			];
			setVouchers(arr);
		}
	}, [data]);
	const handleSearch = value => {
		setFilterParams(prev => ({
			...prev,
			kode: value,
		}));
	};
	const handleFilter = () => {
		setFilterParams(prev => ({
			...prev,
			orderMode: prev.orderMode === "asc" ? "desc" : "asc",
		}));
	};

	const handleSelectVoucher = voucher => {
		setSelectedVoucher(voucher);
		setIsOpenDetailModal(true);
	};
	return (
		<>
			<div className="p-8">
				<h1 className="text-lg font-bold">Voucher Saya</h1>
				<div className="flex gap-4 mt-4 bg-white shadow-xl  max-w-screen-xl">
					<div className="p-6 w-full">
						<SearchBar
							onSearch={handleSearch}
							filterParams={filterParams}
							onFilter={handleFilter}
						/>

						<div className="grid grid-cols-3 gap-4 w-full mt-4">
							{vouchers.map((voucher, index) => (
								<VoucherCard
									key={`${voucher.uuid}-${index}`}
									voucher={voucher}
									onClickDetail={handleSelectVoucher}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<VoucherDetailModal
				isOpen={isOpenDetailModal}
				setIsOpen={setIsOpenDetailModal}
				id={selectedVoucher?.uuid}
			/>
		</>
	);
};

export default VoucherBuyer;
