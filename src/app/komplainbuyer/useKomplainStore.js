import { create } from "zustand";

const useKomplainStore = create((set) => ({
  // LB - 0038 Excel Bug Komplain Buyer Web
  // LB - 0001 Excel Bug Komplain Buyer Web
  form: {
    invoiceNumber: "",
    products: [],
    mappingID: "",
    evidence: {
      photos: [],
      videos: []
    },
    description: "",
    alasanKomplain: null,
    solusiDiinginkan: null, // Ubah dari string kosong menjadi null untuk objek solusi lengkap
  },
  
  setForm: (data) => 
    set((state) => ({
      form: { 
        ...state.form, 
        ...data,
        // Pastikan evidence tidak tertimpa saat update data lain
        evidence: {
          ...state.form.evidence,
          ...(data.evidence || {})
        }
      },
    })),

  // Tambah fungsi khusus untuk evidence
  addEvidence: (type, evidence) =>
    set((state) => ({
      form: {
        ...state.form,
        evidence: {
          ...state.form.evidence,
          [type]: [...(state.form.evidence[type] || []), evidence]
        }
      }
    })),

  // Fungsi untuk update evidence berdasarkan type (photos/videos)
  updateEvidence: (type, evidenceList) =>
    set((state) => ({
      form: {
        ...state.form,
        evidence: {
          ...state.form.evidence,
          [type]: evidenceList
        }
      }
    })),

  // Fungsi untuk menghapus satu evidence
  removeEvidence: (type, url) =>
    set((state) => ({
      form: {
        ...state.form,
        evidence: {
          ...state.form.evidence,
          [type]: state.form.evidence[type].filter(item => item.url !== url)
        }
      }
    })),

  setAlasanKomplain: (alasan) =>
    set((state) => ({
      form: {
        ...state.form,
        alasanKomplain: alasan,
        // Set mappingID dari alasan yang dipilih
        mappingID: alasan.id,
        // Reset solusiDiinginkan karena perlu dipilih ulang
        solusiDiinginkan: null
      }
    })),

  setSolusiDiinginkan: (solusi) =>
    set((state) => ({
      form: {
        ...state.form,
        // Simpan objek solusi lengkap, bukan hanya ID
        solusiDiinginkan: solusi,
        // Set mappingID dari mapping_id solusi yang dipilih
        mappingID: solusi.mapping_id || solusi.id
      }
    })),

  tambahProduk: (product) =>
    set((state) => ({
      form: {
        ...state.form,
        products: [...state.form.products, product]
      }
    })),

  updateProducts: (products) =>
    set((state) => ({
      form: {
        ...state.form,
        products
      }
    })),

  resetForm: () =>
    set({
      form: {
        invoiceNumber: "",
        products: [],
        mappingID: "",
        evidence: {
          photos: [],
          videos: []
        },
        description: "",
        alasanKomplain: null,
        solusiDiinginkan: null
      }
    }),
    // LB - 0001 Excel Bug Komplain Buyer Web
    // LB - 0038 Excel Bug Komplain Buyer Web
}));

export default useKomplainStore;