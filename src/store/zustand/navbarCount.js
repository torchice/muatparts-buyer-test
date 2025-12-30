import { create  } from "zustand";
import { persist } from 'zustand/middleware';

const useNavbarCountStore = create((set) => ({
    active: null,
    count: 5,
    updateActive: (active) => (set({active: active})),
    updateCount: (total) => (set({count: total})),
}));

export default useNavbarCountStore;