import { create } from "zustand";

const brand = create((set) => ({
  dataBrand: [],
  setDataBrand: (data) =>
    set((state) => ({
      dataBrand: [data, ...state.dataBrand],
    })),
  setDataBrandBulk:(data)=>set({dataBrand:data}),
  // untuk data kompabilitas
  kompabilitas: {
    Brand: [
      {
        name: "brembo",
        value: "brembo",
      },
      {
        name: "motul",
        value: "motul",
      },
      {
        name: "bridgestone",
        value: "bridgestone",
      },
      {
        name: "domino",
        value: "domino",
      },
      {
        name: "michelin",
        value: "michelin",
      },
      {
        name: "tdr racing",
        value: "tdrracing",
      },
      {
        name: "kytaco",
        value: "kytaco",
      },
      {
        name: "Apple",
        value: "apple",
      },
      {
        name: "Samsung",
        value: "samsung",
      },
      {
        name: "Xiaomi",
        value: "xiaomi",
      },
      {
        name: "Dunlop",
        value: "dunlop",
      },
      {
        name: "rcb",
        value: "rcb",
      },
    ],
    Tahun: [
      {
        name: "2001",
        value: "2001",
      },
      {
        name: "2002",
        value: "2002",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
      {
        name: "2004",
        value: "2004",
      },
    ],
    Model: [
      {
        name: "Model 1",
        value: "model1",
      },
      {
        name: "Model 2",
        value: "model2",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
      {
        name: "Model 3",
        value: "model3",
      },
    ],
    Tipe: [
      {
        name: "Tipe 1",
        value: "tipe1",
      },
      {
        name: "Tipe 2",
        value: "tipe2",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
      {
        name: "Tipe 3",
        value: "tipe3",
      },
    ],
  },
  setKompabilitas: (key, data) =>
    set((state) => ({
      kompabilitas: {
        ...state.kompabilitas,
        [key]: [
          { name: data.name, value: data.value }, 
          ...state.kompabilitas[key],
        ],
      },
    })),
}));

export default brand;
