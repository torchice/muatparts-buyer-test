import { create } from "zustand";

const useTroliStore = create((set, get) => ({
  cartBody: {},

  cartDelete: {},

  cartPut: {},
  carts:[],
  voucherAvailable: [],
  totalSelectedItems: 0,
  totalPrice: 0,

  setCartBody: (value) => set({ cartBody: value }),
  setCartDelete: (value) => set({ cartDelete: value }),
  setCartPut: (value) => set({ cartPut: value }),
  setCarts:(value)=>set({carts:value}),

  // setTroliItems:(value,id)=>{
  //   const stock =  parseInt(value?.Stock)
  //   if(!get().troliItems?.length&&stock) {
  //     let newItem = value
  //     value.amount=
  //   }
  //   let tmp = get().troliItems?.
  // },
  setVoucherAvailable: (voucher) => set({ voucherAvailable: voucher }),
  setTotalSelectedItems: (total) => set({ totalSelectedItems: total }),
  setTotalPrice: (price) => set({ totalPrice: price }),
}));

export default useTroliStore;
