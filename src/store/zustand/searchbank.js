import { create } from "zustand";

const searchbank = create((set) => ({
  showSearchDropdown: {},
  setSearchDropdown: (value) => set({ showSearchDropdown: value }),
}));

export default searchbank;
