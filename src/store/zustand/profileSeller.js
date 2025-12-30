import { create } from "zustand";

const useProfileStore = create((set, get) => ({
  // Main data
  profileData: null,

  // Edit states
  storeEdit: {
    data: {
      storeName: "",
      storeLogo: "",
      address: "",
      location: "",
      provinceID: "",
      cityID: "",
      districtID: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
    errors: {},
  },

  companyEdit: {
    data: {
      companyLogo: "",
      address: "",
      location: "",
      provinceID: "",
      cityID: "",
      districtID: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
    errors: {},
  },

  // Setters
  setProfileData: (data) => set({ profileData: data }),

  validateStoreData: (data) => {
    console.log("Validating data:", data); // tambah ini

    const errors = {};
    let isValid = true;

    // Validasi nama toko
    if (!data.storeName?.trim()) {
      errors.storeName = "Nama Toko wajib diisi";
      isValid = false;
    }

    // Validasi lokasi
    const locationErrors = {};

    // Validasi alamat
    if (!data.address) {
      locationErrors.address = "Alamat wajib diisi!";
      isValid = false;
    }

    // Validasi lokasi
    if (!data.location?.title) {
      locationErrors.location = "Lokasi wajib diisi!";
      isValid = false;
    }

    // Validasi kecamatan
    if (!data.district?.value) {
      locationErrors.district = "Kecamatan wajib diisi!";
      isValid = false;
    }

    if (Object.keys(locationErrors).length > 0) {
      errors.location = locationErrors;
    }

    // Set errors ke state
    set((state) => ({
      storeEdit: {
        ...state.storeEdit,
        errors,
      },
    }));

    console.log("Validation result:", { isValid, errors }); // tambah ini
    return isValid;
  },

  validateCompanyData: (data) => {
    const locationErrors = {};
    let isValid = true;

    if (!data.address?.trim()) {
      locationErrors.address = "Wajib diisi";
      isValid = false;
    }

    if (!data.location?.title?.trim()) {
      locationErrors.location = "Wajib diisi";
      isValid = false;
    }

    if (!data.district?.name?.trim()) {
      locationErrors.district = "Wajib diisi";
      isValid = false;
    }

    set((state) => ({
      companyEdit: {
        ...state.companyEdit,
        errors: {
          location: locationErrors, // Hanya location errors untuk company
        },
      },
    }));

    return isValid;
  },

  // Error handlers
  setStoreError: (key, message) =>
    set((state) => ({
      storeEdit: {
        ...state.storeEdit,
        errors: {
          ...state.storeEdit.errors,
          [key]: message,
        },
      },
    })),

  setCompanyError: (key, message) =>
    set((state) => ({
      companyEdit: {
        ...state.companyEdit,
        errors: {
          ...state.companyEdit.errors,
          [key]: message,
        },
      },
    })),

  // Initialize functions
  initializeStoreEdit: () => {
    const { profileData } = get();
    const storeInfo = profileData?.storeInformation || {};

    set((state) => ({
      storeEdit: {
        data: {
          // Ambil semua data dari profileData.storeInformation
          storeName: storeInfo.storeName || "",
          storeLogo: storeInfo.storeLogo || "",
          address: storeInfo.address || "",
          location: storeInfo.location || "",
          provinceID: storeInfo.provinceID || "",
          cityID: storeInfo.cityID || "",
          districtID: storeInfo.districtID || "",
          postalCode: storeInfo.postalCode || "",
          latitude: storeInfo.latitude || "",
          longitude: storeInfo.longitude || "",
          // Tambahkan data lain yang dibutuhkan
          listPostalCode: storeInfo.listPostalCode || [],
          listDistrict: storeInfo.listDistrict || [],
        },
        errors: {},
      },
    }));
  },

  initializeCompanyEdit: () => {
    const { profileData } = get();
    const companyInfo = profileData?.companyData || {};

    set((state) => ({
      companyEdit: {
        data: {
          // Ambil semua data dari profileData.companyData
          companyLogo: companyInfo.companyLogo || "",
          address: companyInfo.address || "",
          location: companyInfo.location || "",
          provinceID: companyInfo.provinceID || "",
          cityID: companyInfo.cityID || "",
          districtID: companyInfo.districtID || "",
          postalCode: companyInfo.postalCode || "",
          latitude: companyInfo.latitude || "",
          longitude: companyInfo.longitude || "",
          // Tambahkan data lain yang dibutuhkan
          listPostalCode: companyInfo.listPostalCode || [],
          listDistrict: companyInfo.listDistrict || [],
          // Tambahan data company
          companyName: companyInfo.companyName || "",
          businessEntity: companyInfo.businessEntity || "",
          businessField: companyInfo.businessField || "",
        },
        errors: {},
      },
    }));
  },

  // Update fields
  updateStoreField: (key, value) =>
    set((state) => ({
      storeEdit: {
        ...state.storeEdit,
        data: { ...state.storeEdit.data, [key]: value },
        errors: { ...state.storeEdit.errors, [key]: "" },
      },
    })),

  updateCompanyField: (key, value) =>
    set((state) => ({
      companyEdit: {
        ...state.companyEdit,
        data: { ...state.companyEdit.data, [key]: value },
        errors: { ...state.companyEdit.errors, [key]: "" },
      },
    })),

  // Reset forms
  resetForms: () =>
    set({
      storeEdit: { data: {}, errors: {} },
      companyEdit: { data: {}, errors: {} },
    }),
}));

export default useProfileStore;
