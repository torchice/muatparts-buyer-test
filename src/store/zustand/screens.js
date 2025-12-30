import { create  } from "zustand";
import { persist } from 'zustand/middleware';

const useScreen = create((set,get) => ({
    screens: [],
    currentScreen:{},
    setScreen:(val)=>{
        const sc = get().screens?.length?get().screens:[]
        const newScreens=[...sc,val]
        set({screens:newScreens,currentScreen:val})
    },
    popScreen:(val)=>{
        const lastIndex=get().screens?.length-1
        const sc = get().screens?.length?get().screens:[]
        const newScreens=val?val:sc.filter((_,i)=>i!==lastIndex)
        set({screens:newScreens,currentScreen:newScreens[newScreens?.length-1]|{}})
    },
    resetScreen:()=>set({currentScreen:{},screens:[]})
}));

export default useScreen;