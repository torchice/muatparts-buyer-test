import { create } from "zustand";

const selectedCategories = create((set) => ({
  dataCategory: [],
  setDataCategory: (data) =>
    set((state) => ({
        dataCategory: [data, ...state.dataCategory],
    })),
}));

export default selectedCategories;
