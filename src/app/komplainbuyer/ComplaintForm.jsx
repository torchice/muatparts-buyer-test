// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer
// LB - 0007
// LB - 0008
// LB - 0011
// LB - 0012
// LB - 0014
// LB - 0015
// LB - 0016
// LB - 0017
// LB - 0021
// LB - 0022
// LB - 0034
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer

"use client"
import React, { useState, useEffect } from "react";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { ProductList } from "./ProductList";
import { MediaUpload } from "./MediaUpload";
import { FAQ } from "./FAQ";
import { ComplaintPopUp } from "./ComplaintPopUp";
import useKomplainStore from "./useKomplainStore";
import { useAlasanKomplain, useSolusiKomplain } from "./komplainHooks";
import toast from "@/store/toast";
import "@/app/komplainbuyer/kelolapesanan.css";
import ConfigUrl from "@/services/baseConfig";
import { useRouter } from 'next/navigation';

import { useSearchParams } from 'next/navigation';
import SWRHandler from "@/services/useSWRHook";

import IconComponent from "@/components/IconComponent/IconComponent";

// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer LB - 0023 LB - 0035
function ComplaintForm() {
  // LB - 0038 Excel Bug Komplain Buyer Web
  const router = useRouter();
  const config = ConfigUrl();
  const [showPopup, setShowPopup] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setDataToast, setShowToast } = toast();
  
  // Tambahkan state untuk mengelola validasi visual
  const [formErrors, setFormErrors] = useState({
    videoMissing: false,
    videoDescriptionMissing: false,
    descriptionError: false,
    solutionError: false
  });
  
  // Local state for evidence management
  const [evidenceState, setEvidenceState] = useState({
    photos: [],
    videos: []
  });

  // State dari store
  const {
    form,
    setForm,
    resetForm,
    updateProducts,
    setAlasanKomplain,
    setSolusiDiinginkan
  } = useKomplainStore();

  const searchParams = useSearchParams();

  // Update to use orderID, transactionID and alasanID from URL params
  const orderID = searchParams.get('OrderID');
  const transactionID = searchParams.get('TransactionID');
  const alasanID = searchParams.get('alasanID');

  // Fetch data menggunakan hooks
  const { alasanKomplain, isLoading: loadingAlasan } = useAlasanKomplain();
  const { solusiKomplain, isLoading: loadingSolusi } = useSolusiKomplain(form.alasanKomplain?.id);

  const { useSWRHook } = SWRHandler();
  
  // Fetch order details using SWR
  const { data: orderData } = useSWRHook(
    orderID && transactionID 
      ? `/v1/muatparts/buyer/orders/detail?orderID=${orderID}&transactionID=${transactionID}`
      : null
  );

  // Set alasan komplain when alasanKomplain data is loaded and alasanID is in the URL
  useEffect(() => {
    if (alasanID && alasanKomplain && alasanKomplain.length > 0 && !form.alasanKomplain) {
      console.log('Looking for alasanID in loaded alasanKomplain:', alasanID);
      const selectedAlasan = alasanKomplain.find(reason => reason.id === alasanID);
      
      if (selectedAlasan) {
        console.log('Found matching alasan:', selectedAlasan);
        setAlasanKomplain(selectedAlasan);
        // Also update mappingID in form
        setForm(prev => ({
          ...prev,
          mappingID: selectedAlasan.id
        }));
      } else {
        console.log('Alasan with ID not found:', alasanID);
      }
    }
  }, [alasanID, alasanKomplain, form.alasanKomplain, setAlasanKomplain, setForm]);

  // Log state untuk debugging
  useEffect(() => {
    console.log('Current alasan komplain:', form.alasanKomplain?.id);
    console.log('Current solusi komplain:', solusiKomplain);
    console.log('Current evidence state:', evidenceState);
    console.log('URL params - alasanID:', alasanID);
  }, [form.alasanKomplain, solusiKomplain, evidenceState, alasanID]);

  // Set invoice number when order data is received
  useEffect(() => {
    console.log('orderID:', orderID);
    console.log('transactionID:', transactionID);
    console.log('orderData:', orderData);
    if (orderData?.Data?.storeOrders?.[0]?.invoiceNumber) {
      setForm(prev => ({
        ...prev,
        invoiceNumber: orderData?.Data?.storeOrders?.[0]?.invoiceNumber
      }));
    }
  }, [orderID, transactionID, orderData, setForm]);

  const handleComplaintReasonSelect = (option) => {
    setAlasanKomplain(option);
    setShowPopup(false);
  };

  // Fungsi untuk memeriksa apakah alasan komplain adalah "Pesanan Belum Diterima"
  const isPesananBelumDiterimaComplaint = () => {
    return form.alasanKomplain && 
           form.alasanKomplain.title && 
           form.alasanKomplain.title.includes("Pesanan Belum Diterima");
  };

  const handleVideoUpload = (videoData) => {
    console.log('Received video data:', videoData);
    
    // Reset video error saat berhasil upload
    if (videoData.url) {
      setFormErrors(prev => ({
        ...prev,
        videoMissing: false
      }));
    }
    
    // Reset description error jika deskripsi diisi
    if (videoData.description && videoData.description.trim() !== "") {
      setFormErrors(prev => ({
        ...prev,
        videoDescriptionMissing: false
      }));
    }
    
    // Update local evidence state
    setEvidenceState(prev => {
      // Cek apakah video sudah ada untuk menghindari duplikasi
      const existingIndex = prev.videos.findIndex(v => v.url === videoData.url);
      
      if (existingIndex !== -1) {
        // Update deskripsi jika video sudah ada
        const updatedVideos = [...prev.videos];
        updatedVideos[existingIndex] = {
          ...updatedVideos[existingIndex],
          description: videoData.description || ""
        };
        return {
          ...prev,
          videos: updatedVideos
        };
      } else {
        // Tambahkan video baru
        return {
          ...prev,
          videos: [...prev.videos, {
            url: videoData.url,
            description: videoData.description || ""
          }]
        };
      }
    });
  };
  
  const handleImageUpload = (imageData) => {
    console.log('Received image data:', imageData);
    
    // Update local evidence state
    setEvidenceState(prev => {
      // Cek apakah image sudah ada untuk menghindari duplikasi
      const existingIndex = prev.photos.findIndex(p => p.url === imageData.url);
      
      if (existingIndex !== -1) {
        // Update deskripsi jika image sudah ada
        const updatedPhotos = [...prev.photos];
        updatedPhotos[existingIndex] = {
          ...updatedPhotos[existingIndex],
          description: imageData.description || ""
        };
        return {
          ...prev,
          photos: updatedPhotos
        };
      } else {
        // Tambahkan image baru
        return {
          ...prev,
          photos: [...prev.photos, {
            url: imageData.url,
            description: imageData.description || ""
          }]
        };
      }
    });
  };

  // Verifikasi form sebelum submit untuk validasi visual dan feedback
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      videoMissing: false,
      videoDescriptionMissing: false,
      descriptionError: false,
      solutionError: false
    };
    
    // Jika komplain bukan "Pesanan Belum Diterima", validasi bukti video
    if (!isPesananBelumDiterimaComplaint()) {
      // Cek apakah video sudah diupload
      if (!evidenceState.videos || evidenceState.videos.length === 0) {
        newErrors.videoMissing = true;
        isValid = false;
      } else {
        // Cek apakah deskripsi sudah diisi untuk video yang diupload
        const videosWithoutDescription = evidenceState.videos.some(
          video => video.url && (!video.description || video.description.trim() === "")
        );
        
        if (videosWithoutDescription) {
          newErrors.videoDescriptionMissing = true;
          isValid = false;
        }
      }
    }
    
    // Cek apakah deskripsi komplain sudah diisi dan memenuhi persyaratan
    if (!form.description || form.description.length < 30) {
      newErrors.descriptionError = true;
      isValid = false;
    }
    
    // Cek apakah solusi sudah dipilih
    if (!form.solusiDiinginkan?.id) {
      newErrors.solutionError = true;
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setShowToast(true);
      setDataToast({
        type: "error",
        message: "Anda harus menyetujui Syarat dan Ketentuan" 
      });
      return;
    }
  
    if (isSubmitting) return;
    
    // Validasi form untuk feedback visual
    if (!validateForm()) {
      let errorMessage = "Harap lengkapi semua field yang diperlukan";
      
      // Tentukan pesan error berdasarkan prioritas
      if (formErrors.videoMissing && !isPesananBelumDiterimaComplaint()) {
        errorMessage = "Video wajib diunggah";
      } else if (formErrors.videoDescriptionMissing && !isPesananBelumDiterimaComplaint()) {
        errorMessage = "Deskripsi bukti komplain pesanan kamu wajib diisi";
      } else if (formErrors.descriptionError) {
        errorMessage = "Deskripsi komplain minimal 30 karakter";
      } else if (formErrors.solutionError) {
        errorMessage = "Pilih solusi yang diinginkan";
      }
      
      setShowToast(true);
      setDataToast({
        type: "error",
        message: errorMessage
      });
      return;
    }
    
    setIsSubmitting(true);
  
    try {
      console.log("Form state saat submit:", form);
      console.log("Evidence state saat submit:", evidenceState);
      
      // Validasi produk
      if (!form.products || form.products.length === 0) {
        throw new Error("Pilih minimal 1 produk yang ingin dikomplain");
      }
  
      const selectedProducts = form.products
        .filter(product => product.quantity && product.quantity > 0)
        .map(product => ({
          id: product.id,
          quantity: product.quantity.toString() // Konversi ke string sesuai format
        }));
  
      console.log("Produk yang akan dikirim:", selectedProducts);
  
      if (selectedProducts.length === 0) {
        throw new Error("Pilih minimal 1 produk yang ingin dikomplain");
      }
      
      // Menggunakan evidence state langsung
      console.log("Evidence state sebelum kirim:", evidenceState);
      
      const complaintData = {
        invoiceNumber: orderData?.Data?.storeOrders?.[0]?.invoiceNumber,
        products: selectedProducts,
        reason: form.description,
        mappingID: form.mappingID || form.solusiDiinginkan?.mapping_id, // Pastikan mapping ID selalu ada
        evidence: {
          videos: evidenceState.videos.map(video => ({
            url: video.url,
            description: video.description || ""
          })),
          photos: evidenceState.photos.map(photo => ({
            url: photo.url,
            description: photo.description || ""
          }))
        }
      };

      console.log('Complaint data to be sent:', complaintData);
  
      // Validasi data wajib
      if (!complaintData.mappingID) {
        throw new Error("Pilih alasan komplain dan solusi yang diinginkan");
      }
  
      if (!complaintData.reason || complaintData.reason.length < 30) {
        throw new Error("Deskripsi komplain minimal 30 karakter");
      }
  
      const response = await config.post({
        path: 'v1/muatparts/buyer/complaints',
        data: complaintData
      });
  
      console.log("Response dari API:", response);
  
      setShowToast(true);
      setDataToast({
        type: "success",
        message: "Berhasil mengirim komplain"
      });
  
      resetForm();
      // Reset evidence state
      setEvidenceState({
        photos: [],
        videos: []
      });
      
      // Reset form errors
      setFormErrors({
        videoMissing: false,
        videoDescriptionMissing: false,
        descriptionError: false,
        solutionError: false
      });
      
      router.push(`/muatparts/daftarpesanan/${orderID}?transactionID=${transactionID}`);
  
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.message || error?.response?.data?.message || "Gagal mengirim komplain"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form dan evidence state ketika komponen unmount
  useEffect(() => {
    return () => {
      resetForm();
      setEvidenceState({
        photos: [],
        videos: []
      });
      
      // Reset form errors
      setFormErrors({
        videoMissing: false,
        videoDescriptionMissing: false,
        descriptionError: false,
        solutionError: false
      });
    };
  }, [resetForm]);

  const handleProductSelect = (selectedProducts) => {
    console.log("Produk yang dipilih di page:", selectedProducts);
    
    if (Array.isArray(selectedProducts)) {
      updateProducts(selectedProducts);
    }
  };

  const handleSolutionChange = (e) => {
    const selectedSolutionId = e.target.value;
    
    // Reset solution error jika ada solusi yang dipilih
    if (selectedSolutionId) {
      setFormErrors(prev => ({
        ...prev,
        solutionError: false
      }));
    }
    
    // Jika tidak ada id yang dipilih, keluar dari fungsi
    if (!selectedSolutionId) return;
    
    // Cari objek solusi lengkap dari array solusiKomplain
    const selectedSolution = solusiKomplain.find(
      solution => solution.id === selectedSolutionId
    );
    
    // Pastikan objek solusi ditemukan sebelum memperbarui state
    if (selectedSolution) {
      console.log('Solusi yang dipilih:', selectedSolution);
      
      // Simpan seluruh objek solusi ke state, bukan hanya ID
      setSolusiDiinginkan(selectedSolution);
      
      // Update state form dengan solusi yang dipilih
      setForm(prev => ({
        ...prev,
        solusiDiinginkan: selectedSolution
      }));
    }
  };

  // Handler untuk deskripsi komplain yang auto-reset error
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setForm({ description: value });
    
    // Reset error jika panjang deskripsi sudah mencukupi
    if (value.length >= 30) {
      setFormErrors(prev => ({
        ...prev,
        descriptionError: false
      }));
    }
  };

  return (
    <div className="w-[1200px] m-auto py-[24px] max-md:px-5">
      <div className="w-full leading-[1.2] max-md:max-w-full">
        <BreadcrumbNav />

        <div className="flex w-full items-center gap-[12px] flex-wrap mt-4 max-md:max-w-full">
          <IconComponent
              src="/icons/arrowbackblue.svg"
              size="medium"
              onclick={() => {
                window.history.back();
              }}
          />
          <h1 className="self-stretch min-w-60 gap-3 text-xl text-black font-bold w-[515px] my-auto max-md:max-w-full">
            Pengajuan Komplain
          </h1>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mt-4 max-md:max-w-full">
        <div className="flex flex-col items-stretch justify-center w-[846px] max-md:max-w-full">
          <section className="justify-between items-stretch shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] bg-white flex w-full font-medium px-8 py-5 rounded-xl max-md:max-w-full max-md:px-5">
            <div className="flex min-w-60 w-full gap-5 h-full flex-1">
              <div className="flex min-w-60 w-full items-center justify-between flex-wrap flex-1">
                <div className="self-stretch min-w-60 text-xs text-black leading-[1.2] flex-1 my-auto">
                  <div className="flex w-full items-stretch gap-5 flex-wrap">
                    <div className="w-[178px] AvenirNormal12px Color7B7B7B">Alasan Komplain</div>
                    <div className="w-[363px] AvenirNormal12px Color000000">
                      {form.alasanKomplain?.title || "Pilih alasan komplain"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopup(true)}
                  className="AvenirNormal14px Color176CF7 text-right text-sm self-stretch my-auto"
                >
                  Ubah Alasan Komplain
                </button>
              </div>
            </div>
          </section>

          <section className="items-stretch shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] bg-white flex w-full flex-col justify-center mt-6 px-8 py-5 rounded-xl max-md:max-w-full max-md:px-5">
            <div className="w-full max-md:max-w-full">
              <div className="flex w-full items-center gap-4 font-semibold whitespace-nowrap leading-[1.2] flex-wrap">
                <h2 className="AvenirDemi16px Color000000 text-base self-stretch flex-1 my-auto">
                  Pesanan
                </h2>
                <div className="self-stretch bg-[#E2F2FF] min-h-6 gap-1 AvenirDemi12px Color176CF7 py-[4px] px-[8px] rounded-md">
                  {orderData?.Data?.storeOrders?.[0]?.invoiceNumber}
                </div>
              </div>

              <div className="w-full max-w-[774px] text-xs text-black font-medium leading-[1.2] mt-3">
                <div className="flex w-full gap-8">
                  <div className="min-w-60 w-[363px] AvenirNormal12px Color7B7B7B">
                    Pilih minimal 1 produk yang ingin dikomplain
                  </div>
                </div>
              </div>

              <div className="w-full mt-3">
                <div className="items-stretch border border-[color:var(--Neutral-400,#C4C4C4)] bg-white flex w-full flex-col justify-center p-3 rounded-xl border-solid">
                  <ProductList onProductSelect={handleProductSelect} />
                </div>
              </div>
            </div>
          </section>

          <section className="items-stretch shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)] bg-white flex w-full flex-col text-base justify-center mt-6 px-8 py-5 rounded-xl max-md:max-w-full max-md:px-5">
            <h2 className="AvenirDemi16px Color000000 leading-[1.2] mb-[24px]">
              {form.alasanKomplain?.title}
            </h2>

            <div className="flex w-full gap-5 text-xs font-medium flex-wrap">
              <div className="text-black leading-[1.2] w-[178px]">
                <label className="AvenirNormal12px Color7B7B7B self-stretch w-[180px] min-h-[34px] max-w-full gap-1">
                  Deskripsi Komplain*
                </label>
              </div>
              <div className="min-w-60 flex-1">
                <textarea
                  className={`flex-1 shrink border bg-white min-h-20 w-full gap-2 text-black leading-[14px] p-3 rounded-md ${
                    formErrors.descriptionError 
                      ? "border-[#FF0000] border-2 border-solid" 
                      : "border-[color:var(--Neutral-600,#7B7B7B)] border-solid"
                  }`}
                  placeholder="Lengkapi alasan komplain pesanan kamu"
                  value={form.description}
                  onChange={handleDescriptionChange}
                  maxLength={1000}
                />
                <div className="flex w-full gap-3 leading-[1.2] flex-wrap mt-[8px]">
                  <div className="AvenirNormal12px flex-1" style={{ color: formErrors.descriptionError ? "#FF0000" : "#7B7B7B" }}>
                    {form.description.length < 30 ? "Minimal 30 karakter" : ""}
                  </div>
                  <div className="AvenirNormal12px Color7B7B7B text-right">
                    ({form.description.length}/1.000)
                  </div>
                </div>
              </div>
            </div>

            <h3 className="AvenirDemi16px Color000000 leading-[1.2] mt-6">
              Solusi Komplain
            </h3>

            {/* Tambahan kondisi untuk menyembunyikan bukti video dan gambar jika alasan adalah "Pesanan Belum Diterima" */}
            {!isPesananBelumDiterimaComplaint() && (
              <>
                <MediaUpload
                  type="video"
                  description="Lengkapi deskripsi bukti komplain pesanan kamu"
                  maxSize="50MB"
                  format=".mp4"
                  maxLength={225}
                  onUpload={handleVideoUpload}
                  initialData={evidenceState.videos}
                  error={formErrors.videoMissing || formErrors.videoDescriptionMissing} // Pass error state ke komponen
                />

                <MediaUpload
                  type="image"
                  description="Lengkapi deskripsi bukti komplain pesanan kamu"
                  maxSize="10MB"  
                  format=".jpg/.jpeg/.png"
                  isOptional
                  maxLength={225}
                  onUpload={handleImageUpload}
                  initialData={evidenceState.photos}
                />
              </>
            )}

            <div className="flex w-full items-center gap-5 font-medium leading-[1.2] flex-wrap mt-6">
              <label className="AvenirNormal12px Color7B7B7B self-stretch w-[180px] gap-1 my-auto">
                Solusi yang diinginkan*
              </label>
              <div className="AvenirNormal12px Color7B7B7B self-stretch min-w-60 w-[286px] my-auto">
                <div className="AvenirNormal12px Color7B7B7B flex w-full flex-col items-stretch justify-center">
                  <select
                    className={`AvenirNormal12px Color7B7B7B items-center border bg-white flex min-h-8 w-full gap-2 px-3 py-2 rounded-md ${
                      formErrors.solutionError 
                        ? "border-[#FF0000] border-2 border-solid" 
                        : "border-[color:var(--Neutral-600,#7B7B7B)] border-solid"
                    }`}
                    value={form.solusiDiinginkan?.id || ""}
                    onChange={handleSolutionChange}
                    disabled={loadingSolusi || !form.alasanKomplain}
                    placeholder="Pilih Solusi yang Ingin kamu Ajukan"
                  >
                    {/* <option value="">Pilih Solusi yang Ingin kamu Ajukan</option> */}
                    {solusiKomplain && solusiKomplain.length > 0 ? (
                      solusiKomplain.map((solusi) => (
                        <option key={solusi.id} value={solusi.id}>
                          {solusi.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {loadingSolusi ? "Memuat..." : form.alasanKomplain ? "Tidak ada solusi tersedia" : "Pilih alasan komplain terlebih dahulu"}
                      </option>
                    )}
                  </select>
                  {formErrors.solutionError && (
                    <div className="AvenirNormal10px mt-1" style={{ color: "#FF0000" }}>
                      Pilih solusi yang diinginkan
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="AvenirNormal12px flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-[24px]">
            <div className="self-stretch flex min-w-60 items-center gap-2 my-auto">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border border-[color:var(--Neutral-600,#7B7B7B)] w-4 h-4 border-solid"
              />
              <label className="text-[#000000]] AvenirNormal12px font-medium leading-[1.2] self-stretch my-auto">
                Saya menyetujui{" "}
                <a href="#" className="text-[#176CF7]">
                  Syarat dan Ketentuan
                </a>{" "}
                Pengajuan Komplain Pesanan.
              </label>
            </div>
            <button
              disabled={!agreed || isSubmitting}
              onClick={handleSubmit}
              className={`AvenirNormal14px self-stretch min-w-[112px] h-[32px] gap-1 text-sm font-semibold leading-[1.2] my-auto px-[24px] py-[10.5px] rounded-3xl ${
                agreed && !isSubmitting
                  ? "bg-[#176CF7] text-[#FFFFFF]"
                  : "bg-[#176CF7] text-[#FFFFFF] cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </div>
        </div>

        <FAQ />
      </div>

      {showPopup && (
        <ComplaintPopUp 
          onClose={() => setShowPopup(false)}
          onSelect={handleComplaintReasonSelect}
          reasons={alasanKomplain}
          isLoading={loadingAlasan}
          selectedReasonId={form.alasanKomplain?.id || alasanID}
        />
      )}
    </div>
  );
  // LB - 0038 Excel Bug Komplain Buyer Web
}
// 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer LB - 0023 LB - 0035
export default ComplaintForm;