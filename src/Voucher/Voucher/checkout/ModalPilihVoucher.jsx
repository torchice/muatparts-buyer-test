import { formatCurrency } from "@/utils/currency";
import { customFetcherBuyer } from "@/utils/customFetcher";
import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import VoucherDetailModal from "../VoucherDetailModal";

const fetcher = async filterParams => {
	const params = new URLSearchParams(filterParams);
	return customFetcherBuyer(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/voucher-list?${params}`,
		{
			method: "GET",
		}
	);
};

const VoucherCard = ({
	voucher,
	onClickDetail,
	onUseVoucher,
	isUsedVoucher,
}) => {
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

	const handleUseVoucher = voucher => {
		onUseVoucher(voucher);
	};
	return (
		<div
			className={`flex flex-col relative  rounded-md border border-solid ${
				isUsedVoucher
					? "bg-blue-50 border-blue-700"
					: "bg-white border-neutral-200"
			} `}
		>
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
				className={`
					mt-3.5  w-full border-t border-dashed  relative z-100 after:block  after:h-4 after:w-4 after:bg-white after:border-r  after:rounded-full  after:absolute after:-top-2 after:-left-2 
			before:block  before:h-4 before:w-4 before:bg-white before:border-l  before:rounded-full  before:absolute before:-top-2 before:-right-2
			${
				isUsedVoucher
					? "border-blue-700 after:border-blue-700 before:border-blue-700"
					: "after:border-zinc-300 border-zinc-300 before:border-zinc-300"
			}
					`}
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
					className="text-xs font-bold ml-auto text-right text-blue-600"
					onClick={() => handleUseVoucher(voucher)}
				>
					Pakai
				</button>
			</div>
		</div>
	);
};
const ModalPilihVoucher = ({
	isOpen,
	setIsOpen,
	sellerId,
	setUsedVoucher,
	usedVoucher,
}) => {
	const [selectedVoucherDetail, setSelectedVoucherDetail] = useState(null);
	const [isOpenDetail, setIsOpenDetail] = useState(false);
	const [voucherOngkir, setVoucherOngkir] = useState([]);
	const [voucherProduct, setVoucherProduct] = useState([]);
	const [filterParams, setFilterParams] = useState({
		kode: "",
		seller_id: sellerId ?? "",
		type: "voucher-list", //voucher-list / my-voucher
		orderBy: "claimed_at",
		orderMode: "desc", // asc / desc
		products_ids: [],
	});

	const [tab, setTab] = useState(1);

	const { data } = useSWR(
		() => (isOpen && !!sellerId ? ["voucher/buyer", filterParams] : null),
		([_, params]) => fetcher(params)
	);
	useEffect(() => {
		if (data) {
			setVoucherOngkir(data.Data["diskon-pengiriman"]);
			setVoucherProduct(data.Data["diskon-produk"]);
		}
	});
	useEffect(() => {
		setFilterParams(prev => ({
			...prev,
			seller_id: sellerId ?? "",
		}));
	}, [sellerId]);

	const handleSearch = e => {
		const value = e.target.value;
		setFilterParams(prev => ({
			...prev,
			kode: value,
		}));
	};
	const handleTabActive = index => {
		setTab(index);
	};

	const handleClickDetail = voucher => {
		setSelectedVoucherDetail(voucher);
		setIsOpenDetail(true);
	};
	const handleUseVoucher = voucher => {
		setUsedVoucher(voucher);
	};
	return (
		<>
			<div
				className={`fixed inset-0 z-[90] flex items-center justify-center ${
					!isOpen ? "hidden" : "block"
				}`}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black/50"
					onClick={() => setIsOpen(false)}
				/>
				<div className="relative rounded-xl max-w-screen-sm w-full">
					<div className=" relative flex flex-col items-center w-full bg-white rounded-xl px-6 py-8 gap-4">
						<button
							className="text-blue-700 absolute right-2 top-2 w-5 h-5 "
							onClick={() => setIsOpen(false)}
						>
							X
						</button>
						<h1 className="font-bold text-lg">Pilih Voucher</h1>
						<div className="relative flex gap-2 items-center self-stretch px-3 py-2 my-auto bg-white rounded-md border border-solid border-neutral-500 min-h-[32px] w-full">
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
								placeholder="Cari Kode Voucher"
								className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none outline-none"
								aria-label="Cari Kode Voucher"
							/>
						</div>
						<span className="text-sm text-neutral-600 self-start">
							Hanya bisa dipilih 1 Voucher
						</span>
						<div className="self-start flex gap-3">
							<button
								className={`flex gap-1 justify-center items-center px-6 py-2  rounded-3xl border 
								${
									tab === 1
										? "bg-blue-50 border-blue-700 text-blue-700"
										: "border-neutral-200 bg-neutral-200 text-neutral-900 "
								}
								font-bold text-sm`}
								onClick={() => handleTabActive(1)}
							>
								Voucher Gratis Ongkir ({voucherOngkir.length})
							</button>
							<button
								className={`flex gap-1 justify-center items-center px-6 py-2  rounded-3xl border 
								${
									tab === 2
										? "bg-blue-50 border-blue-700 text-blue-700"
										: "border-neutral-200 bg-neutral-200 text-neutral-900 "
								}
								font-bold text-sm`}
								onClick={() => handleTabActive(2)}
							>
								Voucher Transaksi ({voucherProduct.length})
							</button>
						</div>
						<div className="w-full">
							{tab === 1 &&
								voucherOngkir?.map((voucher, index) => (
									<VoucherCard
										key={`${voucher.uuid}-${index}`}
										onClickDetail={handleClickDetail}
										voucher={voucher}
										onUseVoucher={handleUseVoucher}
										isUsedVoucher={
											usedVoucher?.uuid === voucher?.uuid
										}
									/>
								))}
							{tab === 2 &&
								voucherProduct?.map((voucher, index) => (
									<VoucherCard
										key={`${voucher.uuid}-${index}`}
										onClickDetail={handleClickDetail}
										voucher={voucher}
										onUseVoucher={handleUseVoucher}
										isUsedVoucher={
											usedVoucher?.uuid === voucher?.uuid
										}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
			<VoucherDetailModal
				id={selectedVoucherDetail?.uuid}
				isOpen={isOpenDetail}
				setIsOpen={setIsOpenDetail}
			/>
		</>
	);
};

export default ModalPilihVoucher;
