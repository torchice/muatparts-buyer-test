import React, { useState, useEffect } from "react";
import FilterProduct from "./FilterProduct";

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
					product.SKU?.toLowerCase().includes(term.toLowerCase())
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
		if (checked) {
			setSelectedProducts(productList);
		} else {
			setSelectedProducts([]);
		}
	};
	const handleSelectProduct = product => {
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

	const handleFilterProduct = selectedFilter => {
		Object.entries(selectedFilter).forEach(([key, value]) => {
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
				status: undefined,
			});
		}
	}, [showAvailableOnly]);
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="flex flex-col bg-white rounded-xl shadow-sm max-w-[800px] w-full max-h-[90vh]">
				{/* Header */}
				<div className="p-6 border-b border-stone-300">
					<div className="text-base font-bold text-zinc-900">
						Pilih Produk
					</div>
				</div>

				{/* Search and Filter */}
				<div className="px-6 py-4 border-b border-stone-300">
					<div className="flex flex-wrap gap-10 justify-between items-center">
						<div className="flex gap-3 items-center text-neutral-500">
							<div className="flex gap-2 items-center px-3 py-2 bg-white rounded-md border border-neutral-500 min-h-[32px] min-w-[240px] w-[262px]">
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/4c10c32039302c1829ac2b9a593e4d2c16de5caa54bf2a4e3d30fafa0461b51b?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
									className="w-4 h-4"
									alt="Search Icon"
								/>
								<input
									type="text"
									value={modalSearchTerm}
									onChange={handleModalSearch}
									placeholder="Cari nama produk/SKU"
									className="flex-1 bg-transparent border-none outline-none text-xs"
								/>
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
				</div>

				{/* Table Header */}
				<div className="px-6 py-3 border-b border-stone-300">
					<div className="flex items-center gap-5">
						<div className="w-4">
							<input
								type="checkbox"
								className="w-4 h-4 rounded border-neutral-500 accent-blue-600"
								checked={
									selectedProducts.length === totalProducts &&
									selectedProducts.length > 0
								}
								onChange={e =>
									handleSelectAll(e.target.checked)
								}
							/>
						</div>
						<div className="flex-1 flex items-center">
							<div className="w-[300px] text-xs font-bold text-neutral-500">
								Produk
							</div>
							<div className="w-[200px] text-xs font-bold text-neutral-500">
								Harga
							</div>
							<div className="flex-1 text-xs font-bold text-neutral-500">
								Stok
							</div>
						</div>
					</div>
				</div>

				{/* Product List - Scrollable Area */}
				<div className="flex-1 overflow-y-auto">
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
											checked={isProductChecked(product)}
											onChange={() => {
												handleSelectProduct(product);
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
											{new Intl.NumberFormat("id-ID", {
												style: "currency",
												currency: "IDR",
												maximumFractionDigits: 0,
											}).format(product.MaxPrice)}
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
							Tidak ada produk yang sesuai dengan pencarian
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-stone-300">
					<div className="flex justify-between items-center">
						<div className="text-xs font-bold text-black">
							Terpilih : {selectedProducts.length}/{totalProducts}{" "}
							Produk
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
	);
}

export default ModalPilihProduk;
