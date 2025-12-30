// Format value as currency (IDR) and remove formatting for validation
export const formatCurrency = (value, withSymbol = false) => {
	return new Intl.NumberFormat("id-ID", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
		currency: "IDR",
		style: withSymbol ? "currency" : undefined,
	})
		.format(value)
		.replace(/\s/g, "");
};

export const parseCurrency = value => value.replace(/[^0-9]/g, "");
