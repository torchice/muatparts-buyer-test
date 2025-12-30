import { create } from "zustand";

const useCounterStore = create((set) => ({
  fetchCounter: true,
  setFetchCounter: (val) => set({ fetchCounter: val }),
}));

export default useCounterStore;
