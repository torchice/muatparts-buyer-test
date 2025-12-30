import React, { useMemo } from "react";
import { getVoucherStatusBadgeColor } from "../TableVoucher";

export default function VoucherInfo({
	isEdit,
	voucher,
	isStatusActive,
	isStatusUpcoming,
	formData,
	errors,
	handleChange,
	isFieldError,
	storeCode,
}) {
	return (
		<div className="flex overflow-hidden gap-2.5 items-start p-8 w-full text-xs font-medium bg-white rounded-xl shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] max-md:px-5 max-md:max-w-full">
			<div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
				<h2 className="gap-6 self-stretch w-full text-lg font-semibold leading-tight text-black max-md:max-w-full">
					Informasi Voucher
				</h2>
				{isEdit && voucher && (
					<div className="flex flex-col gap-6 mt-6">
						<div className="flex flex-wrap gap-8 items-start w-full text-neutral-500 max-md:max-w-full">
							<label
								htmlFor="voucherName"
								className="flex leading-4 w-[178px] h-[32px] items-center"
							>
								Status
							</label>
							<div
								className={`${getVoucherStatusBadgeColor(
									voucher
								)} px-8 py-2 w-fit rounded-lg whitespace-nowrap font-semibold`}
							>
								{voucher.status}
							</div>
						</div>
					</div>
				)}
				<div className="flex flex-col gap-6 mt-6">
					{/* Nama Voucher */}
					<div className="flex flex-wrap gap-8 items-start w-full text-neutral-500 max-md:max-w-full">
						<label
							htmlFor="voucherName"
							className="flex leading-4 w-[178px] h-[32px] items-center"
						>
							Nama Voucher*
						</label>
						<div className="flex flex-col leading-tight min-w-[240px] w-[360px]">
							<input
								id="voucherName"
								name="voucherName"
								type="text"
								className={`flex-1 shrink gap-2 self-stretch p-3 w-full bg-white rounded-md border border-solid ${
									isFieldError("voucherName")
										? "border-red-500 focus:outline-red-500"
										: "border-neutral-500"
								} max-h-[32px] disabled:bg-neutral-200 disabled:text-neutral-900`}
								placeholder="Contoh : Diskon Tahun Baru"
								value={formData.voucherName}
								onChange={handleChange}
								maxLength={60}
								disabled={isStatusActive}
							/>
							<div className="flex gap-3 items-start mt-2 w-full h-[7px]">
								{isFieldError("voucherName") ? (
									<div className="flex-1 shrink basis-0 text-red-500">
										{errors.voucherName}
									</div>
								) : (
									<div className="flex-1 shrink basis-0">
										Catatan : Nama voucher tidak tampil di
										sisi Pembeli
									</div>
								)}
								<div className="text-right">
									{formData.voucherName.length}/60
								</div>
							</div>
						</div>
					</div>

					{/* Kode Voucher */}
					<div className="flex flex-wrap gap-8 items-start w-full max-md:max-w-full">
						<label
							htmlFor="voucherCode"
							className="flex leading-4 text-neutral-500 w-[178px] h-[32px] items-center"
						>
							Kode*
						</label>
						<div className="flex flex-col w-[190px]">
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2">
									<div className="gap-2.5 self-stretch my-auto">
										{storeCode}
									</div>
								</div>
								<input
									id="voucherCode"
									name="voucherCode"
									type="text"
									className={`flex-1 shrink gap-2 self-stretch p-3 bg-white max-h-[32px]  text-neutral-500 pl-14 w-full  border rounded ${
										isFieldError("voucherCode")
											? "border-red-500 focus:outline-0"
											: "border-neutral-500"
									} disabled:bg-neutral-200 disabled:text-neutral-900`}
									placeholder="Maksimum 8 karakter"
									value={formData.voucherCode}
									onChange={handleChange}
									maxLength={8}
									disabled={
										isStatusActive || isStatusUpcoming
									}
								/>
							</div>
							{isFieldError("voucherCode") && (
								<div className="mt-1.5 text-red-500">
									{errors.voucherCode}
								</div>
							)}
						</div>
					</div>

					{/* Target */}
					<div className="flex flex-wrap gap-8 items-start max-w-full w-[944px]">
						<div className="leading-tight text-neutral-500 w-[178px]">
							Target*
						</div>
						<div className="flex gap-5 items-start min-w-[240px] max-md:max-w-full">
							<label className="flex flex-col w-[220px]">
								<div className="flex gap-2 items-center self-start leading-tight text-black whitespace-nowrap">
									<input
										type="radio"
										name="target"
										value="Publik"
										checked={formData.target === "Publik"}
										onChange={handleChange}
										className="accent-blue-600 "
										disabled={
											isStatusActive &&
											formData.target === "Terbatas"
										}
									/>
									<div className="self-stretch my-auto">
										Publik
									</div>
								</div>
								<div className="flex-1 shrink gap-2.5 self-stretch pl-6 mt-1 w-full leading-4 text-neutral-500 max-md:pl-5">
									Semua pembeli dapat melihat dan menggunakan
									voucher
								</div>
							</label>
							<label className="flex flex-col w-56">
								<div className="flex gap-2 items-center self-start leading-tight text-black whitespace-nowrap">
									<input
										type="radio"
										name="target"
										value="Terbatas"
										checked={formData.target === "Terbatas"}
										onChange={handleChange}
										className="accent-blue-600 "
										disabled={
											isStatusActive &&
											formData.target === "Publik"
										}
									/>
									<div className="self-stretch my-auto">
										Terbatas
									</div>
								</div>
								<div className="flex-1 shrink gap-2.5 self-stretch pl-6 mt-1 w-full leading-4 text-neutral-500 max-md:pl-5">
									Hanya pembeli yang kamu berikan kode, dapat
									menggunakan voucher
								</div>
							</label>
						</div>
					</div>

					{/* Masa Berlaku */}
					<div className="flex flex-wrap gap-8 items-start w-full max-md:max-w-full">
						<label className="flex shrink gap-1 self-stretch leading-4 text-neutral-500 w-[178px] max-w-[178px] h-[32px] items-center">
							Masa Berlaku*
						</label>
						<div className="flex flex-col flex-1 shrink items-start leading-tight text-black basis-0 min-w-[240px] max-md:max-w-full">
							<div className="flex gap-2 justify-center items-start">
								<input
									type="datetime-local"
									name="startDate"
									className="flex gap-2 items-center px-3 py-2 w-40 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]  disabled:bg-neutral-200 disabled:text-neutral-900"
									value={formData.startDate}
									onChange={handleChange}
									disabled={isStatusActive}
								/>
								<div className="flex font-semibold leading-4 w-[18px] h-[32px] items-center">
									s/d
								</div>
								<input
									type="datetime-local"
									name="endDate"
									className="flex gap-2 items-center px-3 py-2 w-40 bg-white rounded-md border border-solid border-neutral-500 min-h-[32px]"
									value={formData.endDate}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
