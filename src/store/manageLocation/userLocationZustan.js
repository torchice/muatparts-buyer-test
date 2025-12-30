import { create } from "zustand";

export const userLocationZustan = create((set)=>({
    locations:[],
    setLocation:val=>set({locations:val})
}))