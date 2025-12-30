import * as React from "react";
import { useState } from "react";
import ModalKonfirmasi from "../ModalKonfirmasi";

function PageHeader({ title, modalMessage, onConfirmModal }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-wrap gap-10 justify-between items-center mt-4 w-full max-md:max-w-full">
			<div className="flex flex-wrap gap-3 items-center self-stretch my-auto text-xl font-bold leading-tight text-black min-w-[240px] w-[515px] max-md:max-w-full">
				<button
					onClick={() => setIsOpen(true)}
					className="flex items-center gap-3 hover:opacity-80 transition-opacity"
				>
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/321c9685c98bce70502461db93db649a2965ce414ff3fff545b597fe5bea846c?apiKey=60cdcdaf919148d9b5b739827a6f5b2a&"
						className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
						alt="Back"
					/>
					<div className="self-stretch my-auto">{title}</div>
				</button>
			</div>
			<ModalKonfirmasi
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				message={modalMessage}
				onConfirm={onConfirmModal}
			/>
		</div>
	);
}

export default PageHeader;
