import { create } from "zustand";

const aturmasalProduk = create((set) => ({
  listProduk: [],
  setListProduk: (value) => set({ listProduk: value }),
  isActiveMassal: false,
  setIsActiveMassal: (value) => set({isActiveMassal : value}),
  isAllChecked: false,
  setIsAllChecked: (value) => set({isAllChecked : value})
}));

export default aturmasalProduk;
