import { create } from 'zustand';

const useOrderStore = create((set, get) => ({
  
}));

const useOrderDetailStore = create((set, get) => ({
  orderStatus: "",

  setOrderStatus: (status) => set({ orderStatus: status }),
}));

export { useOrderStore, useOrderDetailStore };