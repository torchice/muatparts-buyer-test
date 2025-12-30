export const formatDate = date => {
	if (!date) return;
	const formatter = new Intl.DateTimeFormat("id-ID", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
	return formatter.format(new Date(date));
};

export const formatDateToDatePicker = date => {
	const dt = new Date(date);
	const formatted = `${dt.toISOString().split("T")[0]} ${
		dt.toISOString().split("T")[1].split(".")[0]
	}`;
	return formatted;
};

export const dateFormatter = (date, format = 'dd MMM yyyy') => {
	const d = new Date(date);
  
	const formats = {
	  dd: d.getDate().toString().padStart(2, '0'),
	  d: d.getDate(),
	  MMMM: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Ags',
			 'Sept', 'Okt', 'Nov', 'Des'][d.getMonth()],
	  MMM: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
			'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][d.getMonth()],  // Added the indexing here
	  MM: (d.getMonth() + 1).toString().padStart(2, '0'),
	  M: d.getMonth() + 1,
	  yyyy: d.getFullYear(),
	  yy: d.getFullYear().toString().slice(-2),
	  HH: d.getHours().toString().padStart(2, '0'),
	  H: d.getHours(),
	  mm: d.getMinutes().toString().padStart(2, '0'),
	  m: d.getMinutes(),
	  ss: d.getSeconds().toString().padStart(2, '0'),
	  s: d.getSeconds()
	};
  
	return format.replace(/dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|mm|m|ss|s/g,
	  match => formats[match]);
};
