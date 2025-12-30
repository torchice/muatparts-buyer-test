import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const authZustand = create(persist(
    (set,get)=>({
        accessToken:'',
        refreshToken:'',
        setToken:val=>{
            get().clearToken()
            set({accessToken:val.accessToken,refreshToken:val.refreshToken})
        },
        clearToken:()=>{
            localStorage.removeItem('t-ash')
            localStorage.removeItem('t-l')
            set({accessToken:'',refreshToken:''})
        }
    }),
    {
        name:'t-ash',
        storage:createJSONStorage(()=>localStorage)
    }
))