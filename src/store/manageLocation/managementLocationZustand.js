import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const userLocationZustan = create(persist(
    (set,get)=>({
        selectedLocation:{},
        selectedLocations:[],
        locations:[],
        setLocation:val=>set({locations:val}),
        setSelectedLocation:val=>set({selectedLocation:val}),
        setSelectedLocations:val=>set({selectedLocations:val}),
        resetLocation:()=>{
            localStorage.removeItem('t-l')
            set({selectedLocation:{},
                selectedLocations:[],
                locations:[]})
        }
    }),
    {
        name:'t-l',
        storage:createJSONStorage(()=>localStorage)
    }
)
)

export const addManagementLocationZustand = create((set)=>({
    Name: "",
    Address: "",
    AddressDetail: "",
    Latitude: 0,
    Longitude: 0,
    Province: "",
    ProvinceID: 0,
    City: "",
    CityID: 0,
    District: "",
    DistrictID: 0,
    PostalCode: "",
    PicName: "",
    PicNoTelp: "",
    UsersID: '',
    PlaceID: "",
    IsMainAddress: 0,
    setState:(label,value)=>set({[label]:value}),
    setAllState:(val)=>{
        delete val?.isTroli
        set(val)
    },
    clearState:()=>set({
        Name: "",
        Address: "",
        AddressDetail: "",
        Latitude: 0,
        Longitude: 0,
        Province: "",
        ProvinceID: 0,
        City: "",
        CityID: 0,
        District: "",
        DistrictID: 0,
        PostalCode: "",
        PicName: "",
        PicNoTelp: "",
        UsersID: "",
        PlaceID: "",
        IsMainAddress: 0,
        ID: "",
        Notes: null,
        Void: 0,
    })
}))