import { useEffect } from "react";

export default function ModalKonfirmasi({
	isOpen,
	onClose,
	onConfirm,
	message,
}) {
	useEffect(() => {
		const handleEscape = e => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleClose = () => {
		onClose?.();
	};

	return (
		<div className="fixed inset-0 z-50">
			<div
				className="fixed inset-0 bg-black/30 transition-opacity"
				onClick={onClose}
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
						className="object-contain w-full"
					/>
					<button
						className="absolute top-2 right-2 z-0 w-5 h-5"
						onClick={handleClose}
						aria-label="Close"
					></button>
					<div className="flex flex-col justify-center items-center px-6 py-9 w-full">
						<h2
							id="modal-title"
							className="font-medium leading-4 text-center text-black max-w-[510px]"
						>
							{message}
						</h2>
						<div className="flex gap-2 items-start mt-6 font-semibold leading-tight whitespace-nowrap">
							<button
								type="button"
								onClick={onClose}
								className="gap-1 self-stretch px-6 py-3 text-blue-600 bg-white rounded-3xl border border-blue-600 border-solid min-h-[32px] min-w-[112px] hover:bg-blue-50 transition-colors"
							>
								Batal
							</button>
							<button
								type="button"
								onClick={() => {
									onConfirm();
								}}
								className="gap-1 self-stretch px-6 py-3 text-white bg-blue-600 rounded-3xl min-h-[32px] min-w-[112px] hover:bg-blue-700 transition-colors"
							>
								Ya
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
