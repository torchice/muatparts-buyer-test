import { create } from 'zustand';

const useLocationStore = create((set, get) => ({
  addressData: {},
  address: "",
  location: {
    id: "",
    title: "",
  },
  district: {
    name: "",
    value: "",
  },
  city: {
    name: "",
    id: null,
  },
  province: {
    name: "",
    id: null,
  },
  postalCode: {
    name: "",
    value: "",
  },
  coordinates: {
    lat: -7.2575,
    long: 112.7521,
  },
  kecamatanList: [],
  postalCodeList: [],
  searchResults: [],

  setAddressData: () => set({ addressData: {
    address: get().address,
    location: get().location,
    district: get().district,
    city: get().city,
    province: get().province,
    postalCode: get().postalCode,
    coordinates: get().coordinates,
  }}),


  setAddress: (address) => set({ address }),
  setLocation: (location) => set({ location }),
  setDistrict: (district) => set({ district }),
  setCity: (city) => set({ city }),
  setProvince: (province) => set({ province }),
  setPostalCode: (postalCode) => set({ postalCode }),
  setCoordinates: (coordinates) => set({ coordinates }),
  setKecamatanList: (list) => set({ kecamatanList: list }),
  setPostalCodeList: (list) => set({ postalCodeList: list }),
  setSearchResults: (results) => set({ searchResults: results }),

  resetAllStates: () => set({
    location: {
      id: "",
      title: "",
    },
    district: {
      name: "",
      value: "",
    },
    city: {
      name: "",
      id: null,
    },
    province: {
      name: "",
      id: null,
    },
    postalCode: {
      name: "",
      value: "",
    },
    coordinates: {
      lat: -7.2575,
      long: 112.7521,
    },
    kecamatanList: [],
    postalCodeList: [],
    searchResults: [],
  }),
}));

const useDetailLocationStore = create((set, get) => ({
  isDetailLocationOpen: false,
  isDetailMode: 'add',

  detailName: "",
  detailAddress: "",
  detailLocation: {
    id: "",
    title: "",
  },
  detailDistrict: {
    name: "",
    value: "",
  },
  detailCity: {
    name: "",
    id: null,
  },
  detailProvince: {
    name: "",
    id: null,
  },
  detailPostalCode: {
    name: "",
    value: "",
  },
  detailCoordinates: {
    lat: -7.2575,
    long: 112.7521,
  },
  detailPicName: "",
  detailPicPhone: "",
  detailUserId: "",
  detailIsMainAddess: 0,

  detailKecamatanList: [],
  detailPostalCodeList: [],

  setDetailName: (name) => set({ detailName: name }),
  setDetailAddress: (address) => set({ detailAddress: address }),
  setDetailLocation: (location) => set({ detailLocation: location }),
  setDetailDistrict: (district) => set({ detailDistrict: district }),
  setDetailCity: (city) => set({ detailCity: city }),
  setDetailProvince: (province) => set({ detailProvince: province }),
  setDetailPostalCode: (postalCode) => set({ detailPostalCode: postalCode }),
  setDetailCoordinates: (coordinates) => set({ detailCoordinates: coordinates }),
  setDetailPicName: (name) => set({ detailPicName: name }),
  setDetailPicPhone: (phone) => set({ detailPicPhone: phone }),
  setDetailUserId: (userId) => set({ detailUserId: userId }),
  setDetailIsMainAddess: (isMainAddress) => set({ detailIsMainAddess: isMainAddress }),
  
  setDetailKecamatanList: (list) => set({ detailKecamatanList: list }),
  setDetailPostalCodeList: (list) => set({ detailPostalCodeList: list }),

  openDetailLocation: (mode) => set({ isDetailLocationOpen: true, isDetailMode: mode }),
  closeDetailLocation: () => set({ isDetailLocationOpen: false,
    // Reset all states
    detailName: "",
    detailAddress: "",
    detailLocation: {
      id: "",
      title: "",
    },
    detailDistrict: {
      name: "",
      value: "",
    },
    detailCity: {
      name: "",
      id: null,
    },
    detailProvince: {
      name: "",
      id: null,
    },
    detailPostalCode: {
      name: "",
      value: "",
    },
    detailCoordinates: {
      lat: -7.2575,
      long: 112.7521,
    },
    detailPicName: "",
    detailPicPhone: "",
    detailUserId: "",
    detailIsMainAddess: 0,
    detailKecamatanList: [],
    detailPostalCodeList: [],
   }),
}));

export { useLocationStore, useDetailLocationStore };