"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { modal } from "@/store/modal";
import { WebModal } from "../firsttimer/web";
import { useFormProps } from "../firsttimer/page";
import toast from "@/store/toast";
import { Skeleton } from "@/app/profileseller/ProfilesellerWeb";
import SWRHandler from "@/services/useSWRHook";
import IconComponent from "@/components/IconComponent/IconComponent";
import MultipleItems from "@/components/ReactSlick/MultipleItems";
import ConfigUrl from "@/services/baseConfig";
import axios from "axios";
import { authZustand } from "@/store/auth/authZustand";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useLanguage } from "@/context/LanguageContext";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1/";

export default function Web({
  selectedVehicle,
  setSelectedVehicle,
  categories,
  setCategories,
  searchTerm,
  setSearchTerm,
  garageList,
  bannerImages,
  setTriggerList,
  categoryLists,
  mutateCategoryLists,
  t,
}) {
  const router = useCustomRouter();
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const [mainList, setMainList] = useState();
  const formProps = useFormProps();

  useEffect(() => {
    setMainList(selectedVehicle?.find((key) => key.isPrimary));
    if (selectedVehicle?.length === 0) router.push("/garasi");
  }, [selectedVehicle]);

  // if (!garageList)
  //   return (
  //     <div className="px-10 py-4">
  //       <Skeleton fill={10} />
  //     </div>
  //   );

  return (
    <>
      {/* Vehicle Card */}
      <div className="bg-[#F8F8FB] rounded-lg py-6 shadow-sm mb-8 flex items-center justify-center">
        <div className="flex items-center gap-6 h-fit">
          <div className="w-[116px] h-[116px] border border-neutral-400 rounded-md p-6 bg-neutral-50 relative">
            <Image
              src={mainList?.image || ""}
              alt={`${mainList?.brand} ${mainList?.model}`}
              width={68}
              height={68}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-between h-[116px]">
            <div className="flex flex-col justify-between">
              <span className="font-bold text-lg flex items-center gap-4">
                {mainList?.vehicle} · {mainList?.brand} · {mainList?.year}
                <div className="flex gap-4">
                  <IconComponent
                    src={"/icons/editgarasi.svg"}
                    width={20}
                    height={20}
                    classname="cursor-pointer"
                    onclick={() => {
                      // Tutup modal dulu
                      setModalOpen(false);

                      // Reset form state
                      formProps.setFormState({
                        vehicle: { value: "", error: "", id: "" },
                        brand: { value: "", error: "", id: "" },
                        year: { value: "", error: "", id: "" },
                        model: { value: "", error: "", id: "" },
                        type: { value: "", error: "", id: "" },
                      });

                      setTimeout(() => {
                        setModalContent(
                          <WebModal
                            key={mainList?.id}
                            mode="edit"
                            mutateCategoryLists={mutateCategoryLists}
                            initialData={{
                              id: mainList?.id,
                              type: mainList?.type,
                              brand: mainList?.brand,
                              year: mainList?.year,
                              model: mainList?.model,
                              variant: mainList?.vehicle,
                              typeID: mainList?.typeID,
                              brandID: mainList?.brandID,
                              modelID: mainList?.modelID,
                              variantID: mainList?.vehicleID,
                            }}
                            {...formProps}
                          />
                        );
                        setModalOpen(true);
                        setModalConfig({
                          width: 471,
                          height: 291,
                          classname: "!w-[471px] !h-fit",
                          withHeader: false,
                          withClose: true,
                        });
                      }, 100);
                    }}
                  />
                  <IconComponent
                    src={"/icons/deletegarasi.svg"}
                    width={20}
                    height={20}
                    classname="cursor-pointer"
                    onclick={() => {
                      setModalContent(
                        <HapusKendaraanModal
                          mutateCategoryLists={mutateCategoryLists}
                          setTriggerList={setTriggerList}
                          selectedVehicle={mainList}
                        />
                      );
                      setModalOpen(true);
                      setModalConfig({
                        width: 386,
                        classname: "!w-fit !h-fit",
                        withHeader: true,
                        withClose: true,
                      });
                    }}
                  />
                </div>
              </span>
              <p className="text-xs font-medium text-neutral-700 my-1">
                {mainList?.model}
              </p>
              <p className="text-xs font-medium text-neutral-700">
                {mainList?.type}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary_secondary"
                Class="!min-w-[112px] !h-8 !text-sm !font-semibold"
                onClick={() => {
                  setModalOpen(false);
                  setModalContent(
                    <DaftarKendaraanModal
                      selectedVehicle={selectedVehicle}
                      setTriggerList={setTriggerList}
                      mutateCategoryLists={mutateCategoryLists}
                      {...formProps}
                    />
                  );
                  setModalOpen(true);
                  setModalConfig({
                    classname: "!w-[564px] !h-fit",
                    withHeader: false,
                    withClose: true,
                  });
                }}
              >
                {t("AppManajemenGarasiMuatpartsGanti")} (
                {selectedVehicle?.length})
              </Button>
              <Button
                Class="!min-w-[112px] !text-sm !h-8 !font-semibold"
                onClick={() => {
                  setModalOpen(false);
                  setModalContent(
                    <WebModal
                      mode="add"
                      mutateCategoryLists={mutateCategoryLists}
                      {...formProps}
                    />
                  );
                  setModalOpen(true);
                  setModalConfig({
                    width: 471,
                    height: 291,
                    classname: "!w-[471px] !h-fit",
                    withHeader: false,
                    withClose: true,
                  });
                }}
              >
                {t("AppManajemenGarasiMuatpartsTambah")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8 p-6 mx-auto w-[690px]">
        <h3 className="text-lg text-center font-bold mb-4">
          {t("AppManajemenGarasiMuatpartsTitleSearchSection")} {mainList?.brand}{" "}
          {mainList?.year}
        </h3>
        <div className="flex gap-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2 text-neutral-600"
              size={16}
            />
            <Input
              placeholder={t("AppManajemenGarasiMuatpartsCariSukuCadang")}
              value={searchTerm}
              changeEvent={(e) => setSearchTerm(e.target.value)}
              classInput="w-full !pl-[30px]"
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-2 text-neutral-600 cursor-pointer"
                size={16}
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
          {/* // LB-0361, 25.03 */}
          <Button
            Class="!min-w-[112px] !text-sm !h-8 !font-semibold"
            onClick={() =>
              router.push(`/products?q=${searchTerm}&garageID=${mainList?.id}`)
            }
          >
            {t("AppManajemenGarasiMuatpartsCari")}
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-[100px] pb-6">
        <h3 className="text-lg font-bold mb-4">
          {t("AppManajemenGarasiMuatpartsKategoriUntuk")} {mainList?.brand}{" "}
          {mainList?.year}
        </h3>
        {categoryLists?.Data?.length > 0 ? (
          <div className="grid grid-cols-6 gap-4">
            {/* LB-101, 25.03 */}
            {categoryLists.Data.map((key, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-white p-[14px] rounded-md border hover:border-primary-600 cursor-pointer relative"
                  onClick={() =>
                    router.push(
                      `/products?categoryID=${key.id[1]},&garageID=${mainList?.id}`
                    )
                  }
                >
                  <div className="aspect-square relative mb-2">
                    <img
                      src={key.icon}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex gap-1 items-center justify-center text-center text-neutral-900 pt-3">
                    <p className="text-sm font-bold truncate">{key.value[1]}</p>
                    <p className="text-xs font-medium">({key.productCount})</p>
                  </div>
                  {/* {category.isRecommended && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Rekomendasi
                      </span>
                    </div>
                  )} */}
                </div>
              );
            })}
            {/* {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-[14px] rounded-md border hover:border-primary-600 cursor-pointer relative"
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={`/img/${category.icon}.png`}
                    alt={category.name}
                    // width={68}
                    // height={68}
                    className="object-contain"
                    fill
                  />
                </div>
                <div className="flex gap-2 items-center justify-center text-center text-neutral-900 pt-3">
                  <p className="text-sm font-bold">{category.name}</p>
                  <p className="text-xs font-medium">({category.count})</p>
                </div>
                {category.isRecommended && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Rekomendasi
                    </span>
                  </div>
                )}
              </div>
            ))} */}
          </div>
        ) : (
          <div className="mt-[44px] block">
            <DataNotFound
              width={95}
              image={"/img/daftarprodukicon.png"}
              title={t("AppManajemenGarasiMuatpartsBelumAdaKategoriYangCocok")}
              textClass="!w-full"
            />
          </div>
        )}
      </div>

      {bannerImages.length > 0 && (
        <section className="bg-white py-6">
          <div className="w-[1000px] mx-auto mb-[100px]">
            <MultipleItems
              images={bannerImages.map((val) => val.Image)}
              urls={bannerImages.map((val) => val.Url)}
              settings={{
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: true,
              }}
              size={1000}
              className="rounded-xl cursor-pointer"
            />
          </div>
        </section>
      )}
    </>
  );
}

