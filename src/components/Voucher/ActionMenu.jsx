export function ActionMenu({
	status,
	onDelete,
	onEnd,
	onDetail,
	onEdit,
	onCopy,
	onEditQuota,
}) {
	// Define menu items based on status
	const getMenuItems = () => {
		const baseItems = [
			{ text: "Detail", onClick: onDetail },
			{ text: "Salin", onClick: onCopy },
		];

		if (status === "Aktif" || status === "Akan Datang") {
			baseItems.push({ text: "Ubah", onClick: onEdit });
			baseItems.push({ text: "Ubah Kuota", onClick: onEditQuota });
		}
		if (status === "Aktif") {
			baseItems.push({
				text: "Akhiri",
				onClick: onEnd,
				isRed: false,
			});
		} else if (status === "Akan Datang") {
			baseItems.push({
				text: "Hapus",
				onClick: onDelete,
				isRed: true,
				customColor: "#C22716",
			});
		}

		return baseItems;
	};

	return (
		<div className="relative">
			<div className="flex flex-col w-[194px] bg-white rounded shadow-md border border-stone-300 mr-[4px]">
				{getMenuItems().map((item, index) => (
					<button
						key={index}
						onClick={item.onClick}
						className={`
              flex items-start px-4 py-2 text-xs w-full text-left
              ${
					item.customColor
						? ""
						: item.isRed
						? "text-red-600"
						: "text-neutral-700"
				}
              hover:bg-gray-50 transition-colors duration-150 ease-in-out
            `}
						style={
							item.customColor ? { color: item.customColor } : {}
						}
						role="menuitem"
					>
						{item.text}
					</button>
				))}
			</div>
		</div>
	);
}
