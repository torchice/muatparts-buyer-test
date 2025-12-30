import { create } from "zustand";

export const categoriesZustand = create((set,get)=>({
    categories:[],
    categoryFamily:[],
    getSubAndItem:[],
    category:null,
    setCategories:val=>set({categories:val}),
    generateCategoryFamily:(val,ctg)=>{
        let index=0
        let container = get()?.categories || ctg
        console.log(container)
        let tmp = []
        function generate(data) {
            for (let i = 0; i < data?.length; i++) {
                if(data[i]['id']===val[index]){
                    index++
                    tmp.push({
                        id:data[i]['id'],
                        value:data[i]['value']
                    })
                    if((val.length-1)==index){
                        set({categoryFamily:tmp})
                    }
                    if((val.length-1)<=index){
                        generate(data[i]['children'])
                    }
                }
            }
        }
        generate(container)
    },
    setSubAndItem:(val)=>set({getSubAndItem:val}),
    setCategory:val=>set({category:val})
}))