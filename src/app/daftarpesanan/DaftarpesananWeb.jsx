"use client";

import React, { useEffect, useState, Fragment } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useSearchParams } from "next/navigation";
import style from "./Daftarpesanan.module.scss";
import { Star, X } from "lucide-react";
import TabMenuDaftarPesanan from "@/components/Menu/TabMenuDaftarPesanan";
import Input from "@/components/Input/Input";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import IconComponent from "@/components/IconComponent/IconComponent";
import TextArea from "@/components/TextArea/TextArea";
import { numberFormatMoney } from "@/libs/NumberFormat";
import Button from "@/components/Button/Button";
import ProductItem from "@/components/ProductItem/ProductItem";
import Image from "next/image";
import InvoiceLabel from "@/components/OrderComponents/InvoiceLabel";
import { useCustomRouter } from "@/libs/CustomRoute";
import SWRHandler from "@/services/useSWRHook";
import { authZustand } from "@/store/auth/authZustand";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import { clasifyformatdate } from "@/libs/DateFormat";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { useDebounce } from "@/utils/useDebounce";
import ModalComponent from "@/components/Modals/ModalComponent";
import OrderTimeline from "@/components/OrderComponents/OrderTimeline";
import ConfigUrl from "@/services/baseConfig";
import { modal } from "@/store/modal";
import useUlasanStore from "../ulasanbuyer/storeUlasan.js";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import toast from "@/store/toast";
import { useLanguage } from "@/context/LanguageContext";
import DaftarPesananSkeleton from "./DaftarPesananSkeleton";
const api = process.env.NEXT_PUBLIC_GLOBAL_API;