export const DaftarKendaraanModal = ({
  selectedVehicle,
  setTriggerList,
  mutateCategoryLists,
}) => {
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const { setShowToast, setDataToast } = toast();
  const formProps = useFormProps();
  const { t } = useLanguage();

  const vehicleList = [
    {
      id: 1,
      year: "2022",
      brand: "Mitsubishi Fuso",
      imageUrl: "/img/chopper.png",
    },
    {
      id: 2,
      year: "2022",
      brand: "Scania",
      imageUrl: "/img/chopper.png",
    },
    {
      id: 3,
      year: "2022",
      brand: "FAW",
      imageUrl: "/img/chopper.png",
    },
    {
      id: 4,
      year: "2022",
      brand: "Hino",
      imageUrl: "/img/chopper.png",
    },
    {
      id: 5,
      year: "2022",
      brand: "Mercedes-Benz",
      imageUrl: "/img/chopper.png",
    },
  ];

  const [selectedKendaraan, setSelectedKendaraan] = useState(
    selectedVehicle?.find((key) => key.isPrimary)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const slidesPerView = 3;
  const maxIndex = Math.max(0, selectedVehicle.length - slidesPerView);

  useEffect(() => {
    setSelectedKendaraan(selectedVehicle?.find((key) => key.isPrimary));
  }, [selectedVehicle]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const ChangeMainGarasi = async (val) => {
    // if (selectedKendaraan.brand === val.brand) {
    try {
      await axios.put(`${api}muatparts/garasi/update_status/${val.id}`, null, {
        headers: {
          Authorization: `Bearer ${authZustand.getState().accessToken}`,
          refreshToken: authZustand.getState().refreshToken,
        },
      });

      setSelectedKendaraan(val);
      setModalOpen(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: t("labelKendaraanBerhasilDiganti"),
      });
      mutateCategoryLists();

      setTriggerList(true);
    } catch (error) {
      console.error("Save store error:", error);
      throw error;
    }
    // }
  };

  // autofocus e mas ary
  useEffect(() => {
    if (selectedVehicle && selectedKendaraan) {
      const activeIndex = selectedVehicle.findIndex(
        (vehicle) => vehicle.id === selectedKendaraan.id
      );

      if (activeIndex !== -1) {
        let targetIndex = Math.max(0, activeIndex - 1);
        if (targetIndex > maxIndex) targetIndex = maxIndex;
        setCurrentIndex(targetIndex);
      }
    }
  }, [selectedVehicle, selectedKendaraan, maxIndex]);

  return (
    <div className="py-8">
      <h1 className="text-lg font-bold mb-4 mx-auto text-center">
        {t("AppManajemenGarasiMuatpartsDaftarKendaraan")}
      </h1>

      {/* Vehicle Cards */}
      <div className="relative mb-6">
        {/* Navigation Buttons */}
        {selectedVehicle.length > slidesPerView && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md ${
                currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md ${
                currentIndex >= maxIndex
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="w-[384px] mx-auto">
          {" "}
          {/* 120px * 3 cards + 8px * 2 gaps = 384px */}
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-2 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 125}px)`, // 120px card + 2px gap
              }}
            >
              {selectedVehicle.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`flex-none w-[120px] border cursor-pointer ${
                    vehicle.id === selectedKendaraan.id
                      ? "bg-primary-50 border-primary-700"
                      : "bg-white border-neutral-400 hover:border-primary-700"
                  } rounded-lg p-3`}
                  onClick={() => ChangeMainGarasi(vehicle)}
                >
                  <div className="relative w-full aspect-square mb-2">
                    <img
                      src={vehicle.image}
                      alt={vehicle.brand}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold">{vehicle.year} •</p>
                    <p className="text-xs font-semibold">{vehicle.brand}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Button */}
      <Button
        Class="!w-[174px] !h-8 !font-semibold text-sm mx-auto"
        onClick={() => {
          setModalOpen(false);
          setModalContent(<WebModal mode="add" {...formProps} />);
          setModalOpen(true);
          setModalConfig({
            width: 471,
            height: 291,
            classname: "!w-[471px] !h-fit",
            withHeader: false,
            withClose: true,
          });
        }}
      >
        {t("AppManajemenGarasiMuatpartsTambahKendaraan")}
      </Button>
    </div>
  );
};

export const HapusKendaraanModal = ({
  selectedVehicle,
  setTriggerList,
  mutateCategoryLists,
}) => {
  const { t } = useLanguage();
  const { setShowToast, setDataToast } = toast();
  const { setModalOpen } = modal();
  const { useSWRMutateHook } = SWRHandler();
  const { data: dataDeleteMainGarasi, trigger: mutateDeleteMainGarasi } =
    useSWRMutateHook(
      `v1/muatparts/garasi/delete/${selectedVehicle.id}`,
      "DELETE"
    );

  const handleDelete = async () => {
    try {
      await mutateDeleteMainGarasi(
        null,
        `${api}muatparts/garasi/delete/${selectedVehicle.id}`,
        "DELETE"
      );
      setModalOpen(false);
      setShowToast(true);
      setDataToast({
        message: t("labelKendaraanBerhasilDihapus"),
        type: "success",
      });
      setTimeout(() => {
        setTriggerList(true);
        mutateCategoryLists();
      }, 100);
    } catch (error) {
      console.error("Delete store error:", error);
      setDataToast({
        message: "Terjadi kesalahan saat menghapus kendaraan",
        type: "error",
      });
      setShowToast(true);
    }
  };

  return (
    <div className="p-9 space-y-6 sm:space-y-4 w-fit">
      <span className="hidden sm:block font-bold text-base text-center text-neutral-900 ">
        {t("AppManajemenGarasiMuatpartsTitlePopUpHapusKendaraan")}
      </span>
      <span className="font-medium text-sm leading-[16.8px] text-center text-neutral-900 block w-[338px] sm:w-auto sm:flex sm:justify-center !mt-0 sm:pt-4">
        {t("AppManajemenGarasiMuatpartsBodyPopUpHapusKendaraan")}
      </span>
      <div className="!font-semibold !text-sm flex gap-2 w-fit justify-center mx-auto">
        <Button
          color="primary_secondary"
          Class="!w-[112px] !h-8 !font-semibold"
          onClick={() => setModalOpen(false)}
        >
          {t("AppMuatpartsUlasanBuyerBatal")}
        </Button>
        <Button Class="!w-[112px] !h-8 !font-semibold" onClick={handleDelete}>
          {t("AppManajemenGarasiMuatpartsYa")}
        </Button>
      </div>
    </div>
  );
};
