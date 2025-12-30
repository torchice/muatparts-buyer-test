"use client";
import React, { useEffect, useMemo, useState } from "react";

import BreadcrumbNav from "@/components/Voucher/create/BreadcrumbNav";
import PageHeader from "@/components/Voucher/create/PageHeader";
import VoucherInfo from "@/components/Voucher/create/VoucherInfo";
import VoucherDetails from "@/components/Voucher/create/VoucherDetails";
import { rules, validateField, validateForm } from "@/utils/validation";
import { formatCurrency, parseCurrency } from "@/utils/currency";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchDetailVoucher } from "../page";
import { formatDateToDatePicker } from "@/utils/date";
import RegisteredProduct from "@/components/Voucher/RegisteredProduct";
import ModalPilihProduk from "@/components/Voucher/create/ModalPilihProduk";
import toast from "@/store/zustand/toast";
import Toast from "@/components/Toast/Toast";
import { customFetcher } from "@/utils/customFetcher";
import useSWRMutation from "swr/mutation";
import { fetchProfileSeller } from "../../create/page";

const fetchProductList = async filterParams => {
	const params = new URLSearchParams(filterParams);
	const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/product/lists?${params}`;
	return customFetcher(url, { method: "GET" });
};

const fetcher = async (_url, { arg }) => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${arg.id}`,
		{
			method: "POST",
			body: JSON.stringify(arg.payload),
		}
	);
};
const VoucherEdit = () => {
	const router = useRouter();
	const routerParams = useParams();

	const { showToast, dataToast, setShowToast, setDataToast } = toast();
	const [voucher, setVoucher] = useState({});

	const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
	const [filterParams, setFilterParams] = useState({
		page: 1,
		page_size: 100,
	});

	const { data: profile } = useSWR("profile/seller", fetchProfileSeller);

	const storeCode = useMemo(() => {
		if (profile) {
			const storeName = profile.Data?.storeInformation?.storeName;
			//take only the first 4 letter from store name and change it to upper case
			return storeName.substr(0, 4).toUpperCase();
		}

		return "";
	}, [profile]);

	const { data } = useSWR(["voucher/detail", routerParams.id], ([, id]) =>
		fetchDetailVoucher(id)
	);

	const { trigger: triggerUpdate } = useSWRMutation("voucher/edit", fetcher, {
		onSuccess: () => {
			router.push("/voucher");
			setDataToast({
				type: "success",
				message: "Voucher berhasil diperbarui",
			});

			setShowToast(true);
		},
	});

	const [productList, setProductList] = useState([]);
	const [totalProduct, setTotalProduct] = useState(0);
	const { data: productListData } = useSWR(
		["product", filterParams],
		([, params]) => fetchProductList(params)
	);

	useEffect(() => {
		if (productListData) {
			setProductList(productListData.Data);
			setTotalProduct(productListData.DataCount?.all);
		}
	}, [productListData]);

	const isStatusActive = useMemo(
		() => voucher && voucher.status === "Aktif",
		[voucher]
	);
	const isStatusUpcoming = useMemo(
		() => voucher && voucher.status === "Akan Datang",
		[voucher]
	);
	const [formData, setFormData] = useState({
		voucherName: "",
		voucherCode: "",
		target: "Publik",
		startDate: "",
		endDate: "",
		voucherType: "Diskon Produk",
		discountType: "Nominal",
		discount: "",
		minPurchase: "",
		maxDiscountType: "Unlimited",
		maxDiscountValue: "",
		quota: "",
		quotaPerBuyer: "",
		productTarget: "all",
		productList: [],
	});
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		if (data) {
			setVoucher(data.Data);
			setFormData({
				voucherName: data.Data.voucher_name,
				voucherCode: data.Data.code,
				target: data.Data.target,
				startDate: formatDateToDatePicker(data.Data.start_date),
				endDate: formatDateToDatePicker(data.Data.end_date),
				voucherType: data.Data.voucher_type,
				discountType: data.Data.discount_type,
				discount: formatCurrency(data.Data.discount_value),
				minPurchase: formatCurrency(data.Data.minimum_transaction),
				maxDiscountType: data.Data.is_unlimited ? "Unlimited" : "Fixed",
				maxDiscountValue: formatCurrency(data.Data.discount_max),
				quota: data.Data.usage_quota,
				quotaPerBuyer: data.Data.usage_limit_user,
				productTarget: data.Data.is_all_product ? "all" : "specific",
				productList: data.Data.products.map(p => p.id),
			});
			setFilteredProducts(data.Data.products);
			setSelectedProducts(data.Data.products);
		}
	}, [data]);
	const [errors, setErrors] = useState({});
	const formRules = useMemo(
		() => ({
			voucherName: [
				rules.required("Nama voucher wajib diisi"),
				rules.maxLength(
					60,
					"Nama voucher harus tidak lebih dari 60 karakter"
				),
			],
			discount: [
				rules.required("Diskon wajib diisi"),
				rules.refine(
					value =>
						formData.discountType === "Persentase" && value > 60
				),
			],
			minPurchase: [
				rules.required("Minimal pembelian wajib diisi"),
				rules.refine(value => {
					if (
						formData.discountType === "Nominal" &&
						formData.discount &&
						value
					) {
						const parsedValue = parseCurrency(value);
						const discount = parseCurrency(formData.discount);
						const minPurchase = discount * 1.6;
						//make the minimum value is 160% from discount value
						const formattedMinPurchase =
							formatCurrency(minPurchase);
						if (parsedValue < minPurchase)
							return `Nominal minimal Rp${formattedMinPurchase} atau maksimal 60% terhadap Diskon`;
					}
					return null;
				}),
			],
			maxDiscountValue: [
				rules.refine(value => {
					if (
						formData.discountType === "Nominal" ||
						(formData.discountType === "Persentase" &&
							formData.maxDiscountType === "Unlimited")
					)
						return null;
					return !value;
				}, "Maksimal diskon wajib diisi"),
				rules.refine(value => {
					if (
						formData.discountType === "Persentase" &&
						formData.maxDiscountType === "Limited"
					) {
						if (formData.discountType === "Persentase") {
							const discount = Number(formData.discount);
							const minPurchase = +parseCurrency(
								formData.minPurchase
							);
							const maxDiscountValue = +parseCurrency(value);
							const discountOnDecimal = discount / 100;
							const minimal = discountOnDecimal * minPurchase;
							const formattedMinimal = formatCurrency(minimal);
							if (maxDiscountValue < minimal)
								return `Maksimum Diskon tidak boleh kurang dari Rp${formattedMinimal}`;
						}
					}
				}),
			],
			quota: [
				rules.required("Kuota wajib diisi"),
				rules.number("Kuota harus berupa angka"),
				rules.min(+voucher.total_used_voucher + 1),
			],
			quotaPerBuyer: [
				rules.required("Kuota per pembeli wajib diisi"),
				rules.number("Kuota per pembeli harus berupa angka"),
				rules.min(1),
				rules.refine(value => {
					const val = +value;
					const quota = +formData.quota;
					if (val > quota) {
						return "Kuota per pembeli tidak boleh lebih besar dari jumlah kuota pemakaian";
					}
				}),
			],
		}),
		[formData]
	);

	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		let newValue = type === "checkbox" ? checked : value;

		switch (name) {
			case "voucherName":
				newValue = newValue.trimStart();
				break;
			case "discount":
				newValue = newValue.replace(/[^0-9]/g, "");
				if (formData.discountType === "Nominal")
					newValue = formatCurrency(newValue);
				break;
			case "voucherType":
				if (newValue === "Biaya Pengiriman") {
					setFormData(prevData => ({
						...prevData,
						discountType: "Nominal",
						maxDiscountType: "Unlimited",
						maxDiscountValue: "",
					}));
				}
				break;
			case "minPurchase":
			case "maxDiscountValue":
				newValue = newValue.replace(/[^0-9]/g, "");
				newValue = formatCurrency(newValue);
				break;
			case "quota":
				newValue = newValue.replace(/[^0-9]/g, "");
				break;
			default:
				break;
		}

		setFormData(prevData => ({ ...prevData, [name]: newValue }));

		if (formRules[name]) {
			const res = validateField(newValue, formRules[name]);

			if (res) {
				setErrors(prevErrors => ({
					...prevErrors,
					[name]: res,
				}));
			} else {
				setErrors(prevErrors => ({
					...prevErrors,
					[name]: null,
				}));
			}
		}
	};

	const updateVoucher = async () => {
		const payload = {
			uuid: routerParams.id,
			voucher_name: formData.voucherName,
			code: `${storeCode}${formData.voucherCode}`,
			target: formData.target,
			start_date: formData.startDate,
			end_date: formData.endDate,
			voucher_type: formData.voucherType,
			discount_type: formData.discountType,
			discount_value: parseCurrency(formData.discount),
			transaction_min: parseCurrency(formData.minPurchase),
			discount_max: formData.maxDiscountValue
				? parseCurrency(formData.maxDiscountValue)
				: 0,
			usage_quota: formData.quota,
			usage_limit_user: formData.quotaPerBuyer,
			productList: formData.productList,
			is_unlimited: formData.maxDiscountType === "Unlimited",
			is_all_product: formData.productTarget === "all",
		};

		triggerUpdate({
			id: routerParams.id,
			payload,
		});
	};
	const handleSubmit = e => {
		e.preventDefault();
		const newErrors = validateForm(formData, formRules);
		//remove null value from newErrors
		const hasErrors = Object.values(newErrors).some(
			value => value !== null
		);

		if (
			formData.productTarget === "specific" &&
			formData.productList?.length === 0
		) {
			setDataToast({
				type: "error",
				message: "List produk wajib diisi!",
			});

			setShowToast(true);
			return;
		}

		if (!hasErrors) {
			updateVoucher();
		} else {
			setErrors(newErrors);
		}
	};

	const isFieldError = field => errors[field] && errors[field].length > 0;
	const navItems = [
		{ text: "Daftar Voucher", link: "#" },
		{ text: "Ubah Voucher", link: "#", active: true },
	];

	const [productSearch, setProductSearch] = useState("");

	const handleProductSearch = e => {
		const searchTerm = e.target.value;
		setProductSearch(searchTerm);

		if (!searchTerm.trim()) {
			setFilteredProducts(selectedProducts);
			return;
		}

		const filtered = selectedProducts.filter(
			product =>
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredProducts(filtered);
	};

	const handleProductFilter = selectedItems => {
		const category = selectedItems?.category?.flat();
		const brand = selectedItems?.brand;
		const type = selectedItems?.type;
		const condition = selectedItems?.condition;

		if (category?.length > 0) {
			setFilteredProducts(prev =>
				prev.filter(prod =>
					prod.CategoryID.some(cat => category.includes(cat))
				)
			);
		}
		if (brand?.length > 0)
			setFilteredProducts(prev =>
				prev.filter(prod => brand.includes(prod.Brand))
			);

		if (type?.length > 0)
			setFilteredProducts(prev =>
				prev.filter(prod => type.includes(prod.SalesType))
			);

		if (condition?.length > 0)
			setFilteredProducts(prev =>
				prev.filter(prod => condition.includes(prod.ConditionID))
			);
	};

	const handleProductAdd = () => {
		setIsOpenModalAdd(true);
	};

	const handleSaveProducts = newProducts => {
		const uniqueNewProducts = newProducts
			.filter(
				newProduct =>
					!selectedProducts.some(
						existingProduct => existingProduct.id === newProduct.ID
					)
			)
			.map(p => ({
				id: p.ID,
				name: p.Name,
				stock: p.Stock,
				price: p.MaxPrice,
				sku: p.SKU,
				brand: p.Brand,
				image_url: p.Photo,
			}));

		const updatedProducts = [...selectedProducts, ...uniqueNewProducts];
		setSelectedProducts(updatedProducts);
		setFilteredProducts(updatedProducts);

		setFormData(prev => ({
			...prev,
			productList: updatedProducts.map(p => p.id),
		}));
		setProductSearch("");
	};

	return (
		<>
			{showToast && (
				<Toast className="z-[2]" type={dataToast.type}>
					{dataToast?.message}
				</Toast>
			)}
			<div>
				<main className="flex flex-col p-6 leading-tight">
					<BreadcrumbNav navItems={navItems} />
					<PageHeader
						title="Ubah Voucher"
						modalMessage="Apakah kamu yakin ingin berpindah halaman? 
Data yang telah diisi tidak akan disimpan"
						onConfirmModal={() => router.push("/voucher")}
					/>
					<div className="flex flex-col mt-4 w-full max-md:max-w-full">
						<form onSubmit={handleSubmit}>
							<VoucherInfo
								isEdit={true}
								voucher={voucher}
								formData={formData}
								setFormData={setFormData}
								errors={errors}
								handleChange={handleChange}
								isFieldError={isFieldError}
								isStatusActive={isStatusActive}
								isStatusUpcoming={isStatusUpcoming}
								storeCode={storeCode}
							/>
							<VoucherDetails
								formData={formData}
								setFormData={setFormData}
								errors={errors}
								handleChange={handleChange}
								isFieldError={isFieldError}
								isEdit={true}
								isStatusActive={isStatusActive}
								isStatusUpcoming={isStatusUpcoming}
							/>

							<div className="flex overflow-hidden gap-2.5 items-start p-8 mt-6 w-full leading-tight bg-white rounded-xl shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] max-md:px-5 max-md:max-w-full">
								<div className="w-full flex flex-col gap-6">
									<div>
										<h2 className="text-lg font-semibold text-black">
											Daftar Produk untuk Dipasang Voucher
										</h2>
									</div>
									<div className="flex flex-col w-full gap-6">
										<div className="flex flex-row  text-xs">
											<span className="text-neutral-500 w-[178px]">
												Target Produk
											</span>
											<span className="text-neutral-900">
												{formData.productTarget ===
												"all"
													? "Semua Produk"
													: "Produk Tertentu"}
											</span>
										</div>
									</div>
									{formData.productTarget !== "all" && (
										<RegisteredProduct
											products={filteredProducts}
											withFilter
											productSearchTerm={productSearch}
											onSearch={handleProductSearch}
											onFilter={handleProductFilter}
											onAdd={handleProductAdd}
										/>
									)}
								</div>
							</div>
							<div className="flex overflow-hidden gap-2.5 items-start p-8 mt-6 w-full leading-tight bg-white rounded-xl shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] max-md:px-5 max-md:max-w-full">
								<button
									type="submit"
									className="gap-1 ml-auto px-6 py-3 my-auto bg-blue-600 rounded-3xl min-h-[32px] min-w-[112px] max-md:px-5 text-white"
								>
									Simpan
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>

			<ModalPilihProduk
				isOpen={isOpenModalAdd}
				onClose={() => setIsOpenModalAdd(false)}
				onSave={handleSaveProducts}
				productList={productList}
				totalProducts={totalProduct}
				filterParams={filterParams}
				setFilterParams={setFilterParams}
			/>
		</>
	);
};

export default VoucherEdit;
