export function downloadFile(url, fileName) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // Nama file yang akan di-download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
}
