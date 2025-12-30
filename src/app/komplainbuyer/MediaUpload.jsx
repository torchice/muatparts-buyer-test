import React, { useState, useRef, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/toast";
import useKomplainStore from "./useKomplainStore";
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer LB - 0023 LB - 0035
export const MediaUpload = ({
  type,
  description,
  maxSize,
  format,
  isOptional = false,
  maxLength = 225,
  onUpload,
  initialData = [],
  error = false  // Tambahkan prop error untuk validasi visual
}) => {
  // Create refs for file inputs
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // Local state for uploads - mulai dengan satu row kosong
  const [uploadRows, setUploadRows] = useState([
    { file: null, description: "", originalPath: "" }
  ]);
  
  // State untuk menyimpan evidence yang telah dihapus
  // (mencegah data yang sudah dihapus muncul kembali)
  const [deletedPaths, setDeletedPaths] = useState([]);
  
  const { setDataToast, setShowToast } = toast();
  const { useSWRMutateHook } = SWRHandler();
  const setForm = useKomplainStore((state) => state.setForm);
  const form = useKomplainStore((state) => state.form);

  // Upload endpoints
  const { trigger: uploadPhotos } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}/v1/muatparts/buyer/complaints/evidence`,
    "POST"
  );

  const { trigger: uploadVideo } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}/v1/muatparts/buyer/complaints/evidence/video`,
    "POST"
  );

  // Inisialisasi uploadRows berdasarkan initialData
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      console.log(`Initializing ${type} with data:`, initialData);
      
      // Filter data yang telah dihapus
      const filteredData = initialData.filter(item => !deletedPaths.includes(item.url));
      
      // Map initialData ke format uploadRows
      const initialRows = filteredData.map(item => ({
        file: null,
        description: item.description || "",
        originalPath: item.url || ""
      }));
      
      // Hanya tambahkan row kosong jika tidak ada row sama sekali
      if (initialRows.length === 0) {
        initialRows.push({ file: null, description: "", originalPath: "" });
      }
      
      setUploadRows(initialRows);
    } else {
      // Jika tidak ada initial data, cukup satu row kosong saja
      setUploadRows([{ file: null, description: "", originalPath: "" }]);
    }
  }, [initialData, deletedPaths, type]);

  // Fungsi untuk memperbarui form dengan evidence yang baru
  const updateFormEvidence = (newEvidence) => {
    const mediaType = type === "video" ? "videos" : "photos";
    
    // Kirim data ke parent melalui callback
    if (typeof onUpload === 'function') {
      // Kirim hanya data evidence yang valid (ada URL)
      const validEvidence = newEvidence[mediaType].filter(item => item.url && !deletedPaths.includes(item.url));
      validEvidence.forEach(item => {
        onUpload(item);
      });
    }
    
    // Update form
    setForm({
      evidence: {
        ...form.evidence,
        [mediaType]: newEvidence[mediaType]
      }
    });
  };

  // Handle file selection click
  const handleUploadClick = (index) => {
    const inputRef = type === "video" ? videoInputRef : imageInputRef;
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Handle photo upload
  const handleFileUpload = async (base64String, rowIndex) => {
    try {
      console.log('Starting photo upload...');
      const formData = new FormData();
      const blob = await (await fetch(base64String)).blob();
      formData.append("files", blob);
      
      const response = await uploadPhotos(formData);
      console.log('Photo upload response:', response);

      if (response?.data?.Data?.length > 0) {
        const uploadedFile = response.data.Data[0];
        const uploadPath = uploadedFile.originalPath;
        
        // Pastikan path tidak ada dalam daftar yang dihapus
        if (deletedPaths.includes(uploadPath)) {
          setDeletedPaths(prev => prev.filter(path => path !== uploadPath));
        }
        
        // Update HANYA row yang sedang diupload
        setUploadRows(prev => {
          // Buat salinan array untuk dimodifikasi
          const newRows = [...prev];
          // Perbarui row yang diupload saja
          newRows[rowIndex] = {
            ...prev[rowIndex],
            file: uploadedFile,
            originalPath: uploadPath
          };
          // Kembalikan array baru tanpa tambahan row
          return newRows;
        });

        // Create evidence object
        const evidenceData = {
          url: uploadPath,
          description: uploadRows[rowIndex].description || ""
        };

        console.log("Evidence Data:", evidenceData);

        // Kirim data ke parent
        onUpload?.(evidenceData);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      setShowToast(true);
      setDataToast({ type: "error", message: "Gagal memproses file" });
    }
  };

  // Handle video upload
  const handleVideoUpload = async (event, rowIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('Starting video upload...');
      const formData = new FormData();
      formData.append("files", file);
      
      const response = await uploadVideo(formData);
      console.log('Video upload response:', response);
      
      if (response?.data?.Data?.url) {
        const uploadedFile = response.data.Data;
        const uploadPath = uploadedFile.url;
        
        // Pastikan path tidak ada dalam daftar yang dihapus
        if (deletedPaths.includes(uploadPath)) {
          setDeletedPaths(prev => prev.filter(path => path !== uploadPath));
        }

        // Update HANYA row yang sedang diupload
        setUploadRows(prev => {
          // Buat salinan array untuk dimodifikasi
          const newRows = [...prev];
          // Perbarui row yang diupload saja
          newRows[rowIndex] = {
            ...prev[rowIndex],
            file: uploadedFile,
            originalPath: uploadPath
          };
          // Kembalikan array baru tanpa tambahan row
          return newRows;
        });

        // Create evidence object
        const evidenceData = {
          url: uploadPath,
          description: uploadRows[rowIndex].description || ""
        };

        console.log("Evidence Data:", evidenceData);

        // Kirim data ke parent
        onUpload?.(evidenceData);
      }
    } catch (err) {
      console.error('Video upload error:', err);
      setShowToast(true);
      setDataToast({ type: "error", message: "Gagal memproses video" });
    }
  };
  
  // Handle description changes
  const handleDescriptionChange = (value, index) => {
    setUploadRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], description: value };
      
      // Jika file sudah diupload, perbarui deskripsi di form juga
      if (newRows[index].originalPath) {
        const mediaType = type === "video" ? "videos" : "photos";
        const path = newRows[index].originalPath;
        
        // Kirim update ke parent
        onUpload?.({
          url: path,
          description: value
        });
      }
      
      return newRows;
    });
  };

  // Add new upload row
  const addNewRow = () => {
    if (uploadRows.length < 5) {
      // Selalu tambahkan row baru ketika tombol diklik
      setUploadRows(prev => [...prev, { file: null, description: "", originalPath: "" }]);
    }
  };

  // Remove row
  const removeRow = (index) => {
    const removedRow = uploadRows[index];
    const removedPath = removedRow.originalPath;
    
    if (removedPath) {
      // Tambahkan path yang dihapus ke daftar
      setDeletedPaths(prev => [...prev, removedPath]);
      
      // Kirim informasi penghapusan ke parent
      if (typeof onUpload === 'function') {
        const mediaType = type === "video" ? "videos" : "photos";
        
        // Beri tahu parent untuk menghapus item ini
        setForm(prevForm => {
          const updatedMedia = prevForm.evidence[mediaType].filter(
            item => item.url !== removedPath
          );
          
          return {
            ...prevForm,
            evidence: {
              ...prevForm.evidence,
              [mediaType]: updatedMedia
            }
          };
        });
      }
    }
    
    setUploadRows(prev => {
      // Jika ini row terakhir, ganti dengan row kosong
      if (prev.length === 1) {
        return [{ file: null, description: "", originalPath: "" }];
      }
      
      // Jika masih ada row lain, hapus row ini saja tanpa menambah row kosong
      return prev.filter((_, idx) => idx !== index);
    });
  };

  return (
    <div className="flex w-full gap-5 flex-wrap mt-6">
      <div className="font-medium leading-[1.2] w-[178px]">
        <div className="flex max-w-full w-[178px] items-center gap-1">
          <div className="self-stretch flex w-[178px] flex-col my-auto">
            <div className="AvenirNormal12px Color7B7B7B whitespace-nowrap self-stretch w-[90px] min-h-[34px] gap-1">
              {`Bukti ${type === "video" ? "Video" : "Gambar"}`}
              {isOptional && (
                <span className="font-normal italic">(Opsional)</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-w-60 items-center gap-3.5 flex-wrap flex-1">
        <div className="self-stretch flex min-w-60 w-full flex-col items-stretch flex-1 my-auto">
          <div className="flex w-full flex-col items-stretch justify-center">
            {uploadRows.map((row, index) => (
              <div key={index} className="flex w-full items-stretch gap-3.5 flex-wrap mb-6">
                <div className={`justify-center items-center border bg-white flex min-h-[124px] flex-col font-semibold whitespace-nowrap text-center leading-[1.2] w-[124px] h-[124px] my-auto px-0 rounded-xl ${
                  // Tambahkan border merah jika error dan tidak ada video yang diunggah
                  error && type === "video" && !row.originalPath 
                    ? "border-[#FF0000] border-2 border-solid" 
                    : "border-[color:var(--Neutral-500,#9D9D9D)] border-dashed"
                }`}>
                  {type === "video" ? (
                    <>
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept=".mp4"
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, index)}
                      />
                      <button 
                        onClick={() => handleUploadClick(index)}
                        className="w-full h-full flex flex-col items-center justify-center"
                      >
                        {row.originalPath ? (
                          <video 
                            src={row.originalPath}
                            className="w-full h-full object-cover rounded-xl"
                            controls
                          />
                        ) : (
                          <>
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/c91e25f7ebc5e283f34eeb059705de7e4e228787866d1ffb81553a1550126ca0?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-5"
                              alt=""
                            />
                            <div className="AvenirDemi12px Color000000 mt-[12px]">Unggah</div>
                            {error && type === "video" && !row.originalPath && (
                              <div className="AvenirNormal10px mt-1" style={{ color: "#FF0000" }}>
                                Video wajib diunggah
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      {row.originalPath ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={row.originalPath}
                            alt="uploaded"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removeRow(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <ImageUploader
                          className="w-[123.99px] h-full flex items-center justify-center"
                          getImage={(base64) => handleFileUpload(base64, index)}
                          maxSize={parseInt(maxSize)}
                          uploadText="Unggah"
                          isCircle={false}
                          onUpload={() => {}}
                          onError={() => {}}
                          error={false}
                          icon={
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/c91e25f7ebc5e283f34eeb059705de7e4e228787866d1ffb81553a1550126ca0?placeholderIfAbsent=true"
                              className="aspect-[1] object-contain w-5"
                              alt=""
                            />
                          }
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="min-w-60 max-h-[109px] font-medium flex-1 shrink basis-8">
                  <textarea
                    className={`AvenirNormal12px Color7B7B7B flex-1 shrink border bg-white w-full gap-2 leading-[14px] h-full p-[12px] rounded-md ${
                      // Tambahkan border merah jika ada video tetapi tidak ada deskripsi
                      error && row.originalPath && !row.description
                        ? "border-[#FF0000] border-2 border-solid" 
                        : "border-[color:var(--Neutral-600,#7B7B7B)] border-solid"
                    }`}
                    placeholder={description}
                    value={row.description}
                    onChange={(e) => handleDescriptionChange(e.target.value, index)}
                    maxLength={maxLength}
                  />
                  <div className="flex justify-between w-full mt-1">
                    {error && row.originalPath && !row.description && (
                      <div className="AvenirNormal10px" style={{ color: "#FF0000" }}>
                        Deskripsi bukti komplain pesanan kamu wajib diisi
                      </div>
                    )}
                    <div className={`AvenirNormal12px Color7B7B7B whitespace-nowrap ${error && row.originalPath && !row.description ? "ml-auto" : "text-right"} leading-[1.2]`}>
                      ({row.description.length}/{maxLength})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="AvenirNormal12px Color7B7B7B whitespace-nowrap leading-[1.2] mt-[8px]">
            {`Unggah ${
              type === "video" ? "1 video" : "maksimal 5 foto"
            } dengan format ${format} maks. ${maxSize}`}
          </div>
          {type === "image" && uploadRows.length < 5 && (
            <button 
              onClick={addNewRow}
              className="w-fit h-[32px] justify-center items-center border border-[color:var(--Primary-700,#176CF7)] bg-white flex gap-1 text-sm text-[#000001] font-semibold leading-[1.2] mt-3.5 px-6 py-2 rounded-3xl border-solid"
            >
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/3b8efae841f0e12a1c1eefb92b58a2368b3c77b7ca96a909346d7bae7c02a3f9?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
                alt=""
              />
              <span className="AvenirDemi14px Color176CF7 self-stretch my-auto">Tambah Foto</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer LB - 0023 LB - 0035
export default MediaUpload;