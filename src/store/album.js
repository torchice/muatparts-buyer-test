import { create } from "zustand";

const useAlbumStore = create((set, get) => ({
  modalNewAlbum: false,
  page: 1,
  limit: 10,
  filterAlbum: {
    search: "",
    sort: null,
    filter: {
      brands: [],
      categories: [],
      stock: ""
    },
  },
  triggerAlbum: 0,
  setTriggerAlbum: (state) => set({ triggerAlbum: state }),
  isSuccessUpdateAlbum: false,
  setIsSuccessUpdateAlbum: (value) => set({ isSuccessUpdateAlbum: value }),
  isSuccessDeleteAlbum: false,
  setIsSuccessDeleteAlbum: (value) => set({ isSuccessDeleteAlbum: value }),
  deleteAlbumMessage: "",
  setDeleteAlbumMessage: (value) => set({ deleteAlbumMessage: value }),

  dataAlbum: [],
  setDataAlbum: (value) => set({ dataAlbum: value }),

  fetchAlbum: false,
  setFetchAlbum: (value) => set({ fetchAlbum: value }),

  fetchDetail: false,
  setFetchDetail: (value) => set({ fetchDetail: value }),

  modalMoveAlbum: false,
  setModalMoveAlbum: (value) => set({ modalMoveAlbum: value }),

  valueAddItems: {},
  setAddItems: (ids) => set({
    valueAddItems: {
      productIds: ids
    }
  }),
  setAddItemsName: (name) => set({
    valueAddItems: {
      ...get().valueAddItems,
      name: name,
    }
  }),
  setAddItemsTarget: (target) => set({
    valueAddItems: {
      ...get().valueAddItems,
      targetAlbumId: target,
    }
  }),
  clearAddItems: () => set({
    valueAddItems: {}
  }),
  


  valueMoveAlbum: {},

  setMoveAlbumTarget: (target) => set({ 
    valueMoveAlbum: {
      ...get().valueMoveAlbum,
      targetAlbumId: target
    }
  }),
  setMoveAlbumItems: (ids) => set({
    valueMoveAlbum: {
      ...get().valueMoveAlbum,
      itemIds: ids
    }
  }),
  setMoveAlbumName: (name) => set({
    valueMoveAlbum: {
      ...get().valueMoveAlbum,
      name: name
    }
  }),
  clearMoveItems: () => set({
    valueMoveAlbum: {}
  }),

  setModalNewAlbum: (value) => set({ modalNewAlbum: value }),
  setFilterAlbum: (value) => set({ filterAlbum: value }),
  resetFilterAlbum: () => set({ filterAlbum: {
    search: "",
    sort: null,
    filter: {
      brands: [],
      categories: [],
      stock: ""
    }
  }})
}));

export default useAlbumStore;