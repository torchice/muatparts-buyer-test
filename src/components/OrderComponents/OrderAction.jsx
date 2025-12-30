import React, { useEffect, useState, Fragment } from "react";
import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";
import { useOrderDetailStore } from "@/store/order";
import { authZustand } from "@/store/auth/authZustand";
import { Star, X } from "lucide-react";
import SWRHandler from "@/services/useSWRHook";
import Image from "next/image";
import { downloadFile } from "@/utils/Helper";
import useBatalkanPesanan from "@/store/batalkanPesanan";
import { useCustomRouter } from "@/libs/CustomRoute";
import ConfigUrl from "@/services/baseConfig";
import toast from "@/store/toast";
import { modal } from "@/store/modal";
import useUlasanStore from "@/app/ulasanbuyer/storeUlasan";
import TextArea from "@/components/TextArea/TextArea";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import ComplaintPopUp from "@/app/komplainbuyer/ComplaintPopUp";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

const FormUlasan = ({ data, mutateIdPesanan }) => {
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

  useEffect(() => {
    console.log("data", data);
    if (data) {
      setForm({
        productId: data.storeOrders[0].items[0].originalProductID,
        transactionId: data.storeOrders[0].transactionID,
        productName: data.storeOrders[0].items[0].productName,
      });
    }
  }, [data]);

  const { setDataToast, setShowToast } = toast();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { useSWRMutateHook, useSWRHook } = SWRHandler();
  const [isUploading, setIsUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const { trigger: uploadImage } = useSWRMutateHook(
    `${api}v1/muatparts/reviews/upload_photo_review`,
    "POST"
  );

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
        setModalContent(
          <FormUlasan data={data} mutateIdPesanan={mutateIdPesanan} />
        );
      },
    });

    setModalContent(
      <div className="py-9 px-6 flex flex-col justify-center items-center gap-5">
        <span className="font-medium text-sm text-neutral-900 text-center block">
          Apakah kamu yakin untuk membatalkan tambah ulasan?
        </span>
        <div className="flex gap-2 justify-center items-center">
          <Button
            children="Yakin"
            color="primary_secondary"
            Class="!font-semibold"
            onClick={resetForm}
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
              console.log("res review", res);
              setModalContent(
                <FormUlasan data={data} mutateIdPesanan={mutateIdPesanan} />
              );
            }}
          />
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
      return;
    }

    try {
      const { productId, transactionId, rating, ulasanText, uploadedPhotos } =
        form;
      const photosObj = {};

      uploadedPhotos.forEach((photo, index) => {
        if (photo) {
          photosObj[`photos[${index}]`] = photo;
        }
      });

      const bodyParams = {
        productId: productId,
        transactionId: transactionId,
        rating: rating,
        ...photosObj,
      };

      if (ulasanText?.trim()) {
        bodyParams.comment = ulasanText;
      }

      await config
        .post({
          path: "v1/muatparts/reviews",
          data: bodyParams,
        })
        .then((res) => {
          if (res.status === 200) mutateIdPesanan();
        });

      setModalOpen(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil membuat ulasan`,
      });
      resetForm();
    } catch (error) {
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.response?.data?.Data?.Message || "Terjadi kesalahan",
      });
    }
  };
  // return "hi";
  return (
    <div className="py-8 px-6">
      <span className="font-bold text-base text-neutral-900 block text-center mb-5">
        Tulis Ulasan
      </span>

      <div className="flex items-start gap-5">
        <Image
          src={data.storeOrders[0].items[0].imageUrl}
          alt={form.productName}
          className="w-14 h-14 object-cover rounded-md"
          width={56}
          height={56}
        />
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
          {form.uploadedPhotos.map((url, idx) => (
            <div key={`container-${uploaderKey}-${idx}`} className="relative">
              <div className={`${url ? "hidden" : "block"}`}>
                <ImageUploader
                  key={`uploader-${uploaderKey}-${idx}`}
                  className="!rounded-[4px] !size-[40px]"
                  getImage={(e) => handleUploadImage(e, idx)}
                  maxSize={10000}
                  uploadText=""
                  isCircle={true}
                  onUpload={() => {}}
                  onError={() => {}}
                  error={false}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(idx);
                    }}
                    className="absolute top-[1px] right-[3px] rounded-full size-4 flex items-center justify-center z-10 bg-white"
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
};

const OrderAction = ({ orderStatus, data = "", mutateIdPesanan }) => {
  const { t } = useLanguage();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { resetForm } = useUlasanStore();
  const router = useCustomRouter();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { setModalBatal, setValidateReason, setActiveReason } =
    useBatalkanPesanan();
  const [invoiceBool, setInvoiceBool] = useState(false);
  const { data: dataSwr, mutate: mutateSwr } = useSWRHook(
    invoiceBool
      ? `v1/muatparts/transaction/print?transactionIds[0]=${data?.storeOrders[0].transactionID}`
      : ""
  );

  //  25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0360
  const { trigger: submitDataRoom } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_CHAT_API}api/rooms/muat-muat`,
    "POST",
    null,
    null,
    { loginas: "buyer" }
  );

  const directChatRoom = (ids) => {
    const body = {
      recipientMuatId: ids,
      recipientRole: "seller",
      menuName: "Muatparts",
      subMenuName: "Muatparts",
      message: "",
      initiatorRole: "buyer",
    };
    submitDataRoom(body).then((x) => {
      // return console.log(x, " kuda")
      setTimeout(() => {
        router.push(
          `${
            process.env.NEXT_PUBLIC_CHAT_URL
          }initiate?initiatorId=&initiatorRole=${
            body.initiatorRole
          }&recipientId=${body.recipientMuatId}&recipientRole=${
            body.recipientRole
          }&menuName=${body.menuName}&subMenuName=${
            body.subMenuName
          }&accessToken=${authZustand.getState().accessToken}&refreshToken=${
            authZustand.getState().refreshToken
          }`
        );
      }, 2000);
    });
  };
  // chat titip

  const API_COMPLETE_TRANSACTION =
    process.env.NEXT_PUBLIC_GLOBAL_API + `v1/muatparts/transactions/complete`;
  const { data: resCompleteTransaction, trigger: triggerCompleteTransaction } =
    useSWRMutateHook(API_COMPLETE_TRANSACTION, "POST");

  useEffect(() => {
    if (resCompleteTransaction) mutateIdPesanan();
  }, [resCompleteTransaction]);

  useEffect(() => {
    if (dataSwr) {
      downloadFile(dataSwr?.Data, "invoice.pdf");
    }
  }, [dataSwr]);

  const [complaintPopUp, setComplaintPopUp] = useState(false);

  const actions = [
    {
      condition: orderStatus === "Selesai" && !data?.storeOrders[0].isReview,
      //  25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0125
      label: t("AppMuatpartsDaftarPesananBuyerBerikanUlasan"),
      color: "primary",
      icon: null,
      action: () => {
        setModalOpen(true);
        setModalConfig({
          withHeader: false,
          withClose: true,
          classname: "max-w-[472px] min-h-[545px]",
          onClose: resetForm,
        });
        setModalContent(
          <FormUlasan data={data} mutateIdPesanan={mutateIdPesanan} />
        );
      },
    },
    {
      condition:
        orderStatus === "Tiba di Tujuan" ||
        (orderStatus === "Dikirim" &&
          data?.storeOrders[0].shippingInfo.shippingType === "store_courier"),
      label: "Selesaikan Pesanan",
      color: "primary",
      icon: null,
      action: () => {
        setModalOpen(true);
        setModalConfig({
          // withHeader: false,
          withClose: true,
          classname: "max-w-[386px] rounded-t-xl",
        });
        setModalContent(
          <div className="py-9 px-6">
            <div className="text-center font-medium text-sm">
              Apakah kamu yakin akan menyelesaikan pesanan ini? Setelah
              dikonfirmasi, status pesanan tidak dapat diubah
            </div>
            <div className="flex mt-6 gap-2 justify-center items-center">
              <Button
                children={t("labelNo")}
                color="primary_secondary"
                Class="!font-semibold !h-8"
                onClick={() => setModalOpen(false)}
              />
              <Button
                children={t("labelYes")}
                Class="!font-semibold !h-8"
                onClick={() => {
                  setModalOpen(false);
                  triggerCompleteTransaction({
                    transactionId: data?.storeOrders[0].transactionID,
                  });
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      condition:
        orderStatus === "Dikomplain" ||
        orderStatus === "Pengembalian Dana Selesai" ||
        orderStatus === "Komplain Selesai",
      label: t("AppMuatpartsDaftarPesananBuyerDetailKomplain"),
      color: "primary",
      icon: null,
    },
    {
      condition: true,
      label: t("AppKelolaPesananSellerMuatpartsCetakInvoice"),
      color: "primary_secondary",
      icon: "/icons/invoice.svg",
      action: () => {
        setInvoiceBool(true);
      },
    },
    {
      condition: orderStatus !== "Menunggu Pembayaran",
      label: t("AppMuatpartsDaftarPesananBuyerChatPenjual"),
      color: "primary_secondary",
      icon: "/icons/chat-blue.svg",
      action: () => {
        directChatRoom(data?.storeOrders?.[0].storeID);
      },
    },
    {
      condition:
        orderStatus === "Menunggu Pembayaran" ||
        orderStatus === "Menunggu Respon Penjual",
      label: t("SubscriptionCancelOrder"),
      color: "error_secondary",
      icon: null,
      action: () => {
        setValidateReason(false);
        setActiveReason(false);
        setModalBatal(true);
      },
    },
    {
      // 24. THP 2 - MOD001 - MP - 027 - QC Plan - Web - MuatParts - Komplain Buyer - LB - 0037
      condition:
        !data?.storeOrders[0].isComplaint &&
        (orderStatus === "Tiba di Tujuan" ||
          (orderStatus === "Dikirim" &&
            data?.storeOrders[0].shippingInfo.shippingType ===
              "store_courier")),
      label: "Ajukan Komplain",
      color: "error_secondary",
      icon: null,
      action: () => {
        setComplaintPopUp(true);
      },
    },
    {
      condition:
        orderStatus === "Dibatalkan Penjual" ||
        orderStatus === "Dibatalkan Pembeli" ||
        orderStatus === "Dibatalkan Sistem" ||
        orderStatus === "Pengembalian Dana Selesai",
      label: t("AppKelolaPesananSellerMuatpartsBantuan"),
      color: "primary_secondary",
      icon: null,
    },
  ];

  const handleSelectComplaint = (val) => {
    router.push(
      `/komplainbuyer?OrderID=${data?.orderID}&TransactionID=${data?.storeOrders[0].transactionID}&alasanID=${val.id}`
    );
  };

  return (
    <>
      <div className="space-y-4 mt-6">
        {actions.map(
          (action, index) =>
            action.condition && (
              <Button
                key={index}
                children={
                  <div className="flex items-center gap-2">
                    {action.icon && (
                      <IconComponent src={action.icon} width={16} height={16} />
                    )}
                    <span className="mt-[2px]">{action.label}</span>
                  </div>
                }
                color={action.color}
                onClick={() => action.action()}
                Class="!min-w-full !h-8 !font-semibold"
              />
            )
        )}
      </div>
      {complaintPopUp && (
        <ComplaintPopUp
          onClose={() => setComplaintPopUp(false)}
          onSelect={handleSelectComplaint}
        />
      )}
    </>
  );
};

export default OrderAction;
