import { create } from "zustand";

export const laporkanProduk = create((set, get) => ({
  dataLaporkan: {
    OpsiPelanggaran: { value: "", validation: "" },
    DetailPelanggaran: { value: "", validation: "" },
    FotoPelanggaran: { value: null, validation: "" },
    LinkPelanggaran: { value: "" },
    CheckboxPelanggaran: { value: false, validation: "" },
  },

  setDataLaporkan: (field, value) => {
    set((state) => ({
      dataLaporkan: {
        ...state.dataLaporkan,
        [field]: {
          ...state.dataLaporkan[field],
          value: value,
        },
      },
    }));
  },

  validateForm: (toastFunctions, isDesktop = false) => {
    // Tambah parameter isDesktop
    const { setShowToast, setDataToast } = toastFunctions;
    const { dataLaporkan } = get();
    let isValid = true;
    const updatedData = { ...dataLaporkan };
    let firstError = "";

    // Validasi semua field
    Object.keys(dataLaporkan).forEach((field) => {
      if (field === "LinkPelanggaran") return;

      const currentValue = dataLaporkan[field].value;
      let validationMessage = "";

      // Reset validation message
      updatedData[field] = {
        ...updatedData[field],
        validation: "",
      };

      // Check empty values
      if (currentValue === "" || currentValue === null) {
        validationMessage = `${field
          .replace(/([A-Z])/g, " $1")
          .trim()} wajib diisi`;
        isValid = false;
      }

      // Special validation for DetailPelanggaran
      if (field === "DetailPelanggaran" && currentValue.length < 30) {
        validationMessage = "Detail Pelanggaran min. 30 karakter";
        isValid = false;
      }

      updatedData[field] = {
        ...updatedData[field],
        validation: validationMessage,
      };

      // Store first error for mobile toast
      if (!firstError && validationMessage) {
        firstError = validationMessage;
      }
    });

    set({ dataLaporkan: updatedData });

    // Desktop: toast hanya untuk checkbox dan success
    if (isDesktop) {
      if (!dataLaporkan.CheckboxPelanggaran.value) {
        setShowToast(true);
        setDataToast({
          type: "error",
          message: "Persetujuan wajib dicentang",
        });
      } else if (isValid) {
        setShowToast(true);
        setDataToast({
          type: "success",
          message: "Berhasil melaporkan produk",
        });
      }
    }
    // Mobile: toast untuk semua error dan success
    else {
      if (!isValid) {
        setShowToast(true);
        setDataToast({
          type: "error",
          message: firstError,
        });
      } else {
        setShowToast(true);
        setDataToast({
          type: "success",
          message: "Berhasil melaporkan produk",
        });
      }
    }

    return isValid;
  },

  resetForm: () => {
    set({
      dataLaporkan: {
        OpsiPelanggaran: { value: "", validation: "" },
        DetailPelanggaran: { value: "", validation: "" },
        FotoPelanggaran: { value: null, validation: "" },
        LinkPelanggaran: { value: "" },
        CheckboxPelanggaran: { value: false, validation: "" },
      },
    });
  },
}));
