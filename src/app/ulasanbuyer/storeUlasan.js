import { modal } from "@/store/modal";
import { create } from "zustand";

// 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051
const useUlasanStore = create((set, get) => ({
  // Data
  form: {
    productId: "",
    transactionId: "",
    productName: "",
    variant: "",
    rating: 0,
    ulasanText: "",
    uploadedPhotos: Array(5).fill(null),
    hover: 0,
  },

  // Actions
  setForm: (data) =>
    set((state) => ({
      form: { ...state.form, ...data },
    })),

  setRating: (value) =>
    set((state) => ({
      form: {
        ...state.form,
        rating: state.form.rating === value ? 0 : value,
      },
    })),

  addPhoto: (url, index = -1) =>
    set((state) => {
      const photos = [...state.form.uploadedPhotos];
      
      // Jika index diberikan dan valid, gunakan index tersebut
      if (index >= 0 && index < photos.length) {
        photos[index] = url;
      } else {
        // Jika tidak, cari index kosong pertama
        const firstEmptyIndex = photos.findIndex((photo) => photo === null);
        
        if (firstEmptyIndex !== -1) {
          // Jika ada slot kosong, masukkan ke slot kosong pertama
          photos[firstEmptyIndex] = url;
        }
      }

      return {
        form: {
          ...state.form,
          uploadedPhotos: photos,
        },
      };
    }),

  removePhoto: (index) =>
    set((state) => {
      // Ambil foto yang ada (tidak null)
      const existingPhotos = state.form.uploadedPhotos.filter(
        (p) => p !== null
      );

      // Hapus foto pada index yang dipilih
      existingPhotos.splice(index, 1);

      // Pad array dengan null sampai length 5
      const finalPhotos = [...existingPhotos];
      while (finalPhotos.length < 5) {
        finalPhotos.push(null);
      }

      return {
        form: {
          ...state.form,
          uploadedPhotos: finalPhotos,
        },
      };
    }),
  validateForm: () => {
    const { rating } = get().form;
    if (rating === 0) {
      return {
        isValid: false,
        error: "Kualitas produk wajib diisi",
      };
    }
    return {
      isValid: true,
      error: null,
    };
  },
  resetForm: () => {
    set({
      form: {
        productId: "",
        transactionId: "",
        productName: "",
        variant: "",
        rating: 0,
        ulasanText: "",
        uploadedPhotos: Array(5).fill(null),
        hover: 0,
      },
    });

    const { setModalOpen, setModalConfig } = modal.getState();
    setModalOpen(false);
    setModalConfig({
      onClose: undefined,
    });
  },
}));
// 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051

export default useUlasanStore;