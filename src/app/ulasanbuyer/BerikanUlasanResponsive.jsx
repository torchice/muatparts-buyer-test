import React,{ useState,useEffect } from 'react'
import useUlasanStore from "../ulasanbuyer/storeUlasan";
import TextArea from "@/components/TextArea/TextArea";
import { useHeader } from '@/common/ResponsiveContext'
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import SWRHandler from "@/services/useSWRHook";
import NavSelectedMobile from "@/components/Bottomsheet/NavSelectedMobile";
import Button from "@/components/Button/Button";
import { Star, X } from "lucide-react";
import toast from "@/store/toast";
import ModalComponent from "@/components/Modals/ModalComponent";
import ConfigUrl from "@/services/baseConfig";
import ImageComponent from '@/components/ImageComponent/ImageComponent';
const api = process.env.NEXT_PUBLIC_GLOBAL_API;
export const DivParticleUlasan = ({
  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
    title,
    optional,
    hr,
    children,
    classname,
  }) => {
    return (
      <>
        <div className={`flex flex-col gap-4 ${classname}`}>
          <span className="font-medium text-xs text-neutral-900 sm:font-semibold sm:text-sm">
            {title}{" "}
            {optional && (
              <span className="italic text-neutral-600 sm:font-semibold sm:!not-italic sm:!text-black sm:!text-[10px]">
                (Opsional)
              </span>
            )}
          </span>
          {children}
        </div>
        {hr && <hr className="border-neutral-400" />}
      </>
    );
};
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0088
const BerikanUlasanResponsive = ({data,handleFilterOrderList = "",isFromList = false,menus}) => {
    const config = ConfigUrl();
    const [isUploading, setIsUploading] = useState(false);
    const [uploaderKey, setUploaderKey] = useState(0);
    const [modalDelete, setModalDelete] = useState(false);
    const { useSWRMutateHook, useSWRHook } = SWRHandler();
    const { setDataToast, setShowToast } = toast();
    const  { setScreen }=useHeader()
    const { trigger: uploadImage } = useSWRMutateHook(
        `${api}v1/muatparts/reviews/upload_photo_review`,
        "POST"
      );
    const {
        form,
        setForm,
        setRating,
        addPhoto,
        removePhoto,
        resetForm,
        validateForm,
      } = useUlasanStore();
      
    useEffect(() => {
        if(data) {
            setForm({
                productId : isFromList ? data.transaction[0].products[0].id : data.storeOrders[0].items[0].originalProductID,
                transactionId:  isFromList ? data.transaction[0].transactionID : data.storeOrders[0].transactionID ,
                productName: isFromList ? data.transaction[0].products[0].productName : data.storeOrders[0].items[0].productName
            })
        }
    },[data])

    const handleUploadImage = async (base64String, index) => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", await (await fetch(base64String)).blob());
  
        const response = await uploadImage(formData);
        if (response?.data?.Data?.url) {
          addPhoto(response.data.Data.url, index);
          setUploaderKey((prev) => prev + 1);
        }
      } catch (err) {
        setShowToast(true);
        setDataToast({ type: "error", message: "Gagal memproses foto" });
      } finally {
        setIsUploading(false);
      }
    };

    const batalkanSubmit = () => {
      setModalDelete(true);
    }

    const handleCancelReview = () => {
      setModalDelete(false);
      resetForm();
      setScreen('');
    }

  // Fungsi handleSubmit yang diperbarui dalam file BerikanUlasanResponsive.jsx
  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
      return;
    }

    try {
      const { productId, transactionId, rating, ulasanText, uploadedPhotos } = form;
      
      // Ubah format photos dari photos[index] menjadi array biasa
      const photosArray = uploadedPhotos.filter(photo => photo !== null);
      
      const bodyParams = {
        productId: productId,
        transactionId: transactionId,
        rating: rating,
        photos: photosArray // Kirim sebagai array, bukan photos[0], photos[1], dll
      };

      if (ulasanText?.trim()) {
        bodyParams.comment = ulasanText;
      }
    
      await config.post({
        path: 'v1/muatparts/reviews',
        data: bodyParams,
      });
      
      setScreen('');
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil membuat ulasan`,
      });
      resetForm();
      if(handleFilterOrderList) handleFilterOrderList("status", menus[4]?.includes?.toString());

    } catch (error) {
      console.log(error);
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.response?.data?.Data?.Message || "Terjadi kesalahan",
      });
    }
  };

    return (
        <div className='h-screen overflow-x-hidden'>
          <ModalComponent
              isOpen={modalDelete}
              setClose={() => setModalDelete(false)}
              hideHeader
              classnameContent={"py-6 px-4 text-center w-[296px] space-y-3"}
            >
              <div className="font-bold !mt-0">Batalkan Membuat Ulasan</div>
              <div className="text-sm font-medium">
                Apakah kamu yakin untuk membatalkan tambah ulasan?
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  Class="h-7 !font-semibold"
                  children="Yakin"
                  color="primary_secondary"
                  onClick={handleCancelReview}
                />
                <Button
                  Class="h-7 !font-semibold"
                  children="Batal"
                  color="primary"
                  onClick={() => setModalDelete(false)}
                />
              </div>
            </ModalComponent>
            <div className="space-y-6 py-5 px-4">
                <div className="flex items-start gap-5">
                    {/* <ImageComponent
                        src={isFromList ? data.transaction[0].products[0].photo : data.storeOrders[0].items[0].imageUrl}
                        alt={form.productName}
                        className="w-14 h-14 object-cover rounded-md"
                        width={56}
                        height={56}
                    /> */}
                    <div className="w-[348px]">
                        <div className="font-bold text-xs mb-2">{form.productName}</div>
                        <div className="text-xs text-neutral-600 font-medium mb-1">
                        {/* {data.data.transaction[0].products[0].variant} - {dat.transaction[0].products[0].variant} */}
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

            <DivParticleUlasan title="Berikan ulasan produk ini (opsional)">
                <TextArea
                    hasCharCount={false}
                    classname="!w-full !min-w-full !max-w-full"
                    resize="none"
                    placeholder="Jelaskan pelanggaran yang terjadi"
                    supportiveText={{
                        title: null,
                        desc: `${form.ulasanText.length}/500`,
                    }}
                    value={form.ulasanText}
                    changeEvent={(e) => setForm({ ulasanText: e.target.value })}
                />
            </DivParticleUlasan>

            <DivParticleUlasan title="Bagikan foto-foto dari produk kamu yang terima (Opsional)">
                <div className="flex flex-wrap gap-4">
                {form.uploadedPhotos.map((url, idx) => (
                    <div key={`container-${uploaderKey}-${idx}`} className="relative">
                        <div className={url ? "hidden" : "block"}>
                        <ImageUploader
                            key={`uploader-${uploaderKey}-${idx}`}
                            className="!rounded-xl !size-[72px] border-2 border-dashed !border-neutral-400"
                            getImage={(e) => handleUploadImage(e, idx)}
                            maxSize={10}
                            uploadText="Unggah"
                            isCircle={true}
                            onUpload={(e) => {
                                handleUploadImage(e, idx);
                            }}
                            onError={(e) => {
                                console.log(e, " err");
                            }}
                            error={false}
                            isLoading={isUploading}
                        />
                        </div>
                        {url && (
                        <div className="relative">
                            <img
                            src={url}
                            className="!rounded-xl !size-[72px] border-2 border-dashed border-neutral-400 object-cover"
                            alt={`Foto ${idx + 1}`}
                            />
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removePhoto(idx);
                            }}
                            className="absolute top-[4px] right-[5px] rounded-full size-4 flex items-center justify-center z-10 bg-white"
                            >
                            <X color="black" size={12} />
                            </button>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                <span className="font-medium text-xs text-neutral-600">
                    Min. 1 foto dengan format file jpg/png, besar file maks. 10MB
                </span>
            
            </DivParticleUlasan>

            </div>
            <NavSelectedMobile classname="!left-0 w-full">
            <div className="flex justify-center gap-2">
                <Button
                color="primary_secondary"
                Class="!max-w-full !w-[50%] !max-h-10 !font-semibold"
                onClick={batalkanSubmit}
                >
                Batalkan
                </Button>
                <Button
                Class="!max-w-full !w-[50%] !max-h-10 !font-semibold"
                onClick={handleSubmit}
                >
                    Kirim
                </Button>
            </div>
            </NavSelectedMobile>
        </div>
    )

  // 24. THP 2 - MOD001 - MP - 019 - QC Plan - Web - MuatParts - Ulasan Buyer LB - 0017 LB - 0051 LB - 0013 LB - 0052
}

export default BerikanUlasanResponsive