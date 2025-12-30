import { create } from "zustand";

const addProductState = create((set, get) => ({
  informasiProduk: {
    ProductName: "",
    Categories: {
      GroupcategoryID: null,
      CategoryID: null,
      // optional
      SubcategoryID: null,
      // optional
      ItemID: null,
    },
    category: [],
    GradeID: "",
    ProductPhotos: [
      {
        value: null,
      },
      {
        value: null,
      },
      {
        value: null,
      },
      {
        value: null,
      },
    ],
    UrlVideo: "",
    EtalaseID: "",
  },
  detailProduk: {
    ConditionID: "",
    Brand: { ID: null, BrandName: "" },
    ProductDescription: "",
  },
  informasiPenjualan: {
    SaleType: "Satuan/Ecer",
    MinPurchase: 0,
    HaveVariant: false,
    Price: 0,
    Stock: 0,
    SKUCode: "",
    Bonus: [],
    inputVarian: "",
    varian: [],
    Variants: [],
    Wholesales: [],
  },
  pengirimanProduk: {
    kustom_opsi_pengiriman: [],
    berat_pengiriman: "",
    dimensi: [
      { title: "Panjang", value: "" },
      { title: "Lebar", value: "" },
      { title: "Tinggi", value: "" },
    ],
    biaya_pengiriman: "Ditanggung oleh Pembeli",
    opsi_pengiriman: "Standar",
    ShippingIDs: [],
    asuransi_pengiriman: "Wajib",
  },
  validation:[],
  validationResponse:{},
  screen:'',
  setProducts: (section,field,value) =>{
    set(state=>({[section]:{...state[section],[field]:value}}))},
  setVariantData:(id,field,value)=>{
    const newVal = get()?.informasiPenjualan?.Variants?.map(val=>{
      if(val.ID===id){
        val[field]=value
      }
      return val
    })
    get().setProducts('informasiPenjualan',field,newVal)
  },
  setDimensi: (title, value) =>
    set((state) => ({
      pengirimanProduk: {
        ...state.pengirimanProduk,
        dimensi: state.pengirimanProduk.map((item) =>
          item.title === title ? { title, value } : item
        ),
      },
    })),
  setScreen: (val) => set({ screen: val }),
  setValidation: (field, msg, opt) =>
    set((state) => {
      let updatedValidation;

      if (field === null && msg === null) {
        updatedValidation = [];
      } else if (msg === "") {
        updatedValidation = state.validation.filter((x) => x.key != field);
      } else {
        updatedValidation = [
          ...state.validation.filter((x) => x.key != field),
          {
            key: field,
            msg: msg,
            children: opt || null,
          },
        ];
      }

      return { validation: updatedValidation };
    }),
}));

export default addProductState;
