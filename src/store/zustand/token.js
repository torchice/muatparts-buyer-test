const { create } = require("zustand");
const { persist } = require("zustand/middleware");

export const useToken = create(
  persist(
    (set) => ({
      token: {
        accessToken: "",
        refreshToken: "",
      },
      setToken: (val) => set({ token: val }),
      clearToken: () => {
        localStorage.removeItem("mp-tkn");
        set({
          token: {
            accessToken: "",
            refreshToken: "",
          },
        });
      },
    }),
    {
      name: "mp-tkn",
    }
  )
);
