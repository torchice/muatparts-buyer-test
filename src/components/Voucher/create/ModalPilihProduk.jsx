import React, { useState, useEffect, useMemo } from "react";
import FilterProduct, { fetcherOwnedFilter } from "./FilterProduct";
import toast from "@/store/zustand/toast";
import Toast from "@/components/Toast/Toast";
import SliderBubbleFilter from "../SliderBubbleFilter";

import IconSortDefault from "../IconSortDefault";
import IconSortArrow from "../IconSortArrow";

const MAX_PRODUCT_SELECTED = 30;
export function ModalPilihProduk({
	isOpen,
	onClose,
	onSave,
	productList,
	totalProducts,
	filterParams,
	setFilterParams,
}) {
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [displayedProducts, setDisplayedProducts] = useState([]);
	const [modalSearchTerm, setModalSearchTerm] = useState("");

	const { showToast, dataToast, setShowToast, setDataToast } = toast();
	const [showAvailableOnly, setShowAvailableOnly] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setModalSearchTerm("");
			setSelectedProducts([]);
			setDisplayedProducts(productList);
		}
	}, [isOpen]);
	// Handle search untuk modal
	const handleModalSearch = e => {
		const term = e.target.value;
		setModalSearchTerm(term);
		setDisplayedProducts(
			productList.filter(
				product =>
					product.Name.toLowerCase().includes(term.toLowerCase()) ||
					product.SKU?.toLowerCase().includes(term.toLowerCase()) ||
					product.Brand?.toLowerCase().includes(term.toLowerCase())
			)
		);
	};

	// Handle checkbox availability
	const handleAvailabilityChange = e => {
		const checked = e.target.checked;
		setShowAvailableOnly(checked);
		setFilterParams(prev => ({
			...prev,
			status: "Aktif",
		}));
	};

	const handleSelectAll = checked => {
		if (selectedProducts.length >= MAX_PRODUCT_SELECTED) {
			setDataToast({
				type: "error",
				message: "Maksimal 30 produk yang dapat dipilih",
			});
			setShowToast(true);
			return;
		}
		if (checked) {
			const maxLoop = productList.length < 30 ? productList.length : 30;
			for (let index = 0; index < maxLoop; index++) {
				const element = productList[index];
				setSelectedProducts(prev => [...prev, element]);
			}
		} else {
			setSelectedProducts([]);
		}
	};
	const handleSelectProduct = product => {
		if (selectedProducts.length >= MAX_PRODUCT_SELECTED) {
			setDataToast({
				type: "error",
				message: "Maksimal 30 produk yang dapat dipilih",
			});
			setShowToast(true);
			return;
		}
		const isSelected = selectedProducts.find(p => p.ID === product.ID);

		if (isSelected) {
			setSelectedProducts(
				selectedProducts.filter(p => p.ID !== product.ID)
			);
		} else {
			setSelectedProducts([...selectedProducts, product]);
		}
	};

	const isProductChecked = product => {
		return selectedProducts.find(p => p.ID === product.ID) ?? false;
	};

	const handleSave = () => {
		onSave?.(selectedProducts);
		onClose();
	};

	const handleFilterProduct = filter => {
		Object.entries(filter).forEach(([key, value]) => {
			setFilterParams(prevState => ({
				...prevState,
				[key]: value.join(","),
			}));
		});
	};

	useEffect(() => {
		if (showAvailableOnly)
			setFilterParams({
				page: 1,
				page_size: 100,
				status: "Active",
			});
		else {
			setFilterParams({
				...filterParams,
				status: "",
			});
		}
	}, [showAvailableOnly]);

	const handleClearSearch = () => {
		setModalSearchTerm("");
		setDisplayedProducts(productList);
	};

	const getAllFilter = useMemo(() => {
		let filter = [];
		if (filterParams.category) {
			const filterCategories = filterParams.category.split(",");
			filter = [...filterCategories];
		}
		if (filterParams.brand) {
			const filterBrands = filterParams.brand.split(",");
			filter = [...filter, ...filterBrands];
		}

		return filter;
	}, [filterParams]);

	const handleClearAllFilters = () => {
		setFilterParams({
			page: 1,
			page_size: 100,
			brand: "",
			category: "",
		});
	};

	const handleRemoveFilter = selectedValue => {
		if (filterParams.category) {
			const categories = filterParams.category.split(",");
			if (categories.includes(selectedValue)) {
				const newCategories = categories.filter(
					category => category !== selectedValue
				);
				setFilterParams(prevState => ({
					...prevState,
					category: newCategories.join(","),
				}));
			}
		}

		if (filterParams.brand) {
			const brands = filterParams.brand.split(",");
			if (brands.includes(selectedValue)) {
				const newBrands = brands.filter(
					brand => brand !== selectedValue
				);
				setFilterParams(prevState => ({
					...prevState,
					brand: newBrands.join(","),
				}));
			}
		}
	};

	const handleSort = key => {
		const currentKey = filterParams.orderby;

		let ordermode = filterParams.ordermode;
		if (currentKey === key)
			ordermode = ordermode === "asc" ? "desc" : "asc";
		else ordermode = "desc";

		const orderby = key;

		setFilterParams(prevState => ({
			...prevState,
			ordermode,
			orderby,
		}));

		setDisplayedProducts(productList);
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
					<div className="flex justify-center p-6 border-b border-stone-300">
						<div className="text-base font-bold text-zinc-900 ml-auto ">
							Pilih Produk
						</div>
						<button
							className="ml-auto text-blue-700"
							onClick={onClose}
						>
							X
						</button>
					</div>

					{/* Search and Filter */}
					<div className="px-6 py-4 border-b border-stone-300">
						<div className="flex flex-wrap gap-10 justify-between items-center">
							<div className="flex gap-3 items-center text-neutral-500">
								<div className="flex gap-2 items-center relative">
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/4c10c32039302c1829ac2b9a593e4d2c16de5caa54bf2a4e3d30fafa0461b51b?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
										className="w-4 h-4 absolute left-3 top-2"
										alt="Search Icon"
									/>
									<input
										type="text"
										value={modalSearchTerm}
										onChange={handleModalSearch}
										placeholder="Cari nama produk/SKU"
										className="flex-1 pl-8 pr-3 py-2 bg-white rounded-md border border-neutral-500  min-w-[240px] w-[262px]  text-xs"
									/>
									{!!modalSearchTerm && (
										<button
											className="absolute right-3 top-2.5 text-xs text-neutral-900"
											onClick={handleClearSearch}
										>
											X
										</button>
									)}
								</div>
								<FilterProduct onFilter={handleFilterProduct} />
							</div>
							<label className="flex gap-2 items-center text-xs text-black cursor-pointer">
								<input
									type="checkbox"
									checked={showAvailableOnly}
									onChange={handleAvailabilityChange}
									className="w-4 h-4 rounded border-neutral-500 accent-blue-600"
								/>
								<div>Menampilkan produk yang tersedia</div>
							</label>
						</div>
						<SliderBubbleFilter
							activeFilters={getAllFilter}
							onClearAllFilters={handleClearAllFilters}
							onRemoveFilter={handleRemoveFilter}
						/>
					</div>

					{/* Table Header */}
					<div className="px-6 py-3 border-b border-stone-300">
						<div className="flex items-center gap-5">
							<div className="w-4">
								<input
									type="checkbox"
									className="w-4 h-4 rounded border-neutral-500 accent-blue-600"
									checked={
										selectedProducts.length ===
											totalProducts &&
										selectedProducts.length > 0
									}
									onChange={e =>
										handleSelectAll(e.target.checked)
									}
								/>
							</div>
							<div className="flex-1 flex items-center">
								<button
									className="w-[300px] flex items-center gap-2 text-xs font-bold text-neutral-500"
									onClick={() => handleSort("name")}
								>
									<span>Produk</span>
									{filterParams.orderby === "name" ? (
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
									onClick={() => handleSort("price")}
								>
									<span>Harga</span>
									{filterParams.orderby === "price" ? (
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
					<div className="flex-1 overflow-y-auto max-h-[60vh] min-h-[60vh]">
						{displayedProducts?.length > 0 ? (
							displayedProducts?.map(product => (
								<div
									key={product.ID}
									className="px-6 py-3 border-b border-stone-300 hover:bg-gray-50"
								>
									<div className="flex items-center gap-5">
										<div className="w-4">
											<input
												type="checkbox"
												className="w-4 h-4 rounded border-neutral-500 accent-blue-600"
												checked={isProductChecked(
													product
												)}
												onChange={() => {
													handleSelectProduct(
														product
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
														SKU:{" "}
														{product.SKU ?? "-"}
													</div>
													<div className="text-xs text-neutral-500 mt-1">
														Brand: {product.Brand}
													</div>
												</div>
											</div>
											<div className="w-[200px] text-xs text-black">
												{new Intl.NumberFormat(
													"id-ID",
													{
														style: "currency",
														currency: "IDR",
														maximumFractionDigits: 0,
													}
												).format(product.MaxPrice)}
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
								Terpilih : {selectedProducts.length}/
								{totalProducts} Produk
							</div>
							<div className="flex gap-2">
								<button
									onClick={onClose}
									className="px-6 py-2 text-sm font-semibold text-neutral-500 rounded-3xl border border-neutral-500"
								>
									Batal
								</button>
								<button
									className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-3xl disabled:bg-neutral-300"
									disabled={selectedProducts.length === 0}
									onClick={handleSave}
								>
									Simpan
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ModalPilihProduk;
