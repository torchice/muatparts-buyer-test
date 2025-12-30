const { create } = require("zustand");

export const headerProps = create((set)=>({
    headerHeight:0,
    searchTitle:'',
    searchPlaceholder:'',
    searchValue:'',
    setHeaderHeight:val=>set({headerHeight:val}),
    setSearch:(field,val)=>{
        set({[field]:val})
    }
}))