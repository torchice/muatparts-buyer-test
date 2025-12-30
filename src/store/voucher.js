import { create } from "zustand";

const useVoucherStore = create((set) => ({
    usedVoucher: null,
    setUsedVoucher: (voucher) => set({usedVoucher: voucher})
}));

export default useVoucherStore;