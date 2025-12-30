import { formatCurrency } from "@/utils/currency";
import SearchFilter from "./create/SearchFilter";

const RegisteredProduct = ({
	products,
	withFilter,
	onSearch,
	onFilter,
	productSearchTerm,
	onAdd,
}) => {
	return (
		<div className="border border-neutral-400 rounded-xl w-full px-5">
			{withFilter && (
				<div className="flex my-5">
					<SearchFilter
						onSearch={onSearch}
						onFilter={onFilter}
						value={productSearchTerm}
						placeholder="Cari nama produk/SKU yang sudah dipilih"
					/>
					<button
						type="button"
						onClick={onAdd}
						className="bg-blue-600 text-white rounded-full px-8 py-3 font-semibold ml-auto"
					>
						Tambah
					</button>
				</div>
			)}
			<table className=" w-full border-collapse">
				<thead>
					<tr
						className={`border-b border-b-neutral-400 ${
							withFilter ? "border-t border-t-neutral-400" : ""
						}`}
					>
						<th className="text-xs font-bold  text-neutral-600 py-5 text-left ">
							Produk
						</th>
						<th className="text-xs font-bold text-neutral-600 py-5 text-left ">
							Harga
						</th>
						<th className="text-xs font-bold text-neutral-600 py-5 text-left ">
							Stok
						</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((product, idx) => (
						<tr
							key={`${product.name}-${idx}`}
							className="border-b border-b-neutral-400 last-of-type:border-b-0"
						>
							<td className="py-3">
								<div className="flex gap-5 ">
									<div className="w-14  relative">
										<img
											alt={product.name}
											src={product.image_url}
											className="w-full object-cover"
										/>
									</div>
									<div className="flex flex-col text-neutral-900 gap-3">
										<span className="font-bold ">
											{product.name}
										</span>
										<span className="text-xs">
											SKU : {product.sku}
										</span>
										<span className="text-xs">
											Brand : {product.brand}
										</span>
									</div>
								</div>
							</td>
							<td className="text-xs align-top py-3">
								{formatCurrency(product.price, true)}
							</td>
							<td className="text-xs align-top py-3">
								{product.stock}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RegisteredProduct;
