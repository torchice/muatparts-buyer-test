import IconComponent from "@/components/IconComponent/IconComponent";
import { usePathname } from "next/navigation";
import { create } from "zustand";

// const cekHome = () => {
//   const link = usePathname();
//   return link;
// };

const headerZustand = create((set) => ({
  backIcon: true,
  setBackIcon: (res) => set({ backIcon: res }),
  backIconAction: null,
  setBackIconAction: (state) => set({ backIconAction: state }),
  title: "",
  setTitle: (res) => set({ title: res }),
  iconList: [],
  setIconList: (val) => set({ iconList: val }),
  // kasih string kosong jika ingin menghilangkan header (in case seperti header yg memiliki tampilan responsive tidak seperti app mobile)
  header: false,
  setHeader: (res) => set({ header: res }),
  dataMatrix: null,
  setDataMatrix: (res) => set({ dataMatrix: res }),
}));

export default headerZustand;
