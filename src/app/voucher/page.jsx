"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TabItem } from "@/components/Voucher/TabItem";
import VoucherTable from "@/components/Voucher/TableVoucher";
import { customFetcher } from "@/utils/customFetcher";
import useSWR from "swr";

const defaultPaginationMeta = {
	current_page: 1,
	last_page: 1,
	per_page: 10,
	total: 1,
	from: 1,
	to: 1,
};

const fetchVoucherList = async filterParams => {
	const paramsWithoutNull = Object.fromEntries(
		Object.entries(filterParams).filter(([_, value]) => value)
	);
	const params = new URLSearchParams(paramsWithoutNull);
	const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher?${params}`;
	return customFetcher(url, { method: "GET" });
};

const fetchHistoryList = async filterParams => {
	const paramsWithoutNull = Object.fromEntries(
		Object.entries(filterParams).filter(([_, value]) => value)
	);
	const params = new URLSearchParams(paramsWithoutNull);
	const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher?${params}`;
	return customFetcher(url, { method: "GET" });
};
function VoucherSeller() {
	const [activeTab, setActiveTab] = useState("daftar"); // 'daftar' atau 'riwayat'

	const getPaginationMeta = data => ({
		current_page: data.current_page,
		last_page: data.last_page,
		per_page: data.per_page,
		total: data.total,
		from: data.from,
		to: data.to,
	});
	const [listVoucher, setListVoucher] = useState([]);
	const [listPaginationMeta, setListPaginationMeta] = useState(
		defaultPaginationMeta
	);
	const [listCount, setListCount] = useState(0);
	const [filterParams, setFilterParams] = useState({
		page: 1,
		page_size: 10,
		q: "",
		status: ["Aktif", "Akan Datang"],
	});

	const { data } = useSWR(["voucher", filterParams], ([, params]) =>
		fetchVoucherList(params)
	);

	useEffect(() => {
		if (data) {
			setListVoucher(data.Data);
			setListCount(data.total);
			setListPaginationMeta(getPaginationMeta(data));
		}
	}, [data]);

	const [filterHistory, setFilterHistory] = useState({
		page: 1,
		page_size: 10,
		q: "",
		status: "Berakhir",
	});
	const [historyVoucher, setHistoryVoucher] = useState([]);
	const [historyCount, setHistoryCount] = useState(0);
	const [historyPaginationMeta, setHistoryPaginationMeta] = useState(
		defaultPaginationMeta
	);

	const { data: dataHistory } = useSWR(
		["voucher/history", filterHistory],
		([, params]) => fetchHistoryList(params)
	);

	useEffect(() => {
		if (dataHistory) {
			setHistoryVoucher(dataHistory.Data);
			setHistoryCount(dataHistory.total);
			setHistoryPaginationMeta(getPaginationMeta(dataHistory));
		}
	}, [dataHistory]);

	const isHistory = useMemo(() => activeTab === "riwayat", [activeTab]);

	const handleSearch = value => {
		if (isHistory)
			setFilterHistory({
				...filterHistory,
				q: value,
			});
		else
			setFilterParams({
				...filterParams,
				q: value,
			});
	};
	const handleFilter = filter => {
		const params = {
			voucher_type:
				filter.voucher_type.length > 0 ? filter.voucher_type : null,
			target: filter.target.length > 0 ? filter.target : null,
			product: filter.product.length > 0 ? filter.product : null,
		};

		if (isHistory)
			setFilterHistory({
				...filterHistory,
				...params,
				page: 1,
			});
		else setFilterParams({ ...filterParams, ...params, page: 1 });
	};

	const handleActiveTab = tab => {
		setActiveTab(tab);
	};

	const handlePaginationChange = value => {
		if (isHistory)
			setFilterHistory(prev => ({
				...prev,
				page: value,
			}));
		else
			setFilterParams(prev => ({
				...prev,
				page: value,
			}));
	};

	const handlePageSizeChange = value => {
		if (isHistory)
			setFilterHistory(prev => ({
				...prev,
				page_size: value,
			}));
		else
			setFilterParams(prev => ({
				...prev,
				page_size: value,
			}));
	};
	return (
		<div>
			<main className="flex flex-col p-6 leading-tight  min-h-screen">
				<div className="flex flex-col max-w-full leading-tight w-[1040px]">
					<div className="gap-10 self-stretch w-full text-xl font-bold text-black max-md:max-w-full">
						Kelola Voucher
					</div>
					<div className="flex flex-col justify-center self-start mt-4 mb-4 text-base text-center">
						<div className="flex gap-1 items-start">
							<div
								onClick={() => handleActiveTab("daftar")}
								className="cursor-pointer"
							>
								<TabItem
									label="Daftar Voucher"
									count={listCount}
									isActive={activeTab === "daftar"}
								/>
							</div>
							<div className="shrink-0 self-stretch w-0 h-10 border border-solid bg-stone-300 border-stone-300" />
							<div
								onClick={() => handleActiveTab("riwayat")}
								className="cursor-pointer"
							>
								<TabItem
									label="Riwayat"
									count={historyCount}
									isActive={activeTab === "riwayat"}
								/>
							</div>
						</div>
					</div>
				</div>

				<VoucherTable
					data={isHistory ? historyVoucher : listVoucher}
					activeTab={activeTab}
					paginationMeta={
						isHistory ? historyPaginationMeta : listPaginationMeta
					}
					currentFilter={isHistory ? filterHistory : filterParams}
					onFilter={handleFilter}
					onSearch={handleSearch}
					onPaginationChange={handlePaginationChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			</main>
		</div>
	);
}

export default VoucherSeller;
