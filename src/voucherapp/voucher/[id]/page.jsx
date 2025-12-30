"use client";
import Toast from "@/components/Toast/Toast";
import BreadcrumbNav from "@/components/Voucher/create/BreadcrumbNav";
import PageHeader from "@/components/Voucher/create/PageHeader";
import RegisteredProduct from "@/components/Voucher/RegisteredProduct";
import { TabItem } from "@/components/Voucher/TabItem";
import { getVoucherStatusBadgeColor } from "@/components/Voucher/TableVoucher";
import toast from "@/store/zustand/toast";
import { formatCurrency } from "@/utils/currency";
import { customFetcher } from "@/utils/customFetcher";
import { formatDate } from "@/utils/date";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const navItems = [
	{ text: "Dashboard", link: "#" },
	{ text: "Kelola Voucher", link: "#" },
	{ text: "Detail Voucher", link: "#", active: true },
];

const VoucherCard = ({ voucher, onCopyCode }) => {
	return (
		<div className="flex mt-4  gap-2.5 items-start p-8 w-full bg-white rounded-xl shadow-lg max-md:px-5 max-md:max-w-full">
			<div className="flex flex-wrap flex-1 shrink gap-6 items-center w-full basis-0 min-w-[240px] max-md:max-w-full">
				<div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-12 min-w-[240px] max-md:max-w-full">
					<div className="flex flex-wrap gap-8 items-center w-full max-md:max-w-full">
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e9a42f3b20b5e5de94f86b6faa2250030ed002b90aa34b8cf4a9d3a5581304f?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
							alt={`Voucher image for ${voucher.voucher_name}`}
							className="object-contain shrink-0 self-stretch my-auto rounded-2xl aspect-square w-[88px]"
						/>
						<div className="flex flex-col items-start self-stretch my-auto min-w-[240px]">
							<div className="flex gap-2.5 items-center self-stretch">
								<div className="flex gap-2 items-center self-stretch my-auto min-w-[240px]">
									<div className="flex gap-3 items-center self-stretch my-auto min-w-[240px]">
										<div className="self-stretch my-auto text-lg font-bold text-black">
											{voucher.voucher_name}
										</div>
										<div
											className={`gap-1 self-stretch p-2 my-auto text-xs font-semibold  whitespace-nowrap  rounded-md min-h-[24px] w-[90px] text-center ${getVoucherStatusBadgeColor(
												voucher
											)}`}
										>
											{voucher.status}
										</div>
									</div>
								</div>
							</div>
							<div className="flex gap-3 items-center mt-1 text-xs">
								<div className="self-stretch my-auto font-medium text-neutral-500">
									Masa Berlaku
								</div>
								<div className="flex gap-1 items-center self-stretch my-auto font-semibold text-black min-h-[24px]">
									<div className="gap-1 self-stretch my-auto">
										{`${formatDate(
											voucher.start_date
										)} s/d ${formatDate(voucher.end_date)}`}
									</div>
								</div>
							</div>
							<div className="flex gap-3 items-center mt-1 text-xs">
								<div className="self-stretch my-auto font-medium text-neutral-500">
									Kode Voucher
								</div>
								<div className="flex gap-1 items-center self-stretch my-auto font-bold text-black whitespace-nowrap min-h-[24px]">
									<div className="flex gap-1 items-center self-stretch my-auto">
										<div className="self-stretch my-auto">
											{voucher.code}
										</div>
										<button
											aria-label="Copy voucher code"
											onClick={onCopyCode}
											className="focus:outline-none focus:ring-2 focus:ring-blue-500"
											tabIndex={0}
										>
											<img
												loading="lazy"
												src="https://cdn.builder.io/api/v1/image/assets/TEMP/2bcf54f86b9d473b8ff23d346356e8d8007639ecea6d709b24bb05d8b6b431d3?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
												alt=""
												className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
											/>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center self-stretch p-6 my-auto text-base font-bold bg-sky-100 rounded-md max-md:px-5">
					<div className="flex flex-col w-full">
						<div className="w-full text-blue-600">
							Performa Voucher
						</div>
						<div className="gap-1 self-stretch mt-3 text-black font-bold">
							{`${voucher.total_used_voucher}/${voucher.usage_quota} Kuota Terpakai`}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const InfoBlock = ({ label, value }) => (
	<div className="flex flex-col self-stretch my-auto w-auto min-w-[113px]">
		<div className="w-full text-xs font-medium">{label}</div>
		<div className="gap-1 self-stretch mt-2 text-base font-bold">
			{value}
		</div>
	</div>
);

const VoucherDetailCard = ({ voucher }) => {
	const [activeTab, setActiveTab] = useState("detail"); //detail / product
	const handleActiveTab = tab => {
		setActiveTab(tab);
	};
	return (
		<div className="flex flex-col mx-auto w-full shadow-lg mt-6 rounded-xl bg-white ">
			<div className="flex overflow-hidden gap-2.5 items-start py-8  w-full leading-tight max-md:max-w-full">
				<div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
					<div className="flex flex-col items-start max-w-full text-base text-center w-[488px]">
						<div
							role="tablist"
							className="flex flex-col justify-center"
						>
							<div className="flex gap-1 items-start">
								{voucher.is_all_product && (
									<p className="font-bold text-lg pl-8">
										Detail Voucher
									</p>
								)}
								{!voucher.is_all_product && (
									<>
										<div
											onClick={() =>
												handleActiveTab("detail")
											}
											className="cursor-pointer"
										>
											<TabItem
												label="Detail Voucher"
												isActive={
													activeTab === "detail"
												}
											/>
										</div>
										<div className="shrink-0 self-stretch w-0 h-10 border border-solid bg-stone-300 border-stone-300" />
										<div
											onClick={() =>
												handleActiveTab("product")
											}
											className="cursor-pointer"
										>
											<TabItem
												label="Produk Terdaftar"
												isActive={
													activeTab === "product"
												}
											/>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{activeTab === "detail" && (
						<div className="flex flex-col px-8 mt-6 w-full text-black max-md:px-5 max-md:max-w-full">
							<div className="flex flex-col w-full max-md:max-w-full">
								<div className="grid grid-cols-4 gap-10 items-center p-6 w-full rounded-xl bg-zinc-100 justify-between ">
									<InfoBlock
										label="Jenis Voucher"
										value={voucher.voucher_type}
									/>
									<InfoBlock
										label={`Diskon ${
											voucher.voucher_type ===
											"Biaya Pengiriman"
												? "Biaya Pengiriman"
												: ""
										}`}
										value={
											voucher.discount_type === "Nominal"
												? formatCurrency(
														voucher.discount_value,
														true
												  )
												: `${voucher.discount_value}%`
										}
									/>
									<InfoBlock
										label="Minimum Pembelian"
										value={formatCurrency(
											voucher.minimum_transaction,
											true
										)}
									/>
									{voucher.discount_type === "Persentase" && (
										<InfoBlock
											label="Maksimum Diskon"
											value={
												voucher.is_unlimited
													? "Tidak Terbatas"
													: formatCurrency(
															voucher.discount_max,
															true
													  )
											}
										/>
									)}
								</div>

								<div className="grid grid-cols-4 gap-10 p-6 mt-6 w-full rounded-xl bg-zinc-100 max-md:px-5 max-md:max-w-full">
									<InfoBlock
										label="Target"
										value={voucher.target}
									/>
									<InfoBlock
										label="Kuota Pemakaian"
										value={voucher.usage_quota}
									/>
									<InfoBlock
										label="Kuota Pemakaian per Pembeli "
										value={voucher.usage_limit_user}
									/>
								</div>
							</div>
						</div>
					)}
					{activeTab === "product" && (
						<div className="py-6 px-8 w-full ">
							<RegisteredProduct products={voucher.products} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export const fetchDetailVoucher = async id => {
	const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${id}`;
	return await customFetcher(url, { method: "GET" });
};
const DetailVoucher = () => {
	const routerParams = useParams();
	const router = useRouter();
	const { showToast, dataToast, setShowToast, setDataToast } = toast();
	const [detailVoucher, setDetailVoucher] = useState({});

	const { data } = useSWR(["voucher/detail", routerParams.id], ([, id]) =>
		fetchDetailVoucher(id)
	);
	useEffect(() => {
		if (data) {
			setDetailVoucher(data.Data);
		}
	}, [data]);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(detailVoucher.code);
		setDataToast({
			message: "Kode Voucher berhasil disalin",
			type: "success",
		});
		setShowToast(true);
	};
	return (
		<>
			<div>
				{showToast && (
					<Toast className="z-[2]" type={dataToast.type}>
						{dataToast?.message}
					</Toast>
				)}

				<main className="flex flex-col p-6 leading-tight">
					<BreadcrumbNav navItems={navItems} />
					<PageHeader
						title="Detail Voucher"
						modalMessage="Apakah anda yakin ingin meninggalkan halaman ini?"
						onConfirmModal={() => {
							router.push("/voucher");
						}}
					/>

					<VoucherCard
						voucher={detailVoucher}
						onCopyCode={handleCopyCode}
					/>
					<VoucherDetailCard voucher={detailVoucher} />
					{detailVoucher.voucher_type === "Biaya Pengiriman" && (
						<div className="bg-white shadow-xl rounded-xl flex mt-6 p-8">
							<p className="font-bold text-xl">
								Total Pengeluaran
							</p>
							<p className="font-bold text-xl ml-auto ">
								{formatCurrency(
									detailVoucher.total_expenses,
									true
								)}
							</p>
						</div>
					)}
				</main>
			</div>
		</>
	);
};

export default DetailVoucher;
