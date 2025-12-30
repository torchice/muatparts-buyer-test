import { create } from "zustand";

const useWishlist = create((set,get) => ({
  modalNewAlbum: false,
  modalListFavorite: false,
  modalEditAlbum: false,
  idProductWishlist: 0,
  valueEditWishlist:{
    id:0,
    name: ''
  },
  setIdProductWishlist: (state) => set({ idProductWishlist: state  }),
  setValueEditWishlist: (state) => set({ valueEditWishlist: state }),
  setModalNewAlbum: (state) => set({ modalNewAlbum: state }),
  setModalEditAlbum: (state) => set({ modalEditAlbum: state }),
  setModalListFavorite: (state) => set({ modalListFavorite: state }),
}));

export default useWishlist;