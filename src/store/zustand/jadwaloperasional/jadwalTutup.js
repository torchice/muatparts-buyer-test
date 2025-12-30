import { create } from "zustand";

const jadwalTutup = create((set) => ({
	startDate: null,
	setStartDate: value => set({ startDate: value }),
	endDate: null,
	setEndDate: value => set({ endDate: value }),
	scheduleId: null,
	setScheduleId: value => set({ scheduleId: value }),
}));

export default jadwalTutup;
