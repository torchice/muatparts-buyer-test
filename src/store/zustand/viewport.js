const { create } = require("zustand");

export const viewport = create((set)=>({
    isMobile:null,
    setIsMobile:val=>set({isMobile:val})
}))