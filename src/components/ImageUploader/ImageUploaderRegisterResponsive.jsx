"use client";

import { useState, useEffect, useRef } from "react";
import { modal } from "@/store/modal";
import Button from "../Button/Button";
import CropperImage from "../Cropper/Cropper";
import { useSWRConfig } from "swr";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/toast";
import Bottomsheet from "../Bottomsheet/Bottomsheet";
import { Camera, Upload } from "lucide-react";

const api = process.env.NEXT_PUBLIC_API_HASYIM_DEVLINUX;

const ImageUploaderRegisterResponsive = ({
  value,
  defaultValue,
  isProfil = false,
}) => {
  const {
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { mutate } = useSWRConfig();
  const { useSWRMutateHook } = SWRHandler();
  const { trigger: setPhoto } = useSWRMutateHook(
    api + "v1/register/seller/logo",
    "POST"
  );

  const [resultCrops, setResultCrops] = useState(
    defaultValue !== null ? defaultValue : ""
  );
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    // Reset bottomsheet saat komponen di-mount
    setShowBottomsheet(false);
  }, []);

  useEffect(() => {
    console.log(resultCrops);
    resultCrops !== "" && value(resultCrops);
  }, [resultCrops]);

  useEffect(() => {
    defaultValue !== null && setResultCrops(defaultValue);
  }, [defaultValue]);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Format file harus jpg/png",
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "Ukuran file maksimal 10MB",
      };
    }

    return { isValid: true, error: "" };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
      fileRef.current.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setIsOpen(true);
      setShowBottomsheet(false);
      setIsShowPreview(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedDataUrl) => {
    if (!croppedDataUrl) {
      setShowToast(true);
      setDataToast({ type: "error", message: "Gagal memproses gambar" });
      return;
    }

    try {
      const base64Response = await fetch(croppedDataUrl);
      const blob = await base64Response.blob();
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      await setPhoto(formData)
        .then((response) => {
          mutate(api + "v1/register/seller/logo");
          setResultCrops(response.data.Data.url);
          setModalOpen(false);
        })
        .catch((err) => {
          console.error("Upload error:", err);
          setShowToast(true);
          setDataToast({ type: "error", message: "Gagal memproses foto" });
        });

      setImage(null);
      fileRef.current.value = null;
    } catch (error) {
      console.error("Error processing upload:", error);
      setShowToast(true);
      setDataToast({ type: "error", message: "Gagal memproses foto" });
    }
  };

  const handleClose = () => {
    setImage(null);
    fileRef.current.value = null;
    setShowBottomsheet(false);
  };

  const handleResetAndShowOptions = () => {
    setIsShowPreview(false);
    setIsOpen(false);
    setImage(null);
    handleUbah();
  };

  // Define upload options once to be reused
  const uploadOptions = [
    {
      src: "/icons/camera.svg",
      title: "Ambil Foto",
      onClick: () => {
        console.log("ambil foto");
        setShowBottomsheet(false);
        setIsShowPreview(false);
      },
    },
    {
      src: "/icons/Upload.svg",
      title: "Unggah File",
      onClick: () => {
        fileRef.current.click();
        setShowBottomsheet(false);
        setIsShowPreview(false);
      },
    },
  ];

  const handleUbah = () => {
    setTitleBottomsheet("  -");
    setShowBottomsheet(true);
    setDataBottomsheet(
      <div className="flex justify-evenly items-center">
        {uploadOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 items-center cursor-pointer"
            onClick={option.onClick}
          >
            <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center">
              {index === 0 ? (
                <Camera size={24} color="white" />
              ) : (
                <Upload size={24} color="white" />
              )}
            </div>
            <span className="text-sm font-semibold text-neutral-900">
              {option.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = () => {
    setModalContent(
      <div className="py-9 px-6">
        <span className="font-medium text-sm block text-center mb-6">
          Apakah kamu yakin ingin menghapus gambar?
        </span>
        <div className="flex justify-center gap-2">
          <Button color="primary_secondary" onClick={() => setModalOpen(false)}>
            Tidak
          </Button>
          <Button
            onClick={() => {
              setResultCrops("");
              setModalOpen(false);
            }}
          >
            Ya
          </Button>
        </div>
      </div>
    );
    setModalConfig({
      classname: "!w-[386px]",
      withHeader: true,
      withClose: true,
    });
    setModalOpen(true);
  };

  return (
    <>
      <Bottomsheet />
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileRef}
      />
      {isProfil ? (
        <div className="w-[94px] h-[94px] border-8 border-white rounded-full relative">
          <img
            src={profileData.profile.avatar}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
          <div
            className="absolute top-12 -right-4 rounded-full bg-white border border-primary-700 w-[35px] h-[35px] flex justify-center items-center"
            onClick={handleUbah}
          >
            <PencilLine size={12} className="text-primary-700" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img
            src={`${
              resultCrops
                ? resultCrops
                : "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1733985462989.webp"
            }`}
            loading="lazy"
            className="size-[72px] rounded-full"
          />

          <div className="flex gap-3">
            {resultCrops && (
              <Button
                onClick={handleDelete}
                Class="!h-8 !font-semibold"
                color="primary_secondary"
              >
                Hapus
              </Button>
            )}

            <Button onClick={handleUbah} Class="!h-8 !font-semibold">
              {resultCrops ? "Ubah" : "Unggah"}
            </Button>
          </div>
          <span className="w-full text-center font-medium text-xs text-neutral-600 leading-[14.4px]">
            Format file jpg/png maks. 10MB
          </span>
        </div>
      )}

      <CropperImage
        imageSource={image}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        result={handleCropComplete}
        onClose={handleClose}
        required={true}
        isShowPreview={isShowPreview}
        setIsShowPreview={setIsShowPreview}
        uploadOptions={uploadOptions}
        previewTitle="Logo Toko"
        onChangeImage={handleResetAndShowOptions}
      />
    </>
  );
};

export default ImageUploaderRegisterResponsive;
