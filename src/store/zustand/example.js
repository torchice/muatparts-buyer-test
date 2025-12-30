import { create } from 'zustand';

const useInputStore = create((set) => ({
    name: '',
    age: 0,
    updateName: (name) => (set(() =>({name: name}))),
    updateAge: (age) => (set(() =>({age: age}))),
}));

export default useInputStore;