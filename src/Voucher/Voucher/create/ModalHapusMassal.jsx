import React, { useState, useEffect } from "react";
import ModalKonfirmasi from "../ModalKonfirmasi";

export function ModalHapusMassal({ isOpen, onClose, products, onDelete }) {
	const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [modalSearchTerm, setModalSearchTerm] = useState("");
	const [modalFilteredProducts, setModalFilteredProducts] = useState(
		products || []
	);

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
				product.Name.toLowerCase().includes(term.toLowerCase()) ||
				product.SKU.toLowerCase().includes(term.toLowerCase()) ||
				product.Brand.toLowerCase().includes(term.toLowerCase())
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
	};

	if (!isOpen) return null;

	return (
		<>
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
								<button className="flex gap-2 items-center px-3 py-2 bg-white rounded-md border border-neutral-500 min-h-[32px] w-[104px]">
									<span className="flex-1 text-xs">
										Filter
									</span>
									<img
										loading="lazy"
										src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/8d2e6aac8fa1c92dba6ff7ecdbf6a850ad97696124612887a95bbd87ad235c85?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
										className="w-4 h-4"
										alt="Filter Icon"
									/>
								</button>
							</div>
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
												{product.MaxPrice}
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
