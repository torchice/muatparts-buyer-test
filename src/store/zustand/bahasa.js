import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const bahasaZus = create(
  persist(
    (set) => ({
      bahasa: {
        icon: "/img/idflag.png",
        title: "Bahasa Indonesia (IDN)",
        value: "IDN",
        link: "id",
      },
      bahasa: {
        icon: "/img/idflag.png",
        title: "English (EN)",
        value: "IDN",
        link: "en",
      },
      setBahasa: (selected) =>
        set({ 
          bahasa: selected 
        }),
    }),
    {
      name: "locale",
      getStorage: () => localStorage,
    }
  )
);

export default bahasaZus;
