import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SearchFilter from "./SearchFilter";
import { ModalPilihProduk } from "./ModalPilihProduk";
import { ModalHapusMassal } from "./ModalHapusMassal";
import { EmptyStateDaftarProdukVoucher } from "./EmptyStateDaftarProdukVoucher";
import useSWR from "swr";
import { customFetcher } from "@/utils/customFetcher";
import SliderBubbleFilter from "../SliderBubbleFilter";

const fetcher = async filterParams => {
	const params = new URLSearchParams(filterParams);
	const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/product/lists?${params}`;
	return await customFetcher(url, { method: "GET" });
};
export default function ProductList({
	formData,
	setFormData,
	handleChange,
	defaultSelectedProduct,
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [filterParams, setFilterParams] = useState({
		page: 1,
		page_size: 100,
		orderby: "name",
		ordermode: "desc",
	});
	const [totalProducts, setTotalProducts] = useState(0);
	const [productList, setProductList] = useState([]);

	const [selectedProducts, setSelectedProducts] = useState([]);
	const [displayedProducts, setDisplayedProducts] = useState([]);
	const [productSearchTerm, setProductSearchTerm] = useState("");
	const { data } = useSWR(["product", filterParams], ([, params]) =>
		fetcher(params)
	);
	useEffect(() => {
		if (defaultSelectedProduct && defaultSelectedProduct.length > 0) {
			setSelectedProducts(defaultSelectedProduct);
			setDisplayedProducts(defaultSelectedProduct);
		}
	}, [defaultSelectedProduct]);
	useEffect(() => {
		if (data) {
			setProductList(data.Data ?? []);
			setTotalProducts(data?.DataCount?.all);
		}
	}, [data]);
	const handleProductSearch = e => {
		const searchTerm = e.target.value;
		setProductSearchTerm(searchTerm);

		if (!searchTerm.trim()) {
			setDisplayedProducts(selectedProducts);
			return;
		}

		const filtered = selectedProducts.filter(
			product =>
				product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.SKU?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.Brand?.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setDisplayedProducts(filtered);
	};

	const handleDelete = id => {
		const updatedProducts = selectedProducts.filter(
			product => product.ID !== id
		);
		setSelectedProducts(updatedProducts);

		if (productSearchTerm) {
			const filtered = updatedProducts.filter(
				product =>
					product.Name.toLowerCase().includes(
						productSearchTerm.toLowerCase()
					) ||
					product.SKU.toLowerCase().includes(
						productSearchTerm.toLowerCase()
					) ||
					product.Brand.toLowerCase().includes(
						productSearchTerm.toLowerCase()
					)
			);
			setDisplayedProducts(filtered);
		} else {
			setDisplayedProducts(updatedProducts);
		}
	};

	const handleBulkDelete = productsToDelete => {
		const updatedProducts = selectedProducts.filter(
			product => !productsToDelete.includes(product.ID)
		);
		setSelectedProducts(updatedProducts);
		setDisplayedProducts(updatedProducts);
		setProductSearchTerm("");
	};

	const handleSaveProducts = newProducts => {
		const uniqueNewProducts = newProducts.filter(
			newProduct =>
				!selectedProducts.some(
					existingProduct => existingProduct.ID === newProduct.ID
				)
		);
		const updatedProducts = [...selectedProducts, ...uniqueNewProducts];
		setSelectedProducts(updatedProducts);
		setDisplayedProducts(updatedProducts);
		setFormData(prev => ({
			...prev,
			productList: updatedProducts.map(p => p.ID),
		}));
		setProductSearchTerm("");
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	const openDeleteModal = () => {
		setIsDeleteModalOpen(true);
	};

	const handleFilterProductManual = selectedItems => {
		const category = selectedItems?.category?.flat();
		const brand = selectedItems?.brand;

		if (category?.length > 0) {
			setDisplayedProducts(prev =>
				prev.filter(prod =>
					prod.CategoryID.some(cat => category.includes(cat))
				)
			);
		}
		if (brand?.length > 0)
			setDisplayedProducts(prev =>
				prev.filter(prod => brand.includes(prod.BrandID))
			);
	};
	return (
		<div className="flex  p-8 mt-6 w-full bg-white rounded-xl shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] ">
			<div className="flex flex-col min-w-[240px] w-[944px]">
				<div className="flex justify-between items-center w-full text-lg font-semibold text-black max-md:max-w-full">
					<h2 className="gap-1 self-stretch max-md:max-w-full">
						Daftar Produk untuk Dipasang Voucher
					</h2>
				</div>

				<div className="flex flex-wrap gap-8 items-start mt-6 w-full text-xs font-medium max-w-[944px] max-md:max-w-full">
					<span className="text-neutral-500 w-[178px]">
						Target Produk*
					</span>
					<div className="flex flex-wrap gap-5 items-start min-w-[240px] max-md:max-w-full">
						<div className="flex flex-col min-w-[240px]">
							<div className="flex gap-2 items-center self-start text-black">
								<input
									id="allProduct"
									type="radio"
									name="productTarget"
									value="all"
									checked={formData.productTarget === "all"}
									onChange={handleChange}
									className="accent-blue-600"
								/>
								<label
									className="self-stretch my-auto"
									htmlFor="allProduct"
								>
									Semua Produk
								</label>
							</div>
							<div className="gap-2.5 self-stretch pl-6 mt-1 text-neutral-500 max-md:pl-5">
								Voucher dapat digunakan untuk semua produk
							</div>
						</div>
						<div className="flex flex-col min-w-[240px] w-[324px]">
							<div className="flex gap-2 items-center self-start text-black">
								<input
									id="specificProduct"
									type="radio"
									name="productTarget"
									value="specific"
									checked={
										formData.productTarget === "specific"
									}
									onChange={handleChange}
									className="accent-blue-600"
								/>
								<label
									className="self-stretch my-auto"
									htmlFor="specificProduct"
								>
									Produk Tertentu
								</label>
							</div>
							<div className="gap-2.5 self-stretch pl-6 mt-1 max-w-full text-neutral-500 w-[324px] max-md:pl-5">
								Voucher hanya berlaku untuk produk terpilih.
							</div>
						</div>
					</div>

					{formData.productTarget === "specific" && (
						<>
							{selectedProducts.length > 0 ? (
								<>
									<div className="flex flex-wrap  justify-between items-center w-full leading-tight max-md:max-w-full">
										<div className="flex w-full">
											<SearchFilter
												onSearch={handleProductSearch}
												onFilter={
													handleFilterProductManual
												}
												value={productSearchTerm}
												placeholder="Cari nama produk/SKU yang sudah dipilih"
											/>
											<div className="flex gap-3 items-center self-stretch my-auto text-sm font-semibold min-w-[240px] ml-auto">
												<button
													type="button"
													onClick={openDeleteModal}
													className="gap-1 self-stretch px-6 py-3 my-auto text-red-500 bg-white rounded-3xl border border-red-500 border-solid min-h-[32px] min-w-[112px] max-md:px-5"
												>
													Hapus Massal
												</button>
												<button
													type="button"
													onClick={openModal}
													className="gap-1 self-stretch px-6 py-3 my-auto text-white whitespace-nowrap bg-blue-600 rounded-3xl min-h-[32px] min-w-[112px] max-md:px-5"
												>
													Tambah
												</button>
											</div>
										</div>
										<SliderBubbleFilter
											activeFilters={[]}
										/>
									</div>

									<div className="flex gap-3 justify-center items-start mt-5 w-full text-xs font-medium leading-tight text-black max-md:max-w-full">
										<div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
											<div className="flex gap-3 items-center py-5 w-full text-xs font-bold leading-tight whitespace-nowrap bg-white border-t border-b border-solid border-y-stone-300 text-neutral-500 max-md:max-w-full">
												<div className="flex flex-wrap flex-1 shrink gap-[20px] items-center self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
													<div className="self-stretch my-auto w-[388px]">
														Produk
													</div>
													<div className="gap-2 self-stretch my-auto w-[190px]">
														Harga
													</div>
													<div className="flex-1 shrink gap-2 self-stretch my-auto max-w-[310px]">
														Stok
													</div>
													<div className="flex-1 shrink gap-2 self-stretch my-auto max-w-[310px]">
														&nbsp;
													</div>
												</div>
											</div>

											{productSearchTerm ? (
												displayedProducts.length > 0 ? (
													displayedProducts.map(
														product => (
															<ProductCard
																key={product.ID}
																{...product}
																onDelete={() =>
																	handleDelete(
																		product.ID
																	)
																}
															/>
														)
													)
												) : (
													<div className="flex justify-center items-center py-8 text-neutral-500">
														Tidak ada produk yang
														sesuai dengan pencarian
													</div>
												)
											) : (
												selectedProducts.map(
													product => (
														<ProductCard
															key={product.ID}
															{...product}
															onDelete={() =>
																handleDelete(
																	product.ID
																)
															}
														/>
													)
												)
											)}
										</div>
									</div>
								</>
							) : (
								<EmptyStateDaftarProdukVoucher
									onPilihProduk={openModal}
								/>
							)}
						</>
					)}
				</div>
			</div>

			<ModalPilihProduk
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveProducts}
				productList={productList}
				totalProducts={totalProducts}
				defaultSelectedProduct={selectedProducts}
				filterParams={filterParams}
				setFilterParams={setFilterParams}
			/>

			<ModalHapusMassal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				products={selectedProducts}
				onDelete={handleBulkDelete}
			/>
		</div>
	);
}
