import React, { useState } from "react";

export default function VoucherDetails({
	isEdit,
	isStatusActive,
	isStatusUpcoming,
	formData,
	errors,
	handleChange,
	isFieldError,
}) {
	return (
		<div className="flex overflow-hidden gap-2.5 items-start p-8 mt-6 w-full text-xs font-medium bg-white rounded-xl shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] max-md:px-5 max-md:max-w-full">
			<div className="flex flex-col min-w-[240px] w-[944px]">
				<h2 className="flex-1 shrink gap-6 w-full text-lg font-semibold leading-tight text-black max-md:max-w-full">
					Detail Voucher
				</h2>
				<div className="flex flex-col gap-6 mt-6">
					{/* Jenis Voucher */}
					<div className="flex flex-wrap gap-8 items-center w-full max-md:max-w-full">
						<label className="self-stretch my-auto leading-4 text-neutral-500 w-[178px]">
							Jenis Voucher*
						</label>
						<div className="flex gap-5 items-start self-stretch my-auto leading-tight text-black min-w-[240px]">
							<label className="flex gap-2 items-center">
								<input
									type="radio"
									name="voucherType"
									value="Diskon Produk"
									checked={
										formData.voucherType === "Diskon Produk"
									}
									onChange={handleChange}
									className="accent-blue-600"
									disabled={
										isStatusActive &&
										formData.voucherType ===
											"Biaya Pengiriman"
									}
								/>
								<div className="self-stretch my-auto w-[80px]">
									Diskon Produk
								</div>
							</label>
							<label className="flex gap-2 items-center">
								<input
									type="radio"
									name="voucherType"
									value="Biaya Pengiriman"
									checked={
										formData.voucherType ===
										"Biaya Pengiriman"
									}
									onChange={handleChange}
									className="accent-blue-600"
									disabled={
										isStatusActive &&
										formData.voucherType === "Diskon Produk"
									}
								/>
								<div className="self-stretch my-auto">
									Biaya Pengiriman
								</div>
							</label>
						</div>
					</div>

					{/* Jenis Diskon */}
					{formData.voucherType === "Diskon Produk" && (
						<div className="flex flex-wrap gap-8 items-center w-full max-md:max-w-full">
							<label className="self-stretch my-auto leading-4 text-neutral-500 w-[178px]">
								Jenis Diskon*
							</label>
							<div className="flex gap-5 items-start self-stretch my-auto leading-tight text-black">
								<label className="flex gap-2 items-center">
									<input
										type="radio"
										name="discountType"
										value="Nominal"
										checked={
											formData.discountType === "Nominal"
										}
										onChange={handleChange}
										className="accent-blue-600"
										disabled={
											isStatusActive &&
											formData.discountType ===
												"Persentase"
										}
									/>
									<div className="self-stretch my-auto w-[80px]">
										Nominal (Rp)
									</div>
								</label>
								<label className="flex gap-2 items-center">
									<input
										type="radio"
										name="discountType"
										value="Persentase"
										checked={
											formData.discountType ===
											"Persentase"
										}
										onChange={handleChange}
										className="accent-blue-600"
										disabled={
											isStatusActive &&
											formData.discountType === "Nominal"
										}
									/>
									<div className="self-stretch my-auto">
										Persentase (%)
									</div>
								</label>
							</div>
						</div>
					)}

					{/* Diskon */}
					<div className="flex flex-wrap gap-8 items-start w-full max-md:max-w-full">
						<label
							htmlFor="discount"
							className="flex leading-4 text-neutral-500 w-[178px] h-[32px] items-center"
						>
							{formData.voucherType === "Biaya Pengiriman"
								? "Diskon Biaya Pengiriman*"
								: "Diskon*"}
						</label>
						<div className="flex flex-col w-60">
							<div className="relative ">
								{formData.discountType === "Nominal" && (
									<span className="absolute left-3 top-1/2 -translate-y-1/2">
										Rp
									</span>
								)}
								<input
									id="discount"
									name="discount"
									type="text"
									className={`flex-1 ${
										formData.discountType === "Nominal"
											? "pl-10"
											: ""
									} shrink gap-2 self-stretch p-3 bg-white max-h-[32px] text-neutral-500 border rounded w-full disabled:bg-neutral-200 disabled:text-neutral-900 ${
										isFieldError("discount")
											? "border-red-500 focus:outline-0"
											: "border-neutral-500"
									}`}
									placeholder={
										formData.discountType === "Nominal"
											? "Contoh : 1.000.000"
											: "Contoh : 10%"
									}
									value={formData.discount}
									onChange={handleChange}
									disabled={isStatusActive}
								/>
								{formData.discountType === "Persentase" && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2">
										%
									</span>
								)}
							</div>
							{isFieldError("discount") && (
								<div className="mt-1.5 text-red-500">
									{errors.discount}
								</div>
							)}
						</div>
					</div>

					{/* Minimum Pembelian */}
					<div className="flex flex-wrap gap-8 items-start w-full max-md:max-w-full">
						<label
							htmlFor="minPurchase"
							className="flex leading-4 text-neutral-500 w-[178px] h-[32px] items-center"
						>
							Minimum Pembelian*
						</label>
						<div className="flex flex-col w-60">
							<div className="relative ">
								<span className="absolute left-3 top-1/2 -translate-y-1/2">
									Rp
								</span>
								<input
									id="minPurchase"
									name="minPurchase"
									type="text"
									className={`flex-1 pl-10 shrink gap-2 self-stretch p-3 bg-white max-h-[32px] w-full text-neutral-500 border rounded ${
										isFieldError("minPurchase")
											? "border-red-500 focus:outline-0"
											: "border-neutral-500"
									} disabled:bg-neutral-200 disabled:text-neutral-900`}
									placeholder="Contoh : 1.000.000"
									value={formData.minPurchase}
									onChange={handleChange}
									disabled={isStatusActive}
								/>
							</div>
							{isFieldError("minPurchase") && (
								<div className="mt-1.5 text-red-500">
									{errors.minPurchase}
								</div>
							)}
						</div>
					</div>

					{/* Maksimum Diskon */}
					{formData.discountType === "Persentase" && (
						<div className="flex flex-wrap gap-8 items-start w-full max-md:max-w-full">
							<label
								htmlFor="minPurchase"
								className="flex leading-4 text-neutral-500 w-[178px] h-[32px] items-center"
							>
								Maksimum Diskon*
							</label>
							<div className="flex flex-col w-60">
								<div
									className={`flex overflow-hidden items-start w-full rounded-md `}
								>
									<div className="flex flex-col gap-3">
										<label className="flex gap-2 items-center">
											<input
												type="radio"
												name="maxDiscountType"
												value="Unlimited"
												checked={
													formData.maxDiscountType ===
													"Unlimited"
												}
												onChange={handleChange}
												className="accent-blue-600"
												disabled={
													isStatusActive &&
													formData.maxDiscountType ===
														"Limited"
												}
											/>
											<div className="self-stretch my-auto w-[80px]">
												Tidak Terbatas
											</div>
										</label>
										<label className="flex gap-2 items-center">
											<input
												type="radio"
												name="maxDiscountType"
												value="Limited"
												checked={
													formData.maxDiscountType ===
													"Limited"
												}
												onChange={handleChange}
												className="accent-blue-600"
												disabled={
													isStatusActive &&
													formData.maxDiscountType ===
														"Unlimited"
												}
											/>
											<div className="self-stretch my-auto">
												Atur Batas Maksimum Diskon
											</div>
										</label>
										{formData.maxDiscountType ===
											"Limited" && (
											<div className="ml-5">
												<div className="relative">
													<span className="absolute left-3 top-1/2 -translate-y-1/2">
														Rp
													</span>
													<input
														id="maxDiscountValue"
														name="maxDiscountValue"
														type="text"
														className={`flex-1 pl-10  shrink gap-2 self-stretch p-3 bg-white max-h-[32px] w-full text-neutral-500 border rounded ${
															isFieldError(
																"maxDiscountValue"
															)
																? "border-red-500 focus:outline-0"
																: "border-neutral-500"
														} disabled:bg-neutral-200 disabled:text-neutral-900`}
														placeholder="Contoh : 1.000.000"
														value={
															formData.maxDiscountValue
														}
														onChange={handleChange}
														disabled={
															isStatusActive &&
															formData.maxDiscountType ===
																"Limited"
														}
													/>
												</div>

												{isFieldError(
													"maxDiscountValue"
												) && (
													<div className="mt-1.5 text-red-500">
														{
															errors.maxDiscountValue
														}
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Kuota Pemakaian */}
					<div className="flex flex-wrap gap-8 items-start w-full text-neutral-500 max-md:max-w-full">
						<label
							htmlFor="quota"
							className="flex gap-1 items-center leading-4 w-[178px]"
						>
							<div className="flex self-stretch my-auto w-[102px] h-[32px] items-center">
								Kuota Pemakaian*
							</div>
							<img
								loading="lazy"
								src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/65b3674eb997fa15ce79cf55a2be1322a31fab7483c333f8fe21880d3f3cce38?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
								className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
								alt=""
							/>
						</label>
						<div className="flex gap-2 items-center w-60">
							<div className="flex flex-col flex-1 shrink self-stretch my-auto w-full basis-0">
								<input
									id="quota"
									name="quota"
									type="text"
									className={`flex-1 shrink gap-2 self-stretch p-3 w-full leading-tight bg-white rounded-md border border-solid ${
										isFieldError("quota")
											? "border-red-500 focus:outline-red-500"
											: "border-neutral-500"
									} max-h-[32px]`}
									placeholder="Contoh : 10"
									value={formData.quota}
									onChange={handleChange}
								/>
								{isFieldError("quota") ? (
									<div className="mt-1.5 text-red-500">
										{errors.quota}
									</div>
								) : (
									<div className="flex-1 shrink gap-3 mt-2 w-full leading-none">
										Maksimal penggunaan kuota voucher
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Kuota Pemakaian per Pembeli */}
					<div className="flex flex-wrap gap-7 w-full text-neutral-500 max-md:max-w-full">
						<label
							htmlFor="quotaPerBuyer"
							className="flex gap-1 items-center self-start leading-4 w-[184px] h-[32px]"
						>
							<div className="gap-1 self-stretch my-auto w-[184px]">
								Kuota Pemakaian per Pembeli*
							</div>
						</label>
						<div className="flex flex-col w-60 justify-center">
							{isEdit && (
								<span className="text-neutral-900">
									{formData.quotaPerBuyer}
								</span>
							)}
							{!isEdit && (
								<input
									id="quotaPerBuyer"
									name="quotaPerBuyer"
									type="text"
									className={`flex shrink gap-2 self-stretch p-3 w-60 leading-tight bg-white rounded-md border border-solid ${
										isFieldError("quotaPerBuyer")
											? "border-red-500 focus:outline-red-500"
											: "border-neutral-500"
									} h-[32px]`}
									placeholder="Contoh :10"
									value={formData.quotaPerBuyer}
									onChange={handleChange}
								/>
							)}
							{isFieldError("quotaPerBuyer") && (
								<div className="mt-1.5 text-red-500">
									{errors.quotaPerBuyer}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
