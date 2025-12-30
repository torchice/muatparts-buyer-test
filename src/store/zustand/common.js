import { create } from 'zustand';

const viewport = create((set) => ({
    isMobile:false,
    setIsMobile:val=>set({isMobile:val}),
}));

export default viewport;