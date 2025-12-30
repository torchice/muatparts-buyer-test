import React, { Fragment, useEffect, useState } from "react";
import Input from "@/components/Input/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import InvoiceLabel from "@/components/OrderComponents/InvoiceLabel";
import Button from "@/components/Button/Button";
import { UlasanBuyer } from "./UlasanbuyerWeb";
import { modal } from "@/store/modal";
import Image from "next/image";
import { Star, X } from "lucide-react";
import TextArea from "@/components/TextArea/TextArea";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import toast from "@/store/toast";
import SWRHandler from "@/services/useSWRHook";
import useUlasanStore from "./storeUlasan";
import Dropdown from "@/components/Dropdown/Dropdown";
import { formatDate } from "@/libs/DateFormat";
import { useRouter } from "next/navigation";
import ConfigUrl from "@/services/baseConfig";
import menuZus from "@/store/menu";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

// 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0012
export const MenungguUlasan = ({ data }) => {
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
  // LBM - Andrew - Foto Update Lebih dari Satu - MP - 019 Ulasan
  const router = useRouter();
  const { resetForm } = useUlasanStore();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const [showMore, setShowMore] = useState({});
  const { menuZ } = menuZus();

  return (
    <>
      {data?.map((order, index) => (
        <div key={index} className="rounded-[10px] border border-neutral-600">
          <div className="">
            <div className="py-5 px-8 border-b border-neutral-600">
              <div className="flex justify-between items-center mb-5">
                <InvoiceLabel invoice={order.invoiceNumber} />
                <div className="flex gap-1 text-xs items-center text-[#7B7B7B]">
                  <span>Pesanan Diterima :</span>
                  <span className="font-medium text-[#000000]">
                    {(() => {
                      const date = new Date(order.receivedDate);
                      
                      // Format: DD-MM-YYYY HH:MM
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');
                      
                      return `${day}/${month}/${year} ${hours}:${minutes}`;
                    })() || ""}
                  </span>
                </div>
              </div>
              <div className="flex justify-between gap-24">
                <div className="flex flex-col gap-2">
                  <UlasanBuyer {...order.product} />

                  {Object.keys(order.product.variant || {}).length > 0 && (
                    <>
                      {showMore[index] && (
                        <div className="pt-3 mt-3">
                          <UlasanBuyer {...order.product} />
                        </div>
                      )}
                      <button
                        className="text-primary-700 font-medium text-xs mt-5 flex items-center"
                        onClick={() =>
                          setShowMore((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                      >
                        {showMore[index]
                          ? "Sembunyikan"
                          : `+${
                              Object.keys(order.product.variant).length
                            } Varian Lainnya`}
                        <IconComponent
                          src={
                            showMore[index]
                              ? "/icons/chevron-up.svg"
                              : "/icons/chevron-down.svg"
                          }
                          classname="ml-2"
                          color="primary"
                        />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2 font-medium text-xs">
                  <div className="flex items-center gap-2 text-neutral-600 font-medium text-xs">
                    <IconComponent
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE +
                        (order.store.logo && order.store.logo.trim()
                          ? order.store.logo
                          : "/muatparts/icons/ulasanbuyeric.svg")
                      }
                    />
                    Ulasan
                  </div>
                  Kamu belum menulis ulasan untuk produk ini
                </div>
              </div>
            </div>
            <div className="py-4 px-8 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  className="size-[30px] rounded-[30px]"
                  src={order?.store?.logo || "/muatparts/icons/ulasanbuyeric.svg"}
                  alt="reviewer"
                  width={30}
                  height={30}
                />
                <div className="text-sm font-semibold">{order.store.name}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary_secondary"
                  children="Lihat Toko"
                  Class="!h-8 !font-semibold !pb-2"
                  onClick={() => router.push(`seller/${order.store.id}`)}
                />
                <Button
                  children="Tulis Ulasan"
                  Class="!h-8 !font-semibold !pb-2"
                  onClick={() => {
                    setModalOpen(true);
                    setModalConfig({
                      withHeader: false,
                      withClose: true,
                      classname: "max-w-[472px] min-h-[545px]",
                      onClose: resetForm,
                    });
                    setModalContent(<FormUlasan data={order} />);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const FormUlasan = (data) => {
  const config = ConfigUrl();
  const {
    form,
    setForm,
    setRating,
    addPhoto,
    removePhoto,
    resetForm,
    validateForm,
  } = useUlasanStore();

  const { setDataToast, setShowToast } = toast();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { useSWRMutateHook, useSWRHook } = SWRHandler();
  const [isUploading, setIsUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const { menuZ } = menuZus();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // State untuk menyimpan foto yang ditampilkan di UI
  const [displayedPhotos, setDisplayedPhotos] = useState(Array(5).fill(null));
  // Flag untuk menandai apakah inisialisasi foto sudah dilakukan
  const [photosInitialized, setPhotosInitialized] = useState(false);

  // Cek apakah mode edit
  const isEditMode = data?.data?.review?.id;

  // Fetch review data jika dalam mode edit
  const { data: reviewData, isLoading: reviewDataLoading } = useSWRHook(
    isEditMode ? `${api}v1/muatparts/reviews/${data.data.review.id}` : null
  );

  const { trigger: uploadImage } = useSWRMutateHook(
    `${api}v1/muatparts/reviews/upload_photo_review`,
    "POST"
  );

  // Inisialisasi displayedPhotos HANYA SEKALI saat komponen dimuat pertama kali
  // atau ketika data review tersedia pertama kali
  useEffect(() => {
    // Hanya jalankan jika belum diinisialisasi
    if (!photosInitialized) {
      if (isEditMode && reviewData?.Data?.photos) {
        // Untuk mode edit, gunakan foto dari data review
        const photos = [...reviewData.Data.photos];
        while (photos.length < 5) photos.push(null);
        setDisplayedPhotos(photos);
        
        // Update form state juga
        setForm(prevForm => ({
          ...prevForm,
          uploadedPhotos: [...photos]
        }));
        
        setPhotosInitialized(true);
      } else if (isEditMode && data?.data?.review?.photos) {
        // Alternatif sumber foto untuk mode edit
        const photos = [...data.data.review.photos];
        while (photos.length < 5) photos.push(null);
        setDisplayedPhotos(photos);
        
        // Update form state juga
        setForm(prevForm => ({
          ...prevForm,
          uploadedPhotos: [...photos]
        }));
        
        setPhotosInitialized(true);
      } else if (!isEditMode) {
        // Untuk mode tambah ulasan baru
        setDisplayedPhotos(Array(5).fill(null));
        setPhotosInitialized(true);
      }
    }
  }, [isEditMode, reviewData, data, photosInitialized, setForm]);

  // Effect untuk mengisi form saat data review sudah tersedia
  useEffect(() => {
    if (data && data.data && data.data.product && !isDataLoaded) {
      const product = data.data.product;
      
      // Jika dalam mode edit dan data review sudah tersedia dari API
      if (isEditMode && reviewData?.Data) {
        const review = reviewData.Data;
        
        const formData = {
          productId: product.id,
          transactionId: data.data.transactionId,
          productName: product.name,
          variant: product.variant.type,
          rating: review.rating || 0,
          ulasanText: review.comment || "",
          // Tidak mengatur uploadedPhotos di sini karena akan ditangani oleh useEffect lain
          uploadedPhotos: Array(5).fill(null), // Inisialisasi kosong dulu
          hover: 0,
        };
        
        setForm(formData);
        setIsDataLoaded(true);
      } else if (isEditMode && data.data.review) {
        // Alternatif jika reviewData belum tersedia tapi data.data.review ada
        const review = data.data.review;
        
        const formData = {
          productId: product.id,
          transactionId: data.data.transactionId,
          productName: product.name,
          variant: product.variant.type,
          rating: review.rating || 0,
          ulasanText: review.comment || "",
          uploadedPhotos: Array(5).fill(null),
          hover: 0,
        };
        
        setForm(formData);
        setIsDataLoaded(true);
      } else if (!isEditMode) {
        // Mode tambah ulasan baru
        setForm({
          productId: product.id,
          transactionId: data.data.transactionId,
          productName: product.name,
          variant: product.variant.type,
          rating: 0,
          ulasanText: "",
          uploadedPhotos: Array(5).fill(null),
          hover: 0,
        });
        
        setIsDataLoaded(true);
      }
    }
  }, [reviewData, isEditMode, data, isDataLoaded, setForm]);

  const handleUploadImage = async (base64String, index) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", await (await fetch(base64String)).blob());

      const response = await uploadImage(formData);
      if (response?.data?.Data?.url) {
        // Update displayedPhotos untuk UI
        const newDisplayedPhotos = [...displayedPhotos];
        newDisplayedPhotos[index] = response.data.Data.url;
        setDisplayedPhotos(newDisplayedPhotos);
        
        // Update form.uploadedPhotos untuk submit
        const updatedPhotos = [...form.uploadedPhotos];
        updatedPhotos[index] = response.data.Data.url;
        setForm({
          ...form,
          uploadedPhotos: updatedPhotos
        });
        
        setUploaderKey((prev) => prev + 1);
      }
    } catch (err) {
      setShowToast(true);
      setDataToast({ type: "error", message: "Gagal memproses foto" });
    } finally {
      setIsUploading(false);
    }
  };

  // Function untuk handle menghapus foto dengan cara langsung
  const handleRemovePhoto = (index) => {
    // Update displayedPhotos untuk UI
    const newDisplayedPhotos = [...displayedPhotos];
    newDisplayedPhotos[index] = null;
    setDisplayedPhotos(newDisplayedPhotos);
    
    // Update form.uploadedPhotos untuk submit
    const updatedPhotos = [...form.uploadedPhotos];
    updatedPhotos[index] = null;
    setForm({
      ...form,
      uploadedPhotos: updatedPhotos
    });
    
    // Refresh component
    setUploaderKey(prev => prev + 1);
  };

  const handleCancel = () => {
    if (form.rating === 0) {
      resetForm();
      setModalOpen(false);
      return;
    }

    setModalConfig({
      withHeader: true,
      withClose: true,
      classname: "max-w-[385px]",
      onClose: () => {
        setModalConfig({
          withHeader: false,
          withClose: true,
          classname: "max-w-[472px] min-h-[545px]",
          onClose: resetForm,
        });
        setModalContent(<FormUlasan data={data.data} />);
      },
    });

    setModalContent(
      <div className="py-9 px-6 flex flex-col justify-center items-center gap-5">
        <span className="font-medium text-sm text-neutral-900 text-center block">
          Apakah kamu yakin untuk membatalkan {isEditMode ? "ubah" : "tambah"} ulasan?
        </span>
        <div className="flex gap-2 justify-center items-center">
          <Button
            children="Yakin"
            color="primary_secondary"
            Class="!font-semibold"
            onClick={() => {
              resetForm();
              setModalOpen(false);
            }}
          />
          <Button
            children="Batal"
            Class="!font-semibold"
            onClick={() => {
              setModalConfig({
                withHeader: false,
                withClose: true,
                classname: "max-w-[472px] min-h-[545px]",
                onClose: undefined,
              });
              setModalContent(<FormUlasan data={data.data} />);
            }}
          />
        </div>
      </div>
    );
  };

  // Fungsi handleSubmit dengan format yang konsisten
  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
      return;
    }

    try {
      const { productId, transactionId, rating, ulasanText } = form;
      
      // Untuk photos, gunakan displayedPhotos karena itu yang sebenarnya ditampilkan di UI
      // dan sudah mencakup semua foto (lama dan baru)
      const photosArray = displayedPhotos.filter(photo => photo !== null);
      
      const bodyParams = {
        productId: productId,
        transactionId: transactionId,
        rating: rating,
        photos: photosArray // Menggunakan displayedPhotos yang sudah difilter
      };

      if (ulasanText?.trim()) {
        bodyParams.comment = ulasanText;
      }
      
      if (isEditMode) {
        await config.put({
          path: `v1/muatparts/reviews/${data.data.review.id}`,
          data: bodyParams,
        });
      } else {
        await config.post({
          path: 'v1/muatparts/reviews',
          data: bodyParams,
        });
      }

      setModalOpen(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil ${isEditMode ? "mengubah" : "membuat"} ulasan`,
      });
      resetForm();
      
      // Gunakan setTimeout untuk memberikan waktu toast muncul sebelum reload
      setTimeout(() => {
        window.location.reload(); // Reload halaman untuk mendapatkan data terbaru
      }, 1000);
    } catch (error) {
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.response?.data?.Data?.Message || "Terjadi kesalahan",
      });
    }
  };

  // Menampilkan loading saat data sedang dimuat
  if (isEditMode && !isDataLoaded && reviewDataLoading) {
    return (
      <div className="py-8 px-6 flex justify-center items-center min-h-[300px]">
        <span className="font-medium text-sm">Memuat data ulasan...</span>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-6">
      <span className="font-bold text-base text-neutral-900 block text-center mb-5">
        {isEditMode ? "Ubah Ulasan" : "Tulis Ulasan"}
      </span>

      <div className="flex items-start gap-5">
        <Image
          src={data.data.product.image}
          alt={form.productName}
          className="w-14 h-14 object-cover rounded-md"
          width={56}
          height={56}
        />
        <div className="w-[348px]">
          <div className="font-bold text-xs mb-2">{form.productName}</div>
          <div className="text-xs text-neutral-600 font-medium mb-1">
            {data.data.product.variant.type} - {data.data.product.variant.size}
          </div>
          <div className="font-semibold text-xs mb-3 mt-4">
            Kualitas Produk*
          </div>

          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-w-6 cursor-pointer transition-colors duration-200 ${
                  (form.hover || form.rating) >= star
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "fill-gray-200 stroke-gray-200"
                }`}
                onMouseEnter={() => setForm({ hover: star })}
                onMouseLeave={() => setForm({ hover: 0 })}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="my-3 border-neutral-400" />

      <DivParticleUlasan title="Berikan ulasan produk ini">
        <div className="mt-2">
          <TextArea
            placeholder="Tulis ulasan kamu mengenai produk ini"
            maxLength={500}
            resize="false"
            supportiveText={{
              title: null,
              desc: `${form.ulasanText.length}/500`,
            }}
            hasCharCount={false}
            value={form.ulasanText}
            changeEvent={(e) => setForm({ ulasanText: e.target.value })}
          />
        </div>
      </DivParticleUlasan>

      <hr className="my-3 border-neutral-400" />

      <DivParticleUlasan
        title="Bagikan foto-foto dari produk yang kamu terima"
        label="Format file jpg/png, ukuran file maks. 10MB"
      >
        <div className="flex gap-4 my-1">
          {displayedPhotos.map((url, idx) => (
            <div key={`container-${uploaderKey}-${idx}`} className="relative">
              <div className={`${url ? "hidden" : "block"}`}>
                <ImageUploader
                  key={`uploader-${uploaderKey}-${idx}`}
                  className="!rounded-[4px] !size-[40px]"
                  getImage={(e) => handleUploadImage(e, idx)}
                  maxSize={10000}
                  uploadText=""
                  isCircle={true}
                  onUpload={(e) => handleUploadImage(e, idx)}
                  onError={() => {}}
                  error={false}
                  isLoading={isUploading}
                />
              </div>
              {url && (
                <div className="relative border border-[#868686] border-dashed rounded-[4px]">
                  <img
                    src={url}
                    className="!rounded-[4px] !size-[40px] object-cover"
                    alt={`Foto ${idx + 1}`}
                  />
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-[1px] right-[3px] rounded-full size-4 flex items-center justify-center z-10 bg-white"
                    type="button"
                  >
                    <X color="black" size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DivParticleUlasan>

      <div className="flex mt-6 gap-2 justify-center items-center">
        <Button
          children="Batalkan"
          color="primary_secondary"
          Class="!font-semibold !h-8"
          onClick={handleCancel}
        />
        <Button
          children="Kirim"
          Class="!font-semibold !h-8"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const DivParticleUlasan = ({ title, label, children, optional = true }) => {
  return (
    <Fragment key={title}>
      <span className="text-neutral-900 font-medium text-xs">
        {title} {optional && <span className="italic">(opsional)</span>}
      </span>
      {children}
      {label && (
        <span className="text-neutral-600 font-medium text-xs">{label}</span>
      )}
    </Fragment>
  );
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051
  // LBM - Andrew - Foto Update Lebih dari Satu - MP - 019 Ulasan
};

export default MenungguUlasan;
// 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0012