export const FormUlasan = ({ data, handleFilterOrderList, mutate=()=>{} }) => {
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

  const { t } = useLanguage();

  useEffect(() => {
    console.log("data", data);
    if (data) {
      setForm({
        productId: data.transaction[0].products[0].id,
        transactionId: data.transaction[0].transactionID,
        productName: data.transaction[0].products[0].productName,
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
        setModalContent(<FormUlasan data={data} />);
      },
    });

    setModalContent(
      <div className="py-9 px-6 flex flex-col justify-center items-center gap-5">
        <span className="font-medium text-sm text-neutral-900 text-center block">
          Apakah kamu yakin untuk membatalkan tambah ulasan?
        </span>
        <div className="flex gap-2 justify-center items-center">
          <Button
            children={t("ProfilPerusahaanYakin")}
            color="primary_secondary"
            Class="!font-semibold"
            onClick={resetForm}
          />
          <Button
            children={t("ProfilPerusahaanBatal")}
            Class="!font-semibold"
            onClick={() => {
              setModalConfig({
                withHeader: false,
                withClose: true,
                classname: "max-w-[472px] min-h-[545px]",
                onClose: undefined,
              });
              setModalContent(<FormUlasan data={data} />);
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

      await config.post({
        path: "v1/muatparts/reviews",
        data: bodyParams,
      });

      setModalOpen(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil membuat ulasan`,
      });
      resetForm();
      // handleFilterOrderList("status", 5);
      // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0126
      mutate()
    } catch (error) {
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.response?.data?.Data?.Message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="py-8 px-6">
      <span className="font-bold text-base text-neutral-900 block text-center mb-5">
        Tulis Ulasan
      </span>

      <div className="flex items-start gap-5">
        <Image
          src={data.transaction[0].products[0].photo}
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
          children={t("BuyerIndexBatalkan")}
          color="primary_secondary"
          Class="!font-semibold !h-8"
          onClick={handleCancel}
        />
        <Button
          children={t("AppManajemenGarasiMuatpartsKirim")}
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

function DaftarpesananWeb({
  data,
  status_pesanan,
  detailPesanan,
  isLoading,
  data_count,
  setPage,
  handleFilterOrderList,
  totalProduct,
  paginate,
  dataRekening,
  mutate,
}) {
  const { t } = useLanguage();
  const router = useCustomRouter();
  const { resetForm } = useUlasanStore();
  const [openLacakMap, setOpenLacakMap] = useState({});
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const [showMore, setShowMore] = useState({});
  const [search, setSearch] = useState("");
  const [getRecentOptionsSort, setRecentOptionsSort] = useState([]);
  const { useSWRMutateHook } = SWRHandler();
  const tab = useSearchParams().get("tab") || 1;
  const debouncedQuery = useDebounce(search, 300);
  const { setDataToast, setShowToast } = toast();
  const { selectedLocation } = userLocationZustan();
  const list_periode = [
    {
      name: `${t("EksekusiTenderIndexSemuaPeriode")} (Default)`,
      value: "",
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
      value: 365,
      format: "year",
    },
  ];
  const menus = [
    {
      name: t("AppMuatpartsDaftarPesananBuyerSemua"),
      id: 1,
      notif: data_count?.Semua,
      status: "",
      categories: "all",
    },
    {
      name: t("AppMuatpartsDaftarPesananBuyerBelumBayar"),
      id: 2,
      status: "Menunggu Pembayaran",
      notif: data_count?.Belum_Bayar,
      categories: ["Menunggu Pembayaran"],
    },
    {
      name: t("AppMuatpartsDaftarPesananBuyerDiproses"),
      id: 3,
      status: "Menunggu Respon Penjual,Dikemas",
      notif: data_count?.Diproses,
      categories: ["menungguRespon", "dikemas"],
    },
    {
      name: t("AppMuatpartsDaftarPesananBuyerDikirim"),
      id: 4,
      status: "Dikirim,Tiba di Tujuan,Dikomplain",
      notif: data_count?.Dikirim,
    },
    {
      name: t("AppMuatpartsDaftarPesananBuyerSelesai"),
      id: 5,
      status: "Selesai,Komplain Selesai",
      notif: data_count?.Selesai,
    },
    {
      name: t("KontrakHargaIndexDibatalkan"),
      id: 6,
      status:
        "Dibatalkan Pembeli,Dibatalkan Penjual,Dibatalkan Sistem,Pengembalian Dana Selesai",
      notif: data_count?.Dibatalkan,
    },
  ];

  const { trigger: addToTroliBulk, error: errorAddToTroliBulk } =
    useSWRMutateHook(
      process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/cart/bulk_item"
    );

  // chat titip

  const handlePageChange = (newPage) => {
    handleFilterOrderList("page", newPage);
  };

  const handlePageSizeChange = (newSize) => {
    handleFilterOrderList("page", 1);
    handleFilterOrderList("size", newSize);
  };

  //24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0014
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

  const beliLagiMethod = (item) => {
    addToTroliBulk({
      cart: [
        {
          locationId: selectedLocation.ID,
          items: item?.products?.map((item) => ({
            isChecked: true,
            productId: item?.id,
            variantId: item?.variant?.id ?? null,
            quantity: item?.qty,
            notes: item?.notes,
          })),
        },
      ],
    })
      .then(() => router.push("/troli"))
      .catch((err) => {
        if (err) {
          setShowToast(true);
          setDataToast({
            type: "error",
            message: err?.response?.data?.Data,
          });
        }
      });
  };

  const { trigger: submitTroli } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/cart/items`,
    "POST"
  );

  function handleSelectSort(a) {
    if (a?.range) {
      handleFilterOrderList(
        "start_date",
        clasifyformatdate.getClasifyPeriodeByRange(a?.start_date)
      );
      handleFilterOrderList(
        "end_date",
        clasifyformatdate.getClasifyPeriodeByRange(a?.end_date)
      );
      if (getRecentOptionsSort?.some((s) => s?.value === a?.value))
        setRecentOptionsSort(
          getRecentOptionsSort?.filter((z) => z?.value !== a?.value)
        );
      else setRecentOptionsSort((terr) => [...terr, a]);
    }
    // 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0022
    else if (a?.value !== "" || a?.value === 0) {
      handleFilterOrderList(
        "start_date",
        clasifyformatdate.getClasifyPeriode(a.value)
      );
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0308
      handleFilterOrderList(
        "end_date",
        ''
      );
    } else {
      handleFilterOrderList("start_date", "");
    }
  }
  useEffect(() => {
    setPage((a) => ({ ...a, page: 1 }));
  }, []);

  useEffect(() => {
    handleFilterOrderList(
      "status",
      menus.find((item) => item.id == tab)?.status
    );
    // 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan - LB - 0050
    setPage((prev) => ({
      ...prev,
      page: 1,
    }));
    setSearch("");
  }, [tab]);

  useEffect(() => {
    handleFilterOrderList("q", search);
  }, [debouncedQuery]);

  const clearSearch = () => setSearch("");

  // console.log(getRecentOptionsSort)
  return (
    <>
      <div className={style.main + " gap-[38px]"}>
        <div className="">
          <Sidebar />
        </div>

        {isLoading ? (<DaftarPesananSkeleton />) : (<div className="w-full">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              {t("titleHeaderDaftarPesanan")}
            </div>
            {/* 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0021 */}
            <DropdownPeriode
              disable={data.length == 0 && search.length > 0}
              options={list_periode}
              onSelect={handleSelectSort}
              recentSelections={getRecentOptionsSort}
            />
          </div>
          <div className="my-4">
            <TabMenuDaftarPesanan isLoading={isLoading} menu={menus} />
          </div>
          <div className="p-6 rounded-xl space-y-4 shadow-muatmuat">
            {(data.length > 0 || search != "") && (
              <Input
                value={search}
                placeholder={t("AppMuatpartsDaftarPesananBuyerCariPesanan")}
                classname={"w-[262px]"}
                changeEvent={(event) => setSearch(event.target.value)}
                icon={{
                  left: <IconComponent src={"/icons/search.svg"} />,
                  right: search && (
                    <IconComponent
                      onclick={clearSearch}
                      src={"/icons/silang.svg"}
                    />
                  ),
                }}
              />
            )}
            {/* <pre>
              <code>{JSON.stringify(data_count, null, 2)}</code>
            </pre> */}

            {data.length > 0 ? (
              <>
                {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0409 */}
                {tab == 6 && dataRekening.Data?.totalAccounts === 0 && (
                  <div className="flex gap-2 items-center bg-secondary-100 px-6 py-4 rounded-md text-xs font-medium mb-4">
                    <IconComponent
                      width={20}
                      height={20}
                      icon="warning"
                      src={"/icons/warning-outline.svg"}
                      color="warning"
                    />
                    <div className="">
                      Kamu belum mendaftarkan rekening bank untuk pengembalian
                      dana.{" "}
                      <a
                        className="text-primary-700 font-semibold"
                        href={
                          process.env.NEXT_PUBLIC_INTERNAL_WEB +
                          "accountmanagement/rekening_bank"
                        }
                      >
                        Tambah Rekening Bank
                      </a>
                    </div>
                  </div>
                )}

                {data.map((order, index) => (
                  <>
                    <div
                      key={index}
                      className="rounded-[10px] border border-neutral-600"
                    >
                      <div className="">
                        {order.transaction.map((item, idx) => (
                          <div key={idx}>
                            <div className="py-5 px-8 border-b border-neutral-600">
                              <div className="flex justify-between items-center mb-5">
                                <InvoiceLabel invoice={item.invoiceId} />
                                {item.statusInfo && (
                                  <div className="flex gap-3 text-xs items-center">
                                    <span className="font-medium">
                                      {order.orderDate}
                                    </span>
                                    <span
                                      className={`whitespace-nowrap block text-center text-ellipsis overflow-hidden w-[155px] font-semibold px-2 py-1 rounded-md bg-${item.statusInfo.bg} text-${item.statusInfo.textColor}`}
                                    >
                                      {item.statusBuyer}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {item.products.length > 0 && (
                                <>
                                  <ProductItem
                                    {...item.products[0]}
                                    variant={
                                      item.products[0].variant?.variantName
                                    }
                                  />
                                  {item.products.length > 1 && (
                                    <>
                                      {showMore[index] && (
                                        <div className="mt-2 space-y-2">
                                          {item.products
                                            .slice(1)
                                            .map((product, idx) => (
                                              <div
                                                key={idx}
                                                className="border-t pt-3 mt-3"
                                              >
                                                <ProductItem
                                                  {...product}
                                                  variant={
                                                    product?.variant
                                                      ?.variantName
                                                  }
                                                />
                                              </div>
                                            ))}
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
                                          ? t("BuyerIndexSembunyikan")
                                          : `+ ${item.products.length - 1} ${t(
                                              "AppMuatpartsDaftarPesananBuyerProdukLainnya"
                                            )}`}
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
                                </>
                              )}
                            </div>
                            {order.transaction.length > 1 && (
                              <>
                                {/* 2 pesanan */}
                                <div className="py-5 px-8 border-b border-neutral-600 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6">
                                      <IconComponent
                                        src={"/icons/product-house.svg"}
                                        width={24}
                                        height={24}
                                      />
                                    </div>
                                    <div className="text-sm font-semibold max-w-72">
                                      {item.storeName}
                                    </div>
                                  </div>
                                  {/* 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan - LB - 0007 */}
                                  <Button
                                    color="primary_secondary"
                                    children={t(
                                      "AppMuatpartsDaftarPesananBuyerChatPenjual"
                                    )}
                                    Class="!h-8 !font-semibold !pb-2"
                                    onClick={() =>
                                      directChatRoom(
                                        order.transaction[0].sellerID
                                      )
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        <div className="py-4 px-8 border-b border-neutral-600 flex justify-between items-center">
                          <div className="text-sm font-bold">
                            {t("AppMuatpartsDaftarPesananBuyerTotalPesanan")}
                          </div>
                          <div className="text-sm font-bold">
                            {numberFormatMoney(order.grandTotal)}
                          </div>
                        </div>
                        <div className="py-5 px-8">
                          {order.transaction.length > 1 ? (
                            <>
                              {/* 2 pesanan */}
                              <div className="flex justify-between items-center">
                                <div className="text-xs font-medium">
                                  <span className="text-neutral-600">
                                    {order.transaction[0].statusInfo.text}
                                  </span>
                                  <span>
                                    {order.transaction[0].statusInfo.date}
                                  </span>
                                </div>
                                <Button
                                  color="primary"
                                  children={t(
                                    "AppMuatpartsDaftarPesananBuyerDetailPesanan"
                                  )}
                                  Class="!h-8 !font-semibold !pb-2"
                                  onClick={() =>
                                    router.push(
                                      `/daftarpesanan/${
                                        order.orderID
                                      }?transactionID=${
                                        order.transaction[0].transactionID
                                      }&${
                                        order.transaction[0].statusBuyer ===
                                        "Menunggu Pembayaran"
                                          ? "page=menunggu_pembayaran"
                                          : ""
                                      }`
                                    )
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {/* 1 pesanan */}
                              <div className="flex justify-between items-center mb-4 gap-3">
                                <div className="flex flex-grow justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6">
                                      <IconComponent
                                        src={"/icons/product-house.svg"}
                                        width={24}
                                        height={24}
                                      />
                                    </div>
                                    <div className="text-sm font-semibold max-w-72">
                                      {order.transaction[0].storeName}
                                    </div>
                                  </div>
                                  <Button
                                    color="primary_secondary"
                                    children={t(
                                      "AppMuatpartsDaftarPesananBuyerChatPenjual"
                                    )}
                                    Class="!h-8 !font-semibold !pb-2"
                                    onClick={() =>
                                      directChatRoom(
                                        order.transaction[0].sellerID
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex gap-3 w-fit">
                                  <Button
                                    color="primary"
                                    children={t(
                                      "AppMuatpartsDaftarPesananBuyerDetailPesanan"
                                    )}
                                    Class="!h-8 !font-semibold !pb-2"
                                    onClick={() =>
                                      router.push(
                                        `/daftarpesanan/${
                                          order.orderID
                                        }?transactionID=${
                                          order.transaction[0].transactionID
                                        }&${
                                          order.transaction[0].statusBuyer ===
                                          "Menunggu Pembayaran"
                                            ? "page=menunggu_pembayaran"
                                            : ""
                                        }`
                                      )
                                    }
                                  />
                                  {order.transaction[0].statusBuyer ===
                                    "Dikirim" && (
                                    <Button
                                      color="primary"
                                      children={t(
                                        "AppMuatpartsDaftarPesananBuyerLacakPesanan"
                                      )}
                                      Class="!h-8 !font-semibold !pb-2"
                                      onClick={() =>
                                        setOpenLacakMap((prev) => ({
                                          ...prev,
                                          [index]: true,
                                        }))
                                      }
                                    />
                                  )}
                                  {order.transaction[0].statusBuyer ===
                                    "Selesai" &&
                                    order.transaction[0].isReview === false && (
                                      <Button
                                        color="primary_secondary"
                                        children={t(
                                          // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0125
                                          "AppMuatpartsDaftarPesananBuyerBerikanUlasan"
                                        )}
                                        Class="!h-8 !font-semibold !pb-2"
                                        onClick={() => {
                                          setModalOpen(true);
                                          setModalConfig({
                                            withHeader: false,
                                            withClose: true,
                                            classname:
                                              "max-w-[472px] min-h-[545px]",
                                            onClose: resetForm,
                                          });
                                          setModalContent(
                                            <FormUlasan
                                              handleFilterOrderList={
                                                handleFilterOrderList
                                              }
                                              data={order}
                                              mutate={mutate}
                                            />
                                          );
                                        }}
                                      />
                                    )}

                                  {order.transaction[0].statusBuyer ===
                                    "Selesai" && (
                                    <Button
                                      color="primary"
                                      children={t(
                                        "AppMuatpartsDaftarPesananBuyerBeliLagi"
                                      )}
                                      Class="!h-8 !font-semibold !pb-2"
                                      onClick={() =>
                                        beliLagiMethod(order.transaction[0])
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="text-xs font-medium">
                                <span className="text-neutral-600">
                                  {order.transaction[0].statusInfo.text}
                                </span>
                                <span>
                                  {order.transaction[0].statusInfo.date}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {order.transaction[0].statusBuyer === "Dikirim" && (
                      <ModalComponent
                        isOpen={!!openLacakMap[index]}
                        setClose={() =>
                          setOpenLacakMap((prev) => ({
                            ...prev,
                            [index]: false,
                          }))
                        }
                        hideHeader
                        classnameContent={"!w-[472px] p-6 space-y-2"}
                      >
                        <div className="text-center font-bold">
                          {t("AppMuatpartsDaftarPesananBuyerLacakPesanan")}
                        </div>
                        <div className="h-[292px] w-[424px] overflow-auto py-5 px-4 border border-neutral-400 rounded-xl">
                          <OrderTimeline
                            trackingHistory={
                              order.transaction[0].trackingHistory
                            }
                          />
                        </div>
                      </ModalComponent>
                    )}
                  </>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center flex-col gap-6 py-1">
                <DataNotFound
                  classname={`w-[100px] mx-auto`}
                  type={search ? "search" : "data"}
                >
                  <div className="flex flex-col">
                    <p
                      className={` w-[257px] text-center text-[16px] text-neutral-600 font-[600]`}
                    >
                      {!search
                        ? t("AppMuatpartsDaftarPesananBuyerBelumAdaTransaksi")
                        : "Keyword Tidak Ditemukan"}
                    </p>
                    {!search && (
                      <p className="w-[257px] text-center text-[12px] text-neutral-600 font-[500]">
                        Yuk, mulai belanja dan penuhi berbagai kebutuhanmu di
                        muatparts
                      </p>
                    )}
                  </div>
                </DataNotFound>
                <Button
                  onClick={() => router.push("/")}
                  Class={`!h-8 !font-medium !pt-3.5 ${search ? "hidden" : ""}`}
                >
                  {t("AppMuatpartsDaftarPesananBuyerMulaiBelanja")}
                </Button>
              </div>
            )}
          </div>
          {totalProduct > 0 && (
            <div className="flex items-center justify-between px-6 mt-4 border-neutral-200 pt-4">
              <div className="flex items-center gap-2">
                {totalProduct > 0 &&
                  Array.from({
                    length: Math.min(
                      Math.ceil(totalProduct / paginate.size),
                      10
                    ),
                  }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-8 h-8 text-sm flex items-center justify-center rounded-md
                          ${
                            paginate.page === index + 1
                              ? "bg-[#C22716] text-white font-bold"
                              : "text-neutral-600 font-medium hover:bg-neutral-50"
                          }`}
                    >
                      {index + 1}
                    </button>
                  ))}
              </div>

              <div className="flex items-center gap-1">
                <p className="font-semibold text-xs text-neutral-600 pr-4">
                  {t("buttonShowDetails")}
                </p>
                <div className="flex gap-1 items-center">
                  {[10, 20, 40].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageSizeChange(item)}
                      className={`w-8 h-8 text-sm flex items-center justify-center rounded-md
                          ${
                            paginate.size === item
                              ? "bg-[#C22716] text-white font-bold"
                              : "text-neutral-600 font-medium hover:bg-neutral-50"
                          }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>)}

        
      </div>
    </>
  );
}

export default DaftarpesananWeb;
