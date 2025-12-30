"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import FilterDropdown from "./FilterDropdown";
import SliderBubbleFilter from "./SliderBubbleFilter";

import { ActionMenu } from "./ActionMenu";
import { EmptyState } from "./EmptyState";
import ModalKonfirmasi from "./ModalKonfirmasi";
import ModalUbahQuota from "./ModalUbahQuota";
import { customFetcher } from "@/utils/customFetcher";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { formatCurrency } from "@/utils/currency";
import toast from "@/store/zustand/toast";
import Toast from "../Toast/Toast";
const defaultFilter = {
	status: [],
	voucher_type: [],
	target: [],
	product: [],
};

const TableFilter = ({ onSearch, onFilter, currentFilter }) => {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState({
		voucher_type: currentFilter.voucher_type ?? [],
		target: currentFilter.target ?? [],
		product: currentFilter.product ?? [],
	});

	const handleFilterChange = (category, selectedValues) => {
		const newFilter = { ...selectedFilters, [category]: selectedValues };
		setSelectedFilters(newFilter);
		onFilter(newFilter);
	};

	const handleRemoveFilter = filterToRemove => {
		for (const [category, filters] of Object.entries(selectedFilters)) {
			if (filters.includes(filterToRemove)) {
				const newFilter = {
					...selectedFilters,
					[category]: filters.filter(f => f !== filterToRemove),
				};
				setSelectedFilters(newFilter);
				onFilter(newFilter);
				break;
			}
		}
	};

	const handleClearAllFilters = () => {
		setSelectedFilters(defaultFilter);
		onFilter(defaultFilter);
	};

	const getAllActiveFilters = () => {
		return Object.values(selectedFilters).flat();
	};

	return (
		<>
			{/* Search and Filter Section */}
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-3">
					<div className="flex items-center px-3 py-2 border border-neutral-500 rounded-md w-[262px]">
						<img
							src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/4c10c32039302c1829ac2b9a593e4d2c16de5caa54bf2a4e3d30fafa0461b51b?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
							className="w-4 h-4 mr-2"
							alt=""
						/>
						<input
							type="text"
							value={query}
							onChange={e => {
								setQuery(e.target.value);
								onSearch(e.target.value);
							}}
							placeholder="Cari Nama / Kode Voucher"
							className="w-full text-xs outline-none"
						/>
					</div>
					<FilterDropdown
						selectedItems={selectedFilters}
						onSelectionChange={handleFilterChange}
					/>
				</div>
				<button
					onClick={() => router.push("/voucher/create")}
					className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-3xl"
				>
					Buat Voucher
				</button>
			</div>

			{/* Active Filters Section */}
			{getAllActiveFilters().length > 0 && (
				<SliderBubbleFilter
					activeFilters={getAllActiveFilters()}
					onRemoveFilter={handleRemoveFilter}
					onClearAllFilters={handleClearAllFilters}
				/>
			)}
		</>
	);
};

const pageSize = [10, 20, 40];

