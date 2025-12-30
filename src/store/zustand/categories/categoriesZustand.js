import { create } from "zustand";

export const categoriesZustand = create((set)=>({
    categories:[],
    breadCrumbCategories:[],
    setCategories: val=>set({categories:val}),
    setBreadCrumbCategories: val=>set({breadCrumbCategories:val})
}))