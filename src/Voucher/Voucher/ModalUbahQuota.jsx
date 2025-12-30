import { customFetcher } from "@/utils/customFetcher";
import { rules, validateField } from "@/utils/validation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

const updateQuota = async (_url, { arg }) => {
	return customFetcher(
		`${process.env.NEXT_PUBLIC_GLOBAL_API}muatparts/voucher/${arg.id}/quota`,
		{
			method: "PUT",
			body: JSON.stringify({ new_quota: arg.quota }),
		}
	);
};
export default function ModalUbahQuota({
	isOpen,
	setIsOpen,
	setSelectedVoucher,
	selectedVoucher,
}) {
	const [errors, setErrors] = useState({});
	const [quota, setQuota] = useState(0);

	const { mutate } = useSWRConfig();
	const handleClose = () => {
		setIsOpen(false);
		setSelectedVoucher(null);
	};

	useEffect(() => {
		const handleEscape = e => {
			if (e.key === "Escape") handleClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, handleClose]);

	const { trigger } = useSWRMutation("voucher/update-quota", updateQuota, {
		onSuccess: () => {
			handleClose();
			mutate(key => Array.isArray(key) && key.includes("voucher"));
		},
	});

	const handleConfirm = () => {
		trigger({ id: selectedVoucher.uuid, quota: +quota });
	};

	useEffect(() => {
		if (selectedVoucher) setQuota(selectedVoucher.usage_quota);
	}, [selectedVoucher]);

	const handleChange = e => {
		setQuota(e.target.value);
		const used =
			+selectedVoucher.total_used_voucher === 0
				? 1
				: +selectedVoucher.total_used_voucher;
		const res = validateField(e.target.value, [
			rules.required(),
			rules.min(
				used,
				used === 1
					? "Kuota Voucher harus minimal 1"
					: `Kuota Voucher telah terpakai ${used}`
			),
		]);

		if (res) {
			setErrors(prevErrors => ({
				...prevErrors,
				quota: res,
			}));
		} else {
			setErrors(prevErrors => ({
				...prevErrors,
				quota: null,
			}));
		}
	};

	const isFieldError = field => errors[field] && errors[field].length > 0;
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50">
			<div
				className="fixed inset-0 bg-black/30 transition-opacity"
				onClick={handleClose}
				aria-hidden="true"
			/>
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<div
					className="flex overflow-hidden flex-col text-sm rounded-xl shadow-sm max-w-[386px] bg-white relative"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/011212b21c7487aa4c4cb9971f3e219cbf1144b3459a57a695a1f1772e8c8575?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
						alt=""
						className="object-contain w-full aspect-[5.52]"
					/>
					<button
						className="absolute top-2 right-2 z-0 w-5 h-5"
						onClick={handleClose}
						aria-label="Close"
					></button>
					<div className="flex flex-col justify-center items-center px-6 py-9 w-full">
						<h1 className="text-base font-bold text-center text-black max-w-[510px]">
							Ubah Kuota Voucher
						</h1>
						<div className="flex flex-col self-stretch mt-6 w-full text-xs font-medium">
							<label htmlFor="quotaInput" className="sr-only">
								Kuota Voucher
							</label>
							<input
								id="quota"
								type="number"
								value={quota}
								onChange={handleChange}
								className="flex-1 shrink gap-2 self-stretch p-3 w-full text-black whitespace-nowrap bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]"
								aria-label="Kuota Voucher"
								autoFocus
							/>
							<div className="flex gap-3 items-start mt-2 w-full h-[7px]">
								{isFieldError("quota") ? (
									<div className="flex-1 shrink basis-0 text-red-500">
										{errors.quota}
									</div>
								) : (
									<div
										className=" text-neutral-500"
										role="alert"
									>
										Pastikan stok produk memenuhi penambahan
										kuota voucher
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-2 items-start mt-6 font-semibold leading-tight whitespace-nowrap">
							<button
								onClick={handleClose}
								className="gap-1 self-stretch px-6 py-3 text-blue-600 bg-white rounded-3xl border border-blue-600 border-solid min-h-[32px] min-w-[112px] hover:bg-blue-50 transition-colors"
							>
								Batal
							</button>
							<button
								onClick={handleConfirm}
								className="gap-1 self-stretch px-6 py-3 text-white bg-blue-600 rounded-3xl min-h-[32px] min-w-[112px] hover:bg-blue-700 transition-colors"
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
