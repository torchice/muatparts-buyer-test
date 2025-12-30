import { create } from "zustand";
import toast from "./toast";

export const laporkanProduk = create((set, get) => ({
  dataLaporkan: {
    OpsiPelanggaran: { value: "", validation: "" },
    DetailPelanggaran: { value: "", validation: "" },
    FotoPelanggaran: { value: [], validation: "" },
    LinkPelanggaran: { value: "", validation: "" },
    CheckboxPelanggaran: { value: false, validation: "" },
  },

  // Di store/zustand/laporkanProduk.js
  setDataLaporkan: (field, value) => {
    set((state) => {
      // Cek apakah field ini memiliki error sebelumnya
      const hasError = state.dataLaporkan[field].validation !== "";

      // Update state dengan value baru dan hapus validation message
      const newState = {
        dataLaporkan: {
          ...state.dataLaporkan,
          [field]: {
            ...state.dataLaporkan[field],
            value: value,
            validation: "", // Reset validation message saat diinput
          },
        },
      };

      // Jika sebelumnya ada error, cek apakah masih ada error lain
      if (hasError) {
        const remainingErrors = Object.values(newState.dataLaporkan).some(
          (field) => field.validation !== ""
        );

        // Jika tidak ada error lain, hide toast
        if (!remainingErrors) {
          // Reset toast di sini
          toast.setState((state) => ({
            ...state,
            showToast: false,
            dataToast: { type: "", message: "" },
          }));
        }
      }

      return newState;
    });
  },

  setApiValidationErrors: (errors) => {
    set((state) => {
      const newData = { ...state.dataLaporkan };

      // Reset semua validation dulu
      Object.keys(newData).forEach((key) => {
        newData[key] = {
          ...newData[key],
          validation: "",
        };
      });

      // Set validation message sesuai response API
      errors.forEach((error) => {
        // Mapping field dari API ke field di state
        switch (error.path) {
          case "link":
            newData.LinkPelanggaran = {
              ...newData.LinkPelanggaran,
              validation: error.msg,
            };
            break;
          case "option":
            newData.OpsiPelanggaran = {
              ...newData.OpsiPelanggaran,
              validation: error.msg,
            };
            break;
          case "details":
            newData.DetailPelanggaran = {
              ...newData.DetailPelanggaran,
              validation: error.msg,
            };
            break;
          // Case lainnya sesuai field yang ada
        }
      });

      return {
        dataLaporkan: newData,
      };
    });
  },
  validateForm: (toastFunctions, isDesktop = false, t) => {
    const { setShowToast, setDataToast } = toastFunctions;
    const { dataLaporkan } = get();
    let isValid = true;
    const updatedData = { ...dataLaporkan };
    let firstErrorField = null; // untuk menyimpan field error pertama

    // Reset semua validation messages terlebih dahulu
    Object.keys(dataLaporkan).forEach((field) => {
      updatedData[field] = {
        ...updatedData[field],
        validation: "",
      };
    });

    // Validasi field wajib terlebih dahulu (kecuali checkbox)
    Object.keys(dataLaporkan).forEach((field) => {
      // Skip validation untuk field optional dan checkbox
      if (field === "LinkPelanggaran" || field === "CheckboxPelanggaran")
        return;

      const currentValue = dataLaporkan[field].value;
      let validationMessage = "";

      // Check empty values
      if (field === "OpsiPelanggaran" && !currentValue) {
        validationMessage = t("labelValidateOpsiFilled");
        isValid = false;
        if (!firstErrorField) firstErrorField = field;
      }

      // Special validation for DetailPelanggaran
      if (field === "DetailPelanggaran") {
        if (!currentValue) {
          validationMessage = t("labelValidateDetailPelanggaranFilled");
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        } else if (currentValue.length < 30) {
          validationMessage = t("labelValidateMin30Laporkan");
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      }

      if (field === "FotoPelanggaran") {
        if (!Array.isArray(currentValue) || currentValue.length === 0) {
          validationMessage = t("labelBuktiLaporanLaporkan");
          isValid = false;
          if (!firstErrorField) firstErrorField = field;
        }
      }

      updatedData[field] = {
        ...updatedData[field],
        validation: validationMessage,
      };
    });

    // Set state validation messages
    set({ dataLaporkan: updatedData });

    // Jika semua field wajib terisi, cek checkbox
    if (isValid && !dataLaporkan.CheckboxPelanggaran.value) {
      firstErrorField = "CheckboxPelanggaran";
      isValid = false;

      // Set pesan khusus untuk checkbox yang belum dicentang
      updatedData.CheckboxPelanggaran = {
        ...updatedData.CheckboxPelanggaran,
        validation: t("labelCentang1"),
      };
      set({ dataLaporkan: updatedData });

      // Tampilkan toast dengan pesan khusus untuk checkbox
      setShowToast(true);
      setDataToast({
        type: "error",
        message: t("labelCentang2"),
      });
    }
    // Jika ada field lain yang tidak valid (bukan hanya checkbox)
    else if (!isValid) {
      // Tampilkan toast dengan pesan umum
      setShowToast(true);
      setDataToast({
        type: "error",
        message: t("labelInputMustFilled"),
      });
    }

    // Jika tidak valid, scroll ke field error pertama
    if (!isValid) {
      // Timeout kecil untuk memastikan DOM sudah dirender
      setTimeout(() => {
        // Cari element berdasarkan atribut data-field
        const errorElement = document.querySelector(
          `[data-field="${firstErrorField}"]`
        );

        if (errorElement) {
          // Tentukan container scrollable
          const scrollContainer = isDesktop
            ? document.querySelector(".modal-scroll-area")
            : window;

          if (scrollContainer) {
            // Hitung posisi scroll yang dibutuhkan
            let scrollOptions;

            if (isDesktop) {
              // Untuk modal desktop
              const containerRect = scrollContainer.getBoundingClientRect();
              const elementRect = errorElement.getBoundingClientRect();
              const relativeTop = elementRect.top - containerRect.top;

              scrollOptions = {
                top: scrollContainer.scrollTop + relativeTop - 20, // 20px offset
                behavior: "smooth",
              };
            } else {
              // Untuk mobile (window scroll)
              scrollOptions = {
                top: errorElement.offsetTop - 100, // 100px offset dari atas
                behavior: "smooth",
              };
            }

            scrollContainer.scrollTo(scrollOptions);
          }
        }
      }, 100);

      return false;
    }

    return true;
  },

  resetForm: () => {
    set({
      dataLaporkan: {
        OpsiPelanggaran: { value: "", validation: "" },
        DetailPelanggaran: { value: "", validation: "" },
        FotoPelanggaran: { value: [], validation: "" },
        LinkPelanggaran: { value: "", validation: "" },
        CheckboxPelanggaran: { value: false, validation: "" },
      },
    });
  },
}));
