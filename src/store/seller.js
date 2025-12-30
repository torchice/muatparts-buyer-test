// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import { create } from "zustand";

export const defaultFilter = {
    searchQuery: "",
    rating: [],
    withMedia: false,
    sort: "",
    page: 1
}

const useSellerStore = create((set) => ({
    activeTab: 0,
    filter: defaultFilter,
    productByEtalase: [],
    reviews: [],
    search: "",

    appendProductByEtalase: (newProductByEtalase) => set((state) => ({ productByEtalase: [...state.productByEtalase, ...newProductByEtalase] })),
    appendReviews: (newReviews) => set((state) => ({ reviews: [...state.reviews, ...newReviews] })),
    setActiveTab: (activeTab) => set({ activeTab }),
    setFilter: (newFilter) => set((state) => ({ filter: { ...state.filter, ...newFilter } })),
    setProductByEtalase: (productByEtalase) => set({ productByEtalase }),
    setReviews: (reviews) => set({ reviews }),
    setSearch: (search) => set({ search }),
    setSearchQuery: () => set((state) => ({ filter: { ...defaultFilter, searchQuery: state.search } })),
    clearSearch: () => set((state) => ({ filter: { ...state.filter, searchQuery: "" }, search: "" })),
    resetFilter: () => set({ filter: defaultFilter })
}));

export default useSellerStore;