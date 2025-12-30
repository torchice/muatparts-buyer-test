"use client";

import React, { useEffect, useMemo, useState } from "react";

import BreadcrumbNav from "@/components/Voucher/create/BreadcrumbNav";
import PageHeader from "@/components/Voucher/create/PageHeader";
import VoucherInfo from "@/components/Voucher/create/VoucherInfo";
import VoucherDetails from "@/components/Voucher/create/VoucherDetails";
import ProductList from "@/components/Voucher/create/ProductList";
import { rules, validateField, validateForm } from "@/utils/validation";
import { formatCurrency, parseCurrency } from "@/utils/currency";

import { useRouter, useSearchParams } from "next/navigation";
import { customFetcher } from "@/utils/customFetcher";
import useSWRMutation from "swr/mutation";
import toast from "@/store/zustand/toast";
import Toast from "@/components/Toast/Toast";
import useSWR from "swr";

const fetcher = async (_url, { arg }) => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher`,
		{
			method: "POST",
			body: JSON.stringify(arg.payload),
		}
	);
};

const fetchDetailVoucher = async id => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${id}`,
		{
			method: "GET",
		}
	);
};

export const fetchProfileSeller = async () => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/profile`,
		{
			method: "GET",
		}
	);
};
function CreateVoucher() {
	const router = useRouter();
	const searchParams = useSearchParams();
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
	const { showToast, dataToast, setShowToast, setDataToast } = toast();
	const [errors, setErrors] = useState({});
	const [defaultProductList, setDefaultProductList] = useState([]);

	const { data: profile } = useSWR("profile/seller", fetchProfileSeller);

	const storeCode = useMemo(() => {
		if (profile) {
			const storeName = profile.Data?.storeInformation?.storeName;
			//take only the first 4 letter from store name and change it to upper case
			return storeName.substr(0, 4).toUpperCase();
		}

		return "";
	}, [profile]);

	const { data } = useSWR(
		() => {
			const id = searchParams.get("id");
			return !!id ? ["voucher/detail", searchParams.get("id")] : null;
		},
		([, id]) => fetchDetailVoucher(id)
	);
	useEffect(() => {
		if (data) {
			setFormData(prev => ({
				...prev,
				voucherName: data.Data.voucher_name,
				target: data.Data.target,
				voucherType: data.Data.voucher_type,
				discountType: data.Data.discount_type,
				discount: formatCurrency(data.Data.discount_value),
				minPurchase: formatCurrency(data.Data.minimum_transaction),
				maxDiscountType: data.Data.is_unlimited ? "Unlimited" : "Fixed",
				maxDiscountValue: formatCurrency(data.Data.discount_max),
				quota: data.Data.usage_quota,
				quotaPerBuyer: data.Data.usage_limit_user,
				productTarget: data.Data.is_all_product ? "all" : "specific",
				productList: data.Data.products.map(item => item.id),
			}));
			const defaultProduct = data.Data.products.map(item => ({
				ID: item.id,
				Name: item.name,
				SKU: item.sku,
				Brand: item.brand,
				Photo: item.image_url,
				Stock: item.stock,
				MaxPrice: item.price,
			}));

			setDefaultProductList(defaultProduct);
		}
	}, [data]);
	const formRules = useMemo(
		() => ({
			voucherName: [
				rules.required("Nama voucher wajib diisi"),
				rules.maxLength(
					60,
					"Nama voucher harus tidak lebih dari 60 karakter"
				),
			],
			voucherCode: [
				rules.required("Kode voucher wajib diisi"),
				rules.maxLength(
					8,
					"Kode voucher harus tidak lebih dari 8 karakter"
				),
				rules.alphanumeric("Kode voucher harus berupa huruf dan angka"),
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
				rules.min(1),
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
			case "voucherCode":
				newValue = newValue.trimStart();
				newValue = newValue.toUpperCase();
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

	const { trigger } = useSWRMutation("voucher/create", fetcher, {
		onSuccess: () => {
			setDataToast({
				type: "success",
				message: "Voucher berhasil dibuat",
			});

			setShowToast(true);
			router.push("/voucher");
		},
	});

	const createVoucher = async () => {
		if (formData.endDate < formData.startDate) {
			setDataToast({
				type: "error",
				message: "Tanggal akhir harus lebih besar dari tanggal awal",
			});

			setShowToast(true);
			return;
		}

		const payload = {
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

		trigger({ payload });
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
			formData.productList.length === 0
		) {
			setDataToast({
				type: "error",
				message: "List produk wajib diisi!",
			});

			setShowToast(true);
			return;
		}
		if (!hasErrors) {
			createVoucher();
		} else {
			setErrors(newErrors);
		}
	};

	const isFieldError = field => errors[field] && errors[field].length > 0;
	const navItems = [
		{ text: "Dashboard", link: "#" },
		{ text: "Kelola Voucher", link: "#" },
		{ text: "Buat Voucher", link: "#", active: true },
	];
	return (
		<div>
			{showToast && (
				<Toast className="z-[2]" type={dataToast.type}>
					{dataToast?.message}
				</Toast>
			)}

			<main className="flex flex-col p-6 leading-tight">
				<BreadcrumbNav navItems={navItems} />
				<PageHeader
					title={"Buat Voucher"}
					modalMessage="Apakah kamu yakin ingin berpindah halaman? 
Data yang telah diisi tidak akan disimpan"
					onConfirmModal={() => router.push("/voucher")}
				/>
				<div className="flex flex-col mt-4 w-full max-md:max-w-full">
					<form onSubmit={handleSubmit}>
						<VoucherInfo
							formData={formData}
							setFormData={setFormData}
							errors={errors}
							handleChange={handleChange}
							isFieldError={isFieldError}
							storeCode={storeCode}
						/>
						<VoucherDetails
							formData={formData}
							setFormData={setFormData}
							errors={errors}
							handleChange={handleChange}
							isFieldError={isFieldError}
						/>
						<ProductList
							formData={formData}
							setFormData={setFormData}
							handleChange={handleChange}
							defaultSelectedProduct={defaultProductList}
						/>

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
	);
}

export default CreateVoucher;
