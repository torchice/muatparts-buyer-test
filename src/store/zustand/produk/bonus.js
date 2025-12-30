import { create } from "zustand";

const bonus = create((set) => ({
  dataBonus: [
    {
        id: 1,
        name: 'Garani 1 Tahun',
        value: 'Garani 1 Tahun',
        checked: false,
        disabled: false
    },
    {   
        id: 2,
        name: 'Garani 2 Tahun',
        value: 'Garani 2 Tahun',
        checked: false,
        disabled: false
    },
    {   
        id: 3,
        name: 'Garani 3 Tahun',
        value: 'Garani 3 Tahun',
        checked: false,
        disabled: false
    },
    {   
        id: 4,
        name: 'Garani 4 Tahun',
        value: 'Garani 4 Tahun',
        checked: false,
        disabled: false
    }
  ],
  setDataBonus: (data) =>
    set((state) => ({
        dataBonus: [data, ...state.dataBonus],
    })),
//   UpdateDataBonus: (data) =>
//     set((state) => ({
//         dataBonus: state,
//     })),
// Ilham 
}));

export default bonus;