const Pagination = ({
	paginationMeta,
	onPaginationChange,
	onPageSizeChange,
}) => {
	const [activePage, setActivePage] = useState(paginationMeta.current_page);
	const [activePageSize, setActivePageSize] = useState(
		paginationMeta.per_page
	);
	const handleNext = () => {
		const next = activePage + 1;
		setActivePage(Math.max(next, 1));
		onPaginationChange(next);
	};
	const handlePrev = () => {
		const prev = activePage - 1;
		setActivePage(Math.max(prev, 1));
		onPaginationChange(prev);
	};
	const handlePageClick = page => {
		setActivePage(page);
		onPaginationChange(page);
	};
	const handlePageSizeChange = size => {
		setActivePageSize(size);
		onPageSizeChange(size);
	};
	return (
		<div className="flex justify-between items-center mt-4">
			<div className="flex gap-2">
				<button
					onClick={handlePrev}
					disabled={activePage === 1}
					className="px-2 py-1 rounded-md disabled:opacity-50"
				>
					&lt;
				</button>
				{Array.from(
					{ length: paginationMeta.last_page },
					(_, i) => i + 1
				).map(page => (
					<button
						key={page}
						onClick={() => handlePageClick(page)}
						className={`w-8 h-8 rounded-md ${
							activePage === page ? "bg-red-700 text-white" : ""
						}`}
					>
						{page}
					</button>
				))}
				<button
					onClick={handleNext}
					disabled={activePage === paginationMeta.last_page}
					className="px-2 py-1 rounded-md disabled:opacity-50"
				>
					&gt;
				</button>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-xs text-neutral-500">
					Tampilkan Jumlah detail
				</span>
				<div className="flex gap-2">
					{pageSize.map(size => (
						<button
							key={size}
							onClick={() => handlePageSizeChange(size)}
							className={`w-8 h-8 rounded-md ${
								activePageSize === size
									? "bg-red-700 text-white"
									: ""
							}`}
						>
							{size}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export const getVoucherStatusBadgeColor = voucher => {
	if (voucher.status === "Akan Datang")
		return "bg-yellow-100 text-yellow-900";
	else if (voucher.status === "Aktif") return "bg-green-50 text-green-400";

	return "bg-neutral-200 text-neutral-600";
};
const deleteVoucher = async (_url, { arg }) => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${arg.id}`,
		{
			method: "DELETE",
		}
	);
};

const endVoucher = async (_url, { arg }) => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${arg.id}/end`,
		{
			method: "PUT",
		}
	);
};

const Table = ({ entries }) => {
	const router = useRouter();
	const [openMenuId, setOpenMenuId] = useState(null);

	const { showToast, dataToast, setShowToast, setDataToast } = toast();

	const getVoucherDiscount = ({
		discount_type,
		discount_value,
		discount_max,
	}) =>
		discount_type === "Nominal"
			? formatCurrency(discount_value, true)
			: `Diskon ${new Intl.NumberFormat("id-ID").format(
					discount_value
			  )}% s/d ${formatCurrency(discount_max, true)}`;

	// Handle clicking Atur
	const handleMenuClick = (voucherId, event) => {
		event.stopPropagation();
		setOpenMenuId(openMenuId === voucherId ? null : voucherId);
	};

	useEffect(() => {
		const handleClickOutside = event => {
			if (!event.target.closest(".action-menu-container")) {
				setOpenMenuId(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle voucher actions (delete and end)
	const [selectedVoucher, setSelectedVoucher] = useState(null);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [modalMode, setModalMode] = useState("delete"); //delete / end
	const { mutate } = useSWRConfig();
	const onSuccess = () => {
		setDataToast({
			type: "success",
			message: `Berhasil ${
				modalMode === "delete" ? "menghapus" : "mengakhiri"
			} voucher`,
		});

		setShowToast(true);
		setIsOpenModal(false);
		mutate(key => Array.isArray(key) && key.includes("voucher"));
	};
	const { trigger: triggerDelete } = useSWRMutation(
		"voucher/delete",
		deleteVoucher,
		{
			onSuccess,
		}
	);
	const { trigger: triggerEnd } = useSWRMutation("voucher/end", endVoucher, {
		onSuccess,
	});
	const handleVoucherAction = (voucher, actionType) => {
		setOpenMenuId(null);
		setSelectedVoucher(voucher);
		setModalMode(actionType);
		setIsOpenModal(true);
	};
	const handleCloseModal = () => {
		setIsOpenModal(false);
		setSelectedVoucher(null);
	};
	const handleCopy = voucher => {
		router.push(`/voucher/create?id=${voucher.uuid}`);
	};
	const handleModalConfirmation = () => {
		if (modalMode === "delete") triggerDelete({ id: selectedVoucher.uuid });
		else triggerEnd({ id: selectedVoucher.uuid });
	};

	const [isOpenModalQuota, setIsOpenModalQuota] = useState(false);

	const handleModalUpdateQuota = voucher => {
		setIsOpenModalQuota(true);
		setSelectedVoucher(voucher);
		setOpenMenuId(null);
	};

	const renderTableRow = voucher => (
		<div
			key={voucher.uuid}
			className="flex px-6 py-5 text-xs border-b border-stone-300 hover:bg-gray-50 items-center gap-[20px]"
		>
			<div className="w-[298px] flex gap-3">
				<img
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e9a42f3b20b5e5de94f86b6faa2250030ed002b90aa34b8cf4a9d3a5581304f?placeholderIfAbsent=true&apiKey=60cdcdaf919148d9b5b739827a6f5b2a"
					className="w-14 h-14 rounded flex-shrink-0 "
					alt=""
				/>
				<div className="min-w-0">
					<div className="font-bold line-clamp-2">
						{voucher.voucher_name}
					</div>
					<div className="mt-3 whitespace-nowrap">
						Kode Voucher: {voucher.kode}
					</div>
					<div className="mt-3 whitespace-nowrap">
						{voucher.voucher_type}
					</div>
				</div>
			</div>
			<div className="w-[130px] whitespace-nowrap">
				{voucher.is_all_product
					? "Semua Produk"
					: `${voucher.total_product} Produk`}
			</div>
			<div className="w-[88px] whitespace-nowrap">{voucher.target}</div>
			<div className="w-[150px] whitespace-nowrap">
				{getVoucherDiscount(voucher)}
			</div>
			<div className="w-[120px] flex items-center whitespace-nowrap">
				{voucher.total_used_voucher}/{voucher.usage_quota}
				<img
					src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/1d9329ffaefc6dfd3e4a5367e526364652d5406f19902d16a9f3189c1f7971bf?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
					alt=""
					className="w-3 h-3 ml-1"
				/>
			</div>
			<div className="w-[148px]">
				<div
					className={`${getVoucherStatusBadgeColor(
						voucher
					)} px-2 py-1 w-fit rounded-md whitespace-nowrap `}
				>
					{voucher.status}
				</div>
				<div className="mt-3 whitespace-nowrap">
					<span className="text-neutral-500">Mulai: </span>
					<span className="text-neutral-500">
						{new Date(voucher.start_date).toLocaleString("id-ID")}
					</span>
				</div>
				<div className="mt-3 whitespace-nowrap">
					<span className="text-neutral-500">Akhir: </span>
					<span className="text-neutral-500">
						{new Date(voucher.end_date).toLocaleString("id-ID")}
					</span>
				</div>
			</div>
			<div className="w-[72px] flex justify-center relative action-menu-container">
				<button
					onClick={e => handleMenuClick(voucher.uuid, e)}
					className="px-3 py-2 border border-neutral-500 rounded-md whitespace-nowrap"
				>
					<span>Atur</span>
				</button>
				{openMenuId === voucher.uuid && (
					<div className="absolute right-0 top-full mt-1 z-50">
						<ActionMenu
							status={voucher.status}
							onDelete={() =>
								handleVoucherAction(voucher, "delete")
							}
							onEnd={() => handleVoucherAction(voucher, "end")}
							onDetail={() =>
								router.push(`/voucher/${voucher.uuid}`)
							}
							onEdit={() =>
								router.push(`/voucher/${voucher.uuid}/edit`)
							}
							onCopy={() => handleCopy(voucher)}
							onEditQuota={() => handleModalUpdateQuota(voucher)}
						/>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<>
			{/* Table Container */}
			<div className="bg-white rounded-xl shadow-sm ">
				<div>
					<div className="min-w-[1026px]">
						{/* Table Header */}
						<div className="flex px-6 py-5 text-xs font-bold text-neutral-500 border-b border-stone-300 items-center gap-[20px]">
							<div className="w-[298px]">Informasi Voucher</div>
							<div className="w-[130px]">Produk</div>
							<div className="w-[88px]">Target Voucher</div>
							<div className="w-[150px]">Potongan</div>
							<div className="w-[120px]">Kuota Terpakai</div>
							<div className="w-[148px]">Status dan Periode</div>
							<div className="w-[72px]"></div>
						</div>

						{/* Table Content */}
						<div>
							{entries.length > 0 ? (
								entries.map(voucher => renderTableRow(voucher))
							) : (
								<div className="px-6 py-8 text-center text-neutral-500">
									Tidak ada voucher yang sesuai dengan
									pencarian
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<ModalUbahQuota
				isOpen={isOpenModalQuota}
				selectedVoucher={selectedVoucher}
				setIsOpen={setIsOpenModalQuota}
				setSelectedVoucher={setSelectedVoucher}
			/>
			<ModalKonfirmasi
				isOpen={isOpenModal}
				message={`Apakah kamu yakin ${
					modalMode === "delete" ? "menghapus" : "mengakhiri"
				} Voucher ${selectedVoucher?.voucher_name} ?`}
				onClose={handleCloseModal}
				onConfirm={handleModalConfirmation}
			/>

			{showToast && (
				<Toast className="z-[2]" type={dataToast.type}>
					{dataToast?.message}
				</Toast>
			)}
		</>
	);
};
export default function VoucherTable({
	data,
	activeTab,
	paginationMeta,
	currentFilter,
	onFilter,
	onSearch,
	onPaginationChange,
	onPageSizeChange,
}) {
	return (
		<>
			<div className="flex flex-col p-6 leading-tight bg-white rounded-xl shadow-xl">
				<TableFilter
					onSearch={onSearch}
					onFilter={onFilter}
					currentFilter={currentFilter}
				/>
				{data.length === 0 ? (
					<EmptyState type={activeTab} />
				) : (
					<Table entries={data} />
				)}
				<Pagination
					paginationMeta={paginationMeta}
					onPaginationChange={onPaginationChange}
					onPageSizeChange={onPageSizeChange}
				/>
			</div>
		</>
	);
}
