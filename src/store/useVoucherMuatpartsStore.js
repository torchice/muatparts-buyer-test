import { create } from "zustand";

const useVoucherMuatpartsStore = create((set, get) => ({
  price: 0,
  setPrice: (val) => set({ price: val }),

  ongkir: 0,
  setOngkir: (val) => set({ ongkir: val }),

  selectedVouchers: {
    shipping: null,
    purchase: null,
  },
  setSelectedVouchers: (vouchers) => set({ selectedVouchers: vouchers }),
  clearSelectedVouchers: () =>
    set({ selectedVouchers: { shipping: null, purchase: null } }),

  submittedVouchers: {
    shipping: null,
    purchase: null,
  },
  setSubmitedVouchers: (vouchers) =>
    set({
      submittedVouchers: vouchers,
    }),
  clearSubmitedVouchers: () =>
    set({ submittedVouchers: { shipping: null, purchase: null } }),

  clearAllShipping: () =>
    set({
      submittedVouchers: { ...get().submittedVouchers, shipping: null },
      selectedVouchers: { ...get().selectedVouchers, shipping: null },
    }),

  literallyClearAll: () =>
    set({
      price: 0,
      ongkir: 0,
      selectedVouchers: { shipping: null, purchase: null },
      submittedVouchers: { shipping: null, purchase: null },
    }),
}));

export default useVoucherMuatpartsStore;
