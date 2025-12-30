const { create } = require("zustand");

export const garasi = create((set) => ({
  triggerList: false,
  setTriggerList: (val) => set({ triggerList: val }),

  // Add new edit state management
  editData: null,
  isEdit: false,
  setEditData: (data) =>
    set({
      editData: data,
      isEdit: true,
    }),
  resetEditData: () =>
    set({
      editData: null,
      isEdit: false,
    }),
}));
