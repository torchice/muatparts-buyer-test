import { authZustand } from "@/store/auth/authZustand";
export const customFetcher = async (url, options) => {
	const res = await fetch(url, {
		...options,
		headers: {
			...options?.headers,
			"Authorization":'Bearer '+authZustand.getState()?.accessToken,
			"refreshToken":authZustand.getState()?.refreshToken,
			"Content-Type": "application/json",
		},
	});
	if (res.ok) return await res.json();
};
export const customFetcherBuyer = async (url, options) => {
	const res = await fetch(url, {
		...options,
		headers: {
			...options?.headers,
			"Authorization":'Bearer '+authZustand.getState()?.accessToken,
			"refreshToken":authZustand.getState()?.refreshToken,
			"Content-Type": "application/json",
		},
	});
	if (res.ok) return await res.json();
};
