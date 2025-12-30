import React, { useState, useEffect, useMemo } from "react";
import ModalKonfirmasi from "../ModalKonfirmasi";
import Toast from "@/components/Toast/Toast";
import toast from "@/store/zustand/toast";
import SearchFilter from "./SearchFilter";
import SliderBubbleFilter from "../SliderBubbleFilter";
import IconSortArrow from "../IconSortArrow";
import IconSortDefault from "../IconSortDefault";
import { formatCurrency } from "@/utils/currency";

export function ModalHapusMassal({ isOpen, onClose, products, onDelete }) {
	const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [modalSearchTerm, setModalSearchTerm] = useState("");
	const [modalFilteredProducts, setModalFilteredProducts] = useState(
		products || []
	);

	const [filterParams, setFilterParams] = useState({
		orderby: "name",
		ordermode: "asc",
	});

	const { showToast, dataToast, setShowToast, setDataToast } = toast();
	// Reset state when modal is opened or products change
	useEffect(() => {
		if (isOpen) {
			setModalSearchTerm("");
			setSelectedProducts([]);
			setModalFilteredProducts(products || []);
		}
	}, [isOpen, products]);

	// Handle search for modal
	const handleModalSearch = e => {
		const term = e.target.value;
		setModalSearchTerm(term);

		if (!term.trim()) {
			setModalFilteredProducts(products);
			return;
		}

		const filtered = products.filter(
			product =>
				product.Name?.toLowerCase().includes(term.toLowerCase()) ||
				product.SKU?.toLowerCase().includes(term.toLowerCase()) ||
				product.Brand?.toLowerCase().includes(term.toLowerCase())
		);
		setModalFilteredProducts(filtered);
	};

	const handleSelectAll = checked => {
		if (checked) {
			setSelectedProducts(modalFilteredProducts.map(p => p.ID));
		} else {
			setSelectedProducts([]);
		}
	};

	const handleDelete = () => {
		onDelete?.(selectedProducts);
		onClose();
		setIsOpenConfirmation(false);
		setDataToast({
			type: "success",
			message: `Berhasil menghapus ${selectedProducts.length} produk`,
		});
		setShowToast(true);
	};
	const [selectedFilters, setSelectedFilters] = useState([]);
	const handleFilterProductManual = selectedItems => {
		const category = selectedItems?.category?.flat();
		const brand = selectedItems?.brand;

		if (category?.length > 0) {
			setModalFilteredProducts(prev =>
				prev.filter(prod =>
					prod.CategoryID.some(cat => category.includes(cat))
				)
			);
			setSelectedFilters([...category]);
		}
		if (brand?.length > 0) {
			setModalFilteredProducts(prev =>
				prev.filter(prod => brand.includes(prod.Brand))
			);

			setSelectedFilters([...brand]);
		}
	};

	const handleClearAllFilters = () => {
		setSelectedFilters([]);
		setModalFilteredProducts(products);
	};

	const handleRemoveFilter = selectedValue => {
		const newFilter = selectedFilters.filter(f => f !== selectedValue);
		setSelectedFilters(newFilter);
	};

	const handleSort = key => {
		const ordermode = filterParams.ordermode === "asc" ? "desc" : "asc";
		const sorted = modalFilteredProducts.sort((a, b) => {
			if (ordermode === "asc") return a[key] > b[key] ? 1 : -1;
			else return a[key] < b[key] ? 1 : -1;
		});
		setModalFilteredProducts(sorted);
		setFilterParams({ ...filterParams, orderby: key, ordermode });
	};
	if (!isOpen) return null;

	return (
		<>
			{showToast && (
				<Toast className="z-[99]" type={dataToast.type}>
					{dataToast?.message}
				</Toast>
			)}
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<div className="flex flex-col bg-white rounded-xl shadow-sm max-w-[800px] w-full max-h-[90vh]">
					{/* Header */}
					<div className="p-6 border-b border-stone-300">
						<div className="text-base font-bold text-zinc-900">
							Hapus Produk
						</div>
					</div>

					{/* Search and Filter */}
					<div className="px-6 py-4 border-b border-stone-300">
						<div className="flex flex-wrap gap-10 justify-between items-center">
							<div className="flex gap-3 items-center text-neutral-500">
								<SearchFilter
									onSearch={handleModalSearch}
									onFilter={handleFilterProductManual}
								/>
							</div>

							<SliderBubbleFilter
								activeFilters={selectedFilters}
								onClearAllFilters={handleClearAllFilters}
								onRemoveFilter={handleRemoveFilter}
							/>
						</div>
					</div>

					{/* Table Header */}
					<div className="px-6 py-3 border-b border-stone-300">
						<div className="flex items-center gap-5">
							<div className="w-4">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-neutral-500"
									checked={
										selectedProducts.length ===
											modalFilteredProducts.length &&
										modalFilteredProducts.length > 0
									}
									onChange={e =>
										handleSelectAll(e.target.checked)
									}
								/>
							</div>
							<div className="flex-1 flex items-center">
								<button
									className="w-[300px] flex items-center gap-2 text-xs font-bold text-neutral-500"
									onClick={() => handleSort("Name")}
								>
									<span>Produk</span>
									{filterParams.orderby === "Name" ? (
										<IconSortArrow
											className={`w-4 h-4 ${
												filterParams.ordermode === "asc"
													? "rotate-180"
													: ""
											}`}
										/>
									) : (
										<IconSortDefault className="w-4 h-4" />
									)}
								</button>
								<button
									className="w-[200px] flex items-center gap-2 text-xs font-bold text-neutral-500"
									onClick={() => handleSort("MaxPrice")}
								>
									<span>Harga</span>
									{filterParams.orderby === "MaxPrice" ? (
										<IconSortArrow
											className={`w-4 h-4 ${
												filterParams.ordermode === "asc"
													? "rotate-180"
													: ""
											}`}
										/>
									) : (
										<IconSortDefault className="w-4 h-4" />
									)}
								</button>
								<button
									className="flex-1  flex items-center gap-2 text-xs font-bold text-neutral-500"
									onClick={() => handleSort("stock")}
								>
									<span>Stok</span>
									{filterParams.orderby === "stock" ? (
										<IconSortArrow
											className={`w-4 h-4 ${
												filterParams.ordermode === "asc"
													? "rotate-180"
													: ""
											}`}
										/>
									) : (
										<IconSortDefault className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Product List - Scrollable Area */}
					<div className="flex-1 overflow-y-auto">
						{modalFilteredProducts.length > 0 ? (
							modalFilteredProducts.map(product => (
								<div
									key={product.ID}
									className="px-6 py-3 border-b border-stone-300 hover:bg-gray-50"
								>
									<div className="flex items-center gap-5">
										<div className="w-4">
											<input
												type="checkbox"
												className="w-4 h-4 rounded border-neutral-500"
												checked={selectedProducts.includes(
													product.ID
												)}
												onChange={() => {
													setSelectedProducts(prev =>
														prev.includes(
															product.ID
														)
															? prev.filter(
																	id =>
																		id !==
																		product.ID
															  )
															: [
																	...prev,
																	product.ID,
															  ]
													);
												}}
											/>
										</div>
										<div className="flex-1 flex items-center">
											<div className="w-[300px] flex items-center gap-3">
												<img
													src={product.Photo}
													alt={product.Name}
													className="w-14 h-14 rounded object-cover"
												/>
												<div>
													<div className="text-xs font-bold text-black line-clamp-2">
														{product.Name}
													</div>
													<div className="text-xs text-neutral-500 mt-1">
														SKU: {product.SKU}
													</div>
													<div className="text-xs text-neutral-500 mt-1">
														Brand: {product.Brand}
													</div>
												</div>
											</div>
											<div className="w-[200px] text-xs text-black">
												{formatCurrency(
													product.MaxPrice,
													true
												)}
											</div>
											<div className="flex-1 text-xs text-black">
												{product.Stock}
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="px-6 py-8 text-center text-neutral-500">
								<img
									src="/not-found.png"
									className="mx-auto mb-5"
								/>
								<span>Keyword Tidak Ditemukan</span>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-6 border-t border-stone-300">
						<div className="flex justify-between items-center">
							<div className="text-xs font-bold text-black">
								Terpilih : {selectedProducts.length} Produk
							</div>
							<div className="flex gap-2">
								<button
									onClick={onClose}
									className="px-6 py-2 text-sm font-semibold text-neutral-500 rounded-3xl border border-neutral-500"
								>
									Batal
								</button>
								<button
									className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-3xl disabled:bg-neutral-300 hover:bg-red-600"
									disabled={selectedProducts.length === 0}
									onClick={() => setIsOpenConfirmation(true)}
								>
									Hapus Massal
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ModalKonfirmasi
				isOpen={isOpenConfirmation}
				onClose={() => setIsOpenConfirmation(false)}
				onConfirm={handleDelete}
				message={`Apakah kamu yakin ingin menghapus ${selectedProducts.length} produk sekaligus?`}
			/>
		</>
	);
}

export default ModalHapusMassal;
