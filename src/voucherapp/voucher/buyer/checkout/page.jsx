"use client";
import React, { useState } from "react";
import ChevronRight from "@/components/Voucher/ChevronRight";
import ModalPilihVoucher from "@/components/Voucher/checkout/ModalPilihVoucher";

const BuyerCheckout = () => {
	const [sellerId, setSellerId] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [usedVoucher, setUsedVoucher] = useState(null);
	const handleSelectVoucher = id => {
		setSellerId(id);
		setIsOpen(true);
	};
	return (
		<>
			<div className="p-8">
				<button
					className="text-blue-700"
					onClick={() =>
						handleSelectVoucher(
							"cf7c0d3c-58a0-4b6f-b009-78f335d198be"
						)
					}
				>
					Gunakan Voucher Penjual
				</button>
			</div>
			<ModalPilihVoucher
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				sellerId={sellerId}
				setUsedVoucher={setUsedVoucher}
				usedVoucher={usedVoucher}
			/>
		</>
	);
};

export default BuyerCheckout;
