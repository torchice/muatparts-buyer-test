const { create } = require("zustand");

export const viewport = create((set)=>({
    isMobile:null,
    widthScreen:0,
    setIsmobile:val=>set({isMobile:val}),
    setWidthScreen:val=>set({widthScreen:val})
}